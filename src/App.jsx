import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import MedicineDetail from './pages/MedicineDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/medicine/:id" element={<MedicineDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
