import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TutoringPage from './pages/TutoringPage';
import PracticePlatformPage from './pages/PracticePlatformPage';
import EducatorsPage from './pages/EducatorsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import CustomerPortalPage from './pages/CustomerPortalPage';
import ContactPage from './pages/ContactPage';
import AdminSetupPage from './pages/AdminSetupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tutoring" element={<TutoringPage />} />
        <Route path="/practice" element={<PracticePlatformPage />} />
        <Route path="/educators" element={<EducatorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-setup" element={<AdminSetupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/portal" element={<CustomerPortalPage />} />
        <Route path="/customer-portal" element={<CustomerPortalPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}