import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import logo from '@/assets/logo.png';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

/* ── brand palette ── */
const NAVY = '#0D2137';
const RED = '#E03038';
const TEAL = '#1a5f7a';
const BG = '#f5f5f5';

const CERT_LEVELS = ['EMT', 'AEMT', 'Paramedic'] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  /* tab state */
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  /* login fields */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  /* register fields */
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regCert, setRegCert] = useState<string>('EMT');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  /* ── login handler ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        if (error.message === 'Invalid login credentials') {
          setLoginError(
            'Invalid email or password. Please check your credentials or create an account.',
          );
        } else {
          setLoginError(error.message);
        }
      } else {
        navigate('/dashboard');
      }
    } catch {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  /* ── register handler ── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    setRegLoading(true);

    try {
      const { error } = await signUp(regEmail, regPassword, regName, regCert);
      if (error) {
        setRegError(error.message ?? 'Registration failed. Please try again.');
      } else {
        setRegSuccess(
          'Account created! Please check your email to confirm, then log in.',
        );
        // Clear form
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirm('');
        setRegCert('EMT');
      }
    } catch {
      setRegError('An unexpected error occurred during registration.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <Layout>
      <section
        className="py-16 min-h-screen flex items-center"
        style={{ backgroundColor: BG }}
      >
        <div className="max-w-md mx-auto w-full px-4">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Path2Medic" className="h-16 w-auto" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setRegError('');
                  setRegSuccess('');
                }}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  activeTab === 'login'
                    ? 'border-b-2 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={
                  activeTab === 'login'
                    ? { backgroundColor: NAVY, borderColor: RED }
                    : {}
                }
              >
                <LogIn className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setLoginError('');
                }}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  activeTab === 'register'
                    ? 'border-b-2 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={
                  activeTab === 'register'
                    ? { backgroundColor: NAVY, borderColor: RED }
                    : {}
                }
              >
                <UserPlus className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                Register
              </button>
            </div>

            {/* ── Login Tab ── */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="p-6 space-y-5">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold" style={{ color: NAVY }}>
                    Welcome Back
                  </h2>
                  <p className="text-sm text-gray-500">
                    Sign in to your NREMT prep account
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPw(!showLoginPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="text-right">
                  <Link
                    to="#"
                    className="text-sm hover:underline"
                    style={{ color: TEAL }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error */}
                {loginError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {loginError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: NAVY }}
                >
                  {loginLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* ── Register Tab ── */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="p-6 space-y-5">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold" style={{ color: NAVY }}>
                    Create Account
                  </h2>
                  <p className="text-sm text-gray-500">
                    Start your NREMT prep journey today
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Certification Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Level
                  </label>
                  <select
                    value={regCert}
                    onChange={(e) => setRegCert(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                    style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                  >
                    {CERT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showRegPw ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPw(!showRegPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                  />
                </div>

                {/* Error / Success */}
                {regError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    {regSuccess}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-2.5 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: NAVY }}
                >
                  {regLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>

          {/* Footer links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our{' '}
            <Link to="#" className="hover:underline" style={{ color: TEAL }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="hover:underline" style={{ color: TEAL }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
