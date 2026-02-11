import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import logoLight from '@/assets/logo-light.jpg';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const NAVY = '#0D2137';
const ACCENT = '#E03038';

/* keyframes injected once */
const fadeStyle = document.getElementById('auth-fade-style') || (() => {
  const s = document.createElement('style');
  s.id = 'auth-fade-style';
  s.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
  return s;
})();
void fadeStyle;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Branded panel ── */}
      <div
        className="hidden lg:flex lg:w-[480px] flex-col justify-between relative overflow-hidden"
        style={{ backgroundColor: NAVY }}
      >
        {/* Red accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}dd, transparent)` }}
        />

        {/* Dot pattern overlay */}
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
            Don't worry,<br />we've got you.
          </h2>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-[340px]">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="relative z-10 p-10 pb-8 flex flex-col gap-4">
          <p className="text-white/40 text-[13px] font-medium tracking-wide">
            Trusted by 500+ EMS students nationwide
          </p>
          <p className="text-white/25 text-xs">&copy; {new Date().getFullYear()} Path2Medic. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right: Reset form ── */}
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
            <div className="p-8 space-y-6">
              {/* Header */}
              <div
                className="mb-2"
                style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
              >
                <h2 className="text-[22px] font-bold tracking-[-0.01em]" style={{ color: NAVY }}>
                  Reset password
                </h2>
                <p className="text-sm text-gray-400 mt-1.5">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {success ? (
                <div
                  className="rounded-xl bg-green-50 border border-green-200/80 p-6 text-center"
                  style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-sm font-semibold text-green-800 mb-1.5">Check your email</p>
                  <p className="text-sm text-green-600 leading-relaxed">
                    We've sent a password reset link to <strong>{email}</strong>. You can close this page.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 placeholder:text-gray-300 focus:outline-none focus:border-[#0D2137] focus:ring-2 focus:ring-[#0D2137]/10 focus:bg-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200/80 p-3.5 text-sm text-red-600 flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <div style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                      style={{ backgroundColor: NAVY }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <p
            className="text-center text-sm text-gray-400 mt-7"
            style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both' }}
          >
            <Link
              to="/login"
              className="font-semibold hover:underline inline-flex items-center gap-1.5 transition-all duration-300"
              style={{ color: NAVY }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
