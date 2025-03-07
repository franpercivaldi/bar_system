import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Daily from './pages/Daily';
import SalesSummary from './pages/SalesSummary';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-records" element={<Daily />} />
        <Route path="/sales-summary" element={<SalesSummary />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
