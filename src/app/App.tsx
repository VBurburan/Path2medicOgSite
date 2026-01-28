import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TutoringPage from './pages/TutoringPage';
import PracticePlatformPage from './pages/PracticePlatformPage';
import EducatorsPage from './pages/EducatorsPage';
import AboutPage from './pages/AboutPage';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { DashboardPage } from '../../pages/DashboardPage';
import CustomerPortalPage from './pages/CustomerPortalPage';
import ContactPage from './pages/ContactPage';
import AdminSetupPage from './pages/AdminSetupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/tutoring" element={<TutoringPage />} />
          <Route path="/practice" element={<PracticePlatformPage />} />
          <Route path="/educators" element={<EducatorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin-setup" element={<AdminSetupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/portal" element={<ProtectedRoute><CustomerPortalPage /></ProtectedRoute>} />
          <Route path="/customer-portal" element={<ProtectedRoute><CustomerPortalPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
  );
}
