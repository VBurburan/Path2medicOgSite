import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// HomePage loads eagerly (landing page)
import HomePage from './pages/HomePage';

// Everything else is lazy-loaded
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const TutoringPage = lazy(() => import('./pages/TutoringPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const EducatorsPage = lazy(() => import('./pages/EducatorsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const PracticeSessionPage = lazy(() => import('./pages/PracticeSessionPage'));
const PracticeResultsPage = lazy(() => import('./pages/PracticeResultsPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const IntakeExamPage = lazy(() => import('./pages/IntakeExamPage'));
const PosttestExamPage = lazy(() => import('./pages/PosttestExamPage'));

const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard'));
const InstructorGenerate = lazy(() => import('./pages/instructor/InstructorGenerate'));
const InstructorExams = lazy(() => import('./pages/instructor/InstructorExams'));
const InstructorStudents = lazy(() => import('./pages/instructor/InstructorStudents'));
const InstructorAnalytics = lazy(() => import('./pages/instructor/InstructorAnalytics'));

const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminSetupPage = lazy(() => import('./pages/AdminSetupPage'));
const AdminAssetsPage = lazy(() => import('./pages/AdminAssetsPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2137]" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" richColors />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Marketing Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/tutoring" element={<TutoringPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/educators" element={<EducatorsPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Student Portal */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
            <Route path="/practice/session" element={<ProtectedRoute><PracticeSessionPage /></ProtectedRoute>} />
            <Route path="/practice/results" element={<ProtectedRoute><PracticeResultsPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
