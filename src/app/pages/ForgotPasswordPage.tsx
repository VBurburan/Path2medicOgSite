import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import Layout from '../components/Layout';
import logoLight from '@/assets/logo-light.jpg';
import { Mail } from 'lucide-react';

const NAVY = '#0D2137';
const TEAL = '#1a5f7a';
const BG = '#f8f9fa';

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
    <Layout>
      <section className="py-16 min-h-screen flex items-center" style={{ backgroundColor: BG }}>
        <div className="max-w-md mx-auto w-full px-4">
          <div className="flex justify-center mb-8">
            <img src={logoLight} alt="Path2Medic" className="h-20 w-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>Reset Password</h2>
                <p className="text-sm text-gray-500">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {success ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                  Check your email for a password reset link. You can close this page.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: NAVY }}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="font-medium hover:underline" style={{ color: TEAL }}>
              Back to login
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
