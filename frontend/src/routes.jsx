import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Daily from './pages/Daily';
import Login from './pages/Login';
import DaySummary from './pages/DaySummary'
import MonthSummary from './pages/MonthSummary';

import ProtectedRoute from './components/ProtectedRoute'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/daily-records" element={
          <ProtectedRoute>
            <Daily />
          </ProtectedRoute>
        } />

        <Route path="/salesDay-summary" element={
          <ProtectedRoute>
            <DaySummary />
          </ProtectedRoute>
        } />

        <Route path="/month-summary" element={
          <ProtectedRoute>
            <MonthSummary />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
