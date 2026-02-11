import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import logoLight from '@/assets/logo-light.jpg';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const NAVY = '#0D2137';

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
      {/* Left: Branded panel */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between p-10" style={{ backgroundColor: NAVY }}>
        <div>
          <img src={logoLight} alt="Path2Medic" className="h-14 w-auto mb-16" />
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Don't worry,<br />we've got you.
          </h2>
          <p className="text-white/50 text-base leading-relaxed">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Path2Medic. All rights reserved.</p>
      </div>

      {/* Right: Reset form */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f6f8] px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logoLight} alt="Path2Medic" className="h-16 w-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="p-7 space-y-5">
              <div className="mb-1">
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>Reset password</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {success ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-green-800 mb-1">Check your email</p>
                  <p className="text-sm text-green-600">
                    We've sent a password reset link to <strong>{email}</strong>. You can close this page.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: NAVY }}
                  >
                    {loading ? 'Sending...' : (
                      <>
                        Send Reset Link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link to="/login" className="font-semibold hover:underline inline-flex items-center gap-1" style={{ color: NAVY }}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
