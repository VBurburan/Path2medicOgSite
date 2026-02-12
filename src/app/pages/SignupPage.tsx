import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoLight from '@/assets/logo-light.jpg';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, ChevronDown } from 'lucide-react';

const NAVY = '#0D2137';
const ACCENT = '#E03038';
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

  const inputBase =
    'w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 placeholder:text-gray-300 focus:outline-none focus:border-[#0D2137] focus:ring-2 focus:ring-[#0D2137]/10 focus:bg-white transition-all duration-200';

  return (
    <div className="min-h-screen flex">
      {/* Left: Branded panel */}
      <div
        className="hidden lg:flex lg:w-[480px] flex-col justify-between relative overflow-hidden"
        style={{ backgroundColor: NAVY }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}dd, transparent)` }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 p-10 pt-12">
          <img src={logoLight} alt="Path2Medic" className="h-14 w-auto mb-20" />
          <h2 className="text-[2.1rem] font-extrabold text-white leading-[1.18] mb-5 tracking-[-0.02em]">
            Join thousands<br />preparing smarter.
          </h2>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-[340px]">
            Create your free account and start preparing for your NREMT certification exam today.
          </p>
        </div>

        <div className="relative z-10 p-10 pb-8 flex flex-col gap-4">
          <p className="text-white/40 text-[13px] font-medium tracking-wide">
            Trusted by 500+ EMS students nationwide
          </p>
          <p className="text-white/25 text-xs">&copy; {new Date().getFullYear()} Path2Medic. All rights reserved.</p>
        </div>
      </div>

      {/* Right: Signup form */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f6f8] px-4 py-12">
        <div
          className="w-full max-w-[420px]"
          style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden">
            <img src={logoLight} alt="Path2Medic" className="h-16 w-auto" />
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)' }}
          >
            <form onSubmit={handleSubmit} className="p-8 space-y-5" noValidate>
              {/* Header */}
              <div
                className="mb-1"
                style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
              >
                <h2 className="text-[22px] font-bold tracking-[-0.01em]" style={{ color: NAVY }}>
                  Create account
                </h2>
                <p className="text-sm text-gray-400 mt-1.5">Start your NREMT prep journey</p>
              </div>

              {/* Full Name */}
              <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both' }}>
                <label htmlFor="signup-name" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" aria-hidden="true" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.16s both' }}>
                <label htmlFor="signup-email" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" aria-hidden="true" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              {/* Certification Level */}
              <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                <label htmlFor="signup-cert" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  Certification Level
                </label>
                <div className="relative">
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <select
                    id="signup-cert"
                    value={cert}
                    onChange={(e) => setCert(e.target.value)}
                    className={`${inputBase} bg-white appearance-none pr-10 cursor-pointer`}
                  >
                    {CERT_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.24s both' }}>
                <label htmlFor="signup-password" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" aria-hidden="true" />
                  <input
                    id="signup-password"
                    type={showPw ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={`${inputBase} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-all duration-300 focus:outline-none focus:text-gray-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s both' }}>
                <label htmlFor="signup-confirm" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" aria-hidden="true" />
                  <input
                    id="signup-confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-lg bg-red-50 border border-red-200/80 p-3.5 text-sm text-red-600 flex items-start gap-2.5"
                >
                  <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl bg-green-50 border border-green-200/80 p-4 text-sm text-green-700 flex items-start gap-2.5"
                >
                  <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  {success}
                </div>
              )}

              {/* Submit */}
              <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s both' }}>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:ring-offset-2"
                  style={{ backgroundColor: NAVY }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p
            className="text-center text-sm text-gray-400 mt-7"
            style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.36s both' }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline transition-all duration-300 focus:outline-none focus:underline"
              style={{ color: NAVY }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
