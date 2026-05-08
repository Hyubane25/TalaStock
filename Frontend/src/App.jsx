import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import ManagementPage from './pages/ManagementPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/management" element={<ManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
