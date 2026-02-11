import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import logoLight from '@/assets/logo-light.jpg';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const NAVY = '#0D2137';
const TEAL = '#1a5f7a';
const BG = '#f8f9fa';
const CERT_LEVELS = ['EMT', 'AEMT', 'Paramedic'] as const;

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [cert, setCert] = useState<string>('EMT');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await signUp(email, password, name, cert);
      if (signUpError) {
        setError(signUpError.message ?? 'Registration failed. Please try again.');
      } else {
        setSuccess('Account created! Please check your email to confirm, then log in.');
      }
    } catch {
      setError('An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 min-h-screen flex items-center" style={{ backgroundColor: BG }}>
        <div className="max-w-md mx-auto w-full px-4">
          <div className="flex justify-center mb-8">
            <img src={logoLight} alt="Path2Medic" className="h-20 w-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>Create Account</h2>
                <p className="text-sm text-gray-500">Start your NREMT prep journey today</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Certification Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Level</label>
                <select
                  value={cert}
                  onChange={(e) => setCert(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                  style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                >
                  {CERT_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
              )}
              {success && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">{success}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: NAVY }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: TEAL }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
