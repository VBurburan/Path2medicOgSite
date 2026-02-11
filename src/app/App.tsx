import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import TutoringPage from './pages/TutoringPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EducatorsPage from './pages/EducatorsPage';
import LoginPage from './pages/LoginPage';

// Protected student portal pages
import DashboardPage from './pages/DashboardPage';
import ExamsPage from './pages/ExamsPage';
import PracticePage from './pages/PracticePage';
import PracticeSessionPage from './pages/PracticeSessionPage';
import PracticeResultsPage from './pages/PracticeResultsPage';
import ResultsPage from './pages/ResultsPage';
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';

// Coaching pipeline (direct access)
import IntakeExamPage from './pages/IntakeExamPage';
import PosttestExamPage from './pages/PosttestExamPage';

// B2B Instructor (scaffolded)
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorGenerate from './pages/instructor/InstructorGenerate';
import InstructorExams from './pages/instructor/InstructorExams';
import InstructorStudents from './pages/instructor/InstructorStudents';
import InstructorAnalytics from './pages/instructor/InstructorAnalytics';

// Admin
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSetupPage from './pages/AdminSetupPage';
import AdminAssetsPage from './pages/AdminAssetsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Marketing Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/tutoring" element={<TutoringPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/educators" element={<EducatorsPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Student Portal */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
          <Route path="/practice/session" element={<ProtectedRoute><PracticeSessionPage /></ProtectedRoute>} />
          <Route path="/practice/results" element={<ProtectedRoute><PracticeResultsPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Coaching Pipeline (accessible via direct link) */}
          <Route path="/exam/intake/:level" element={<IntakeExamPage />} />
          <Route path="/exam/posttest/:examId" element={<PosttestExamPage />} />

          {/* B2B Instructor (Protected) */}
          <Route path="/instructor" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/generate" element={<ProtectedRoute><InstructorGenerate /></ProtectedRoute>} />
          <Route path="/instructor/exams" element={<ProtectedRoute><InstructorExams /></ProtectedRoute>} />
          <Route path="/instructor/students" element={<ProtectedRoute><InstructorStudents /></ProtectedRoute>} />
          <Route path="/instructor/analytics" element={<ProtectedRoute><InstructorAnalytics /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin-setup" element={<AdminSetupPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/assets" element={<AdminAssetsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
