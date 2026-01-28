import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function AdminSetupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ae44dd2/make-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            secretCode,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Admin setup error:', result);
        setError(result.error || 'Failed to make user admin');
      } else {
        setSuccess('Successfully promoted to admin! Please log out and log back in.');
        console.log('Admin setup successful:', result);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.error('Server error during admin setup:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 bg-[#F8F9FA] min-h-screen flex items-center">
        <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Admin Setup</CardTitle>
              <CardDescription>
                One-time setup to grant admin privileges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You must create an account first on the Login page before setting up admin access.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Use the same email you registered with
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret-code">Secret Code</Label>
                <Input
                  id="secret-code"
                  type="password"
                  placeholder="Enter secret code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Secret code: path2medic-admin-2024
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch">
              <Button
                className="w-full bg-[#E67E22] hover:bg-[#D35400]"
                onClick={handleMakeAdmin}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Make Admin'}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            </CardFooter>
          </Card>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-[#5DADE2] hover:text-[#3498DB]"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}