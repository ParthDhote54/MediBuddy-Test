const medicineCache = new Map();

export function normalizeQuery(value = '') {
  return String(value).trim().toLowerCase();
}

export function getOpenFdaValue(medicine, field) {
  if (!medicine || !medicine.openfda) {
    return '';
  }

  const value = medicine.openfda[field];

  if (Array.isArray(value)) {
    return value
      .filter((entry) => entry !== undefined && entry !== null && entry !== '')
      .map((entry) => String(entry))
      .join(', ');
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
}

export function buildMedicineId(medicine, fallback = 'medicine') {
  if (!medicine) {
    return fallback;
  }

  const openFda = medicine.openfda || {};

  return (
    openFda.spl_set_id?.[0] ||
    openFda.product_ndc?.[0] ||
    openFda.package_ndc?.[0] ||
    openFda.application_number?.[0] ||
    openFda.rxcui?.[0] ||
    medicine.id ||
    fallback
  );
}

export async function fetchMedicineByBrand(searchTerm, { signal } = {}) {
  const normalizedQuery = normalizeQuery(searchTerm);

  if (!normalizedQuery) {
    return [];
  }

  if (medicineCache.has(normalizedQuery)) {
    return medicineCache.get(normalizedQuery);
  }

  const searchQuery = `openfda.brand_name:"${normalizedQuery}"`;
  const endpoint = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(searchQuery)}&limit=20`;

  let response;

  try {
    response = await fetch(endpoint, { signal });
  } catch (error) {
    if (error && error.name === 'AbortError') {
      throw error;
    }

    const networkError = new Error('Network issue while fetching medicines');
    networkError.cause = error;
    throw networkError;
  }

  if (response.status === 404) {
    const emptyResults = [];
    medicineCache.set(normalizedQuery, emptyResults);
    return emptyResults;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    const malformedError = new Error('Malformed response received from the FDA API');
    malformedError.cause = error;
    throw malformedError;
  }

  const results = Array.isArray(payload?.results) ? payload.results : [];
  medicineCache.set(normalizedQuery, results);

  return results;
}
