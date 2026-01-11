import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import Actifsmanager from './Components/Actifsmanager';
import Passifsmanager from './Components/Passifsmanager';
import Chargesmanager from './Components/Chargesmanager';
import Produitsmanager from './Components/Produitsmanager';
import Facturesmanager from './Components/Facturesmanager';
import './App.css';

function App() {
  return (
  
        <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="actifs" element={<Actifsmanager />} />
    <Route path="passifs" element={<Passifsmanager />} />
    <Route path="charges" element={<Chargesmanager />} />
    <Route path="produits" element={<Produitsmanager />} />
    <Route path="factures" element={<Facturesmanager />} />
  </Route>
</Routes>
    
  );
}

export default App;