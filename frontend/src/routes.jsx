import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Daily from './pages/Daily';
import SalesSummary from './pages/SalesSummary';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/daily-records" element={
          <ProtectedRoute>
            <Daily />
          </ProtectedRoute>
        } />

        <Route path="/sales-summary" element={
          <ProtectedRoute>
            <SalesSummary />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
