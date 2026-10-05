import { useNavigate } from 'react-router-dom';
import { buildMedicineId, getOpenFdaValue } from '../api/medicines';

function MedicineCard({ medicine, onSelect }) {
  const navigate = useNavigate();
  const brandName = getOpenFdaValue(medicine, 'brand_name') || 'Medicine';
  const genericName = getOpenFdaValue(medicine, 'generic_name');
  const manufacturerName = getOpenFdaValue(medicine, 'manufacturer_name');
  const productType = getOpenFdaValue(medicine, 'product_type');
  const route = getOpenFdaValue(medicine, 'route');
  const medicineId = buildMedicineId(medicine, 'medicine');

  const handleSelect = () => {
    if (onSelect) {
      onSelect(medicine);
      return;
    }

    const selectedMedicine = { ...medicine, medicineId };

    try {
      sessionStorage.setItem('selectedMedicine', JSON.stringify(selectedMedicine));
    } catch {
      // Browser storage can fail; the app still works without it.
    }

    navigate(`/medicine/${encodeURIComponent(medicineId)}`);
  };

  return (
    <article className="medicine-card">
      <div className="medicine-card__header">
        <h3>{brandName}</h3>
        {productType ? <span className="medicine-card__type">{productType}</span> : null}
      </div>

      <dl className="medicine-card__details">
        {genericName ? (
          <div>
            <dt>Generic</dt>
            <dd>{genericName}</dd>
          </div>
        ) : null}

        {manufacturerName ? (
          <div>
            <dt>Manufacturer</dt>
            <dd>{manufacturerName}</dd>
          </div>
        ) : null}

        {productType ? (
          <div>
            <dt>Product Type</dt>
            <dd>{productType}</dd>
          </div>
        ) : null}

        {route ? (
          <div>
            <dt>Route</dt>
            <dd>{route}</dd>
          </div>
        ) : null}
      </dl>

      <button type="button" className="medicine-card__link" onClick={handleSelect}>
        View Details →
      </button>
    </article>
  );
}

export default MedicineCard;
