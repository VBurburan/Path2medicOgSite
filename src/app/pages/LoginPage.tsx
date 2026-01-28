import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import logo from 'figma:asset/7e2353c04204bd5b39085f4855f3eadf3139a233.png';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        console.error('Login error:', error);
        setLoginError(error.message);
      } else if (data?.session) {
        setLoginSuccess('Login successful! Redirecting...');
        console.log('Login successful:', data);
        
        // Check user role and redirect accordingly
        const userRole = data.user?.user_metadata?.role;
        const redirectPath = userRole === 'admin' ? '/admin' : '/dashboard';
        
        setTimeout(() => navigate(redirectPath), 1500);
      }
    } catch (error) {
      console.error('Server error during login:', error);
      setLoginError('An unexpected error occurred during login');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerPassword !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    setRegisterLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ae44dd2/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
            name: registerName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Registration error:', result);
        setRegisterError(result.error || 'Registration failed');
      } else {
        setRegisterSuccess('Account created successfully! You can now login.');
        console.log('Registration successful:', result);
        // Clear form
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Server error during registration:', error);
      setRegisterError('An unexpected error occurred during registration');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 bg-[#F8F9FA] min-h-screen flex items-center">
        <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Path2Medic" className="h-16 w-auto" />
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>Login to access your account and study materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-[#5DADE2] hover:text-[#3498DB]">
                      Forgot password?
                    </a>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#E67E22] hover:bg-[#D35400]" onClick={handleLogin} disabled={loginLoading}>
                    {loginLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </CardFooter>
                {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
                {loginSuccess && <p className="text-green-500 text-sm mt-2">{loginSuccess}</p>}
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>Start your NREMT prep journey today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" placeholder="your.email@example.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#E67E22] hover:bg-[#D35400]" onClick={handleRegister} disabled={registerLoading}>
                    {registerLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
                {registerError && <p className="text-red-500 text-sm mt-2">{registerError}</p>}
                {registerSuccess && <p className="text-green-500 text-sm mt-2">{registerSuccess}</p>}
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-gray-600 mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#5DADE2] hover:text-[#3498DB]">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#5DADE2] hover:text-[#3498DB]">Privacy Policy</a>
          </p>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Admin user?{' '}
            <a href="/admin-setup" className="text-[#5DADE2] hover:text-[#3498DB]">Setup admin access</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}