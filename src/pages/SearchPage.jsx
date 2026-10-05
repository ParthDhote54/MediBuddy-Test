import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildMedicineId, fetchMedicineByBrand, normalizeQuery } from '../api/medicines';
import MedicineCard from '../components/MedicineCard';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const activeRequestRef = useRef(null);
  const lastRequestedRef = useRef('');
  const navigate = useNavigate();

  const handleSearch = async (term) => {
    const normalizedQuery = normalizeQuery(term);

    if (!normalizedQuery) {
      setResults([]);
      setStatus('idle');
      setErrorMessage('');
      lastRequestedRef.current = '';
      return;
    }

    if (normalizedQuery === lastRequestedRef.current && activeRequestRef.current) {
      return;
    }

    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    lastRequestedRef.current = normalizedQuery;

    setStatus('loading');
    setErrorMessage('');
    setResults([]);

    try {
      const medicineResults = await fetchMedicineByBrand(normalizedQuery, {
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return;
      }

      setResults(medicineResults);
      setStatus(medicineResults.length ? 'success' : 'empty');
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      setStatus('error');
      setErrorMessage('Something went wrong while fetching medicines.');
    }
  };

  useEffect(() => {
    const trimmedValue = debouncedSearch.trim();

    if (!trimmedValue) {
      return;
    }

    if (trimmedValue === lastRequestedRef.current) {
      return;
    }

    void handleSearch(trimmedValue);
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

  const handleSelectMedicine = (medicine) => {
    const selectedMedicine = {
      ...medicine,
      medicineId: buildMedicineId(medicine, 'medicine'),
    };

    try {
      sessionStorage.setItem('selectedMedicine', JSON.stringify(selectedMedicine));
    } catch {
      // Ignore storage failures so the UI still works.
    }

    navigate(`/medicine/${encodeURIComponent(selectedMedicine.medicineId)}`);
  };

  return (
    <main className="page-shell">
      <div className="search-page">
        <header className="page-header">
          <p className="eyebrow">Medication finder</p>
          <h1>Medicine Search</h1>
          <p className="subtitle">Search medicines by brand name</p>
        </header>

        <SearchBar
          value={searchTerm}
          onChange={(event) => {
            const nextValue = event.target.value;
            setSearchTerm(nextValue);

            if (!nextValue.trim()) {
              setResults([]);
              setStatus('idle');
              setErrorMessage('');
              lastRequestedRef.current = '';

              if (activeRequestRef.current) {
                activeRequestRef.current.abort();
              }
            }
          }}
          onSearch={handleSearch}
          isLoading={status === 'loading'}
        />

        <section className="results-panel" aria-live="polite">
          {status === 'loading' ? (
            <div className="state-box state-loading">Searching medicines...</div>
          ) : null}

          {status === 'empty' ? (
            <div className="state-box state-empty">
              <p>No results found</p>
              <span>Try searching with another brand name.</span>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="state-box state-error">
              <p>{errorMessage}</p>
              <button type="button" onClick={() => handleSearch(searchTerm)}>
                Retry
              </button>
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="results-grid">
              {results.map((medicine, index) => (
                <MedicineCard
                  key={buildMedicineId(medicine, `fallback-${index}`)}
                  medicine={medicine}
                  onSelect={handleSelectMedicine}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default SearchPage;
