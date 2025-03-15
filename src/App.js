// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal para login/registro */}
        <Route path="/" element={<AuthPage />} />

        {/* Ruta protegida de ejemplo */}

        {/* Ruta por defecto (fallback) */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
