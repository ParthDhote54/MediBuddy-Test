import { Link, useNavigate, useParams } from 'react-router-dom';
import { buildMedicineId, getOpenFdaValue } from '../api/medicines';

function readSelectedMedicine() {
  try {
    const value = sessionStorage.getItem('selectedMedicine');
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

const detailFields = [
  ['Brand Name', 'brand_name'],
  ['Generic Name', 'generic_name'],
  ['Manufacturer', 'manufacturer_name'],
  ['Product Type', 'product_type'],
  ['Route', 'route'],
  ['Substance Name', 'substance_name'],
  ['Pharmacological Class', 'pharm_class'],
  ['Application Number', 'application_number'],
  ['RxCUI', 'rxcui'],
  ['Product NDC', 'product_ndc'],
];

function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(id || '');
  const medicine = readSelectedMedicine();
  const isValidMedicine = medicine && buildMedicineId(medicine, 'medicine') === decodedId;

  if (!isValidMedicine) {
    return (
      <main className="page-shell">
        <section className="detail-empty state-box">
          <p>Medicine information is not available.</p>
          <Link to="/" className="back-link">
            Back to Search
          </Link>
        </section>
      </main>
    );
  }

  const details = detailFields
    .map(([label, field]) => {
      const value = getOpenFdaValue(medicine, field);

      return value ? { label, value } : null;
    })
    .filter(Boolean);

  return (
    <main className="page-shell">
      <div className="detail-page">
        <button type="button" className="back-link back-button" onClick={() => navigate(-1)}>
          ← Back to Results
        </button>

        <article className="detail-card">
          <h1>{getOpenFdaValue(medicine, 'brand_name') || 'Medicine Detail'}</h1>

          {details.length ? (
            <dl className="detail-list">
              {details.map((detail) => (
                <div key={detail.label} className="detail-item">
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="detail-empty-message">No additional medicine details are available.</p>
          )}
        </article>
        
      </div>
    </main>
  );
}

export default MedicineDetail;
