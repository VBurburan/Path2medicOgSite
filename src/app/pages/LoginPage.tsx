import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoLight from '@/assets/logo-light.jpg';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const NAVY = '#0D2137';
const ACCENT = '#E03038';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please check your credentials or create an account.');
        } else {
          setError(signInError.message);
        }
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branded panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between p-10" style={{ backgroundColor: NAVY }}>
        <div>
          <img src={logoLight} alt="Path2Medic" className="h-14 w-auto mb-16" />
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Your NREMT<br />success starts here.
          </h2>
          <p className="text-white/50 text-base leading-relaxed">
            Evidence-based coaching and practice questions designed for the new exam format.
          </p>
        </div>
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Path2Medic. All rights reserved.</p>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f6f8] px-4 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logoLight} alt="Path2Medic" className="h-16 w-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
            <form onSubmit={handleLogin} className="p-7 space-y-5">
              <div className="mb-1">
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>Welcome back</h2>
                <p className="text-sm text-gray-400 mt-1">Sign in to continue your prep</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2137]/20 focus:border-[#0D2137]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2137]/20 focus:border-[#0D2137]/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: ACCENT }}>
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: NAVY }}
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: NAVY }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
