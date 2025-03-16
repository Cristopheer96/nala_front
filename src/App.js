import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layout/DashboardLayout';

import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import ImportPage from './pages/vacations/ImportPage';
import RequestPage from './pages/vacations/RequestPage';
import ManageVacationsPage from './pages/vacations/ManageVacationsPage';
import LeaveAnalyticsPage from './pages/vacations/LeaveAnalyticsPage';

function App() {
  const isLoggedIn = localStorage.getItem('access-token');

  return (
    <Router>
      <Routes>
        {!isLoggedIn && (
          <Route path="*" element={<AuthPage />} />
        )}
        {isLoggedIn && (
          <>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="usuarios" element={<UsersPage />} />
              <Route path="vacaciones/importar" element={<ImportPage />} />
              <Route path="vacaciones/gestionar" element={<ManageVacationsPage />} />
              <Route path="vacaciones/solicitar" element={<RequestPage />} />
              <Route path="vacaciones/nala_analytics" element={<LeaveAnalyticsPage />} />

              {/* Ruta catch-all */}
              <Route path="*" element={<HomePage />} />
            </Route>

            {/* Ruta fallback */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
