import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded route components for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const TutoringPage = React.lazy(() => import('./pages/TutoringPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const EducatorsPage = React.lazy(() => import('./pages/EducatorsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ExamsPage = React.lazy(() => import('./pages/ExamsPage'));
const PracticePage = React.lazy(() => import('./pages/PracticePage'));
const PracticeSessionPage = React.lazy(() => import('./pages/PracticeSessionPage'));
const PracticeResultsPage = React.lazy(() => import('./pages/PracticeResultsPage'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const IntakeExamPage = React.lazy(() => import('./pages/IntakeExamPage'));
const PosttestExamPage = React.lazy(() => import('./pages/PosttestExamPage'));

const InstructorDashboard = React.lazy(() => import('./pages/instructor/InstructorDashboard'));
const InstructorGenerate = React.lazy(() => import('./pages/instructor/InstructorGenerate'));
const InstructorExams = React.lazy(() => import('./pages/instructor/InstructorExams'));
const InstructorStudents = React.lazy(() => import('./pages/instructor/InstructorStudents'));
const InstructorAnalytics = React.lazy(() => import('./pages/instructor/InstructorAnalytics'));

const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));
const AdminSetupPage = React.lazy(() => import('./pages/AdminSetupPage'));
const AdminAssetsPage = React.lazy(() => import('./pages/AdminAssetsPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8]">
      <div className="text-center">
        <div className="h-10 w-10 border-[3px] border-[#0D2137]/15 border-t-[#0D2137] rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400 mt-4 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
