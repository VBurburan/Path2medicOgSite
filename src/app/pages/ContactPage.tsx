import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, MapPin } from 'lucide-react';

import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting contact form...', formData);

    // Manual validation fallback
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      console.log('Sending request to server...');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ae44dd2/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#0D2137] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-4">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">Get in Touch</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Have questions? We're here to help
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="rounded-xl shadow-sm border border-gray-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="bg-[#E03038]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-[#E03038]" />
                  </div>
                  <CardTitle className="text-[#0D2137]">Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:vincent@path2medic.com" className="text-[#0D2137] font-medium hover:text-[#E03038] transition-colors">
                    vincent@path2medic.com
                  </a>
                  <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border border-gray-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="bg-[#0D2137]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-[#0D2137]" />
                  </div>
                  <CardTitle className="text-[#0D2137]">Based In</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-medium">United States</p>
                  <p className="text-sm text-gray-500 mt-2">Serving EMS students nationwide</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
                <CardHeader className="border-b border-gray-100 bg-white">
                  <CardTitle className="text-2xl text-[#0D2137]">Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#0D2137] font-medium">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="rounded-lg border-gray-200 focus:ring-[#0D2137]/20 focus:border-[#0D2137]/40 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#0D2137] font-medium">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="rounded-lg border-gray-200 focus:ring-[#0D2137]/20 focus:border-[#0D2137]/40 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[#0D2137] font-medium">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="rounded-lg border-gray-200 focus:ring-[#0D2137]/20 focus:border-[#0D2137]/40 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[#0D2137] font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your question or concern..."
                        rows={6}
                        disabled={status === 'submitting'}
                        className="rounded-lg border-gray-200 focus:ring-[#0D2137]/20 focus:border-[#0D2137]/40 transition-colors resize-none"
                      />
                    </div>

                    {status === 'success' && (
                      <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>Message sent successfully! We'll get back to you soon.</span>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-[#0D2137] hover:bg-[#162d47] rounded-lg h-12 text-base font-medium transition-colors"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-[#0D2137] mb-3 tracking-tight">
              Quick Answers
            </h2>
            <p className="text-gray-500">
              Looking for answers? Check out these common topics
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="text-left rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md hover:border-gray-300/60 transition-all duration-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg text-[#0D2137]">How do I access my purchased materials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Log in to your account and visit the Customer Portal to download all your purchases.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md hover:border-gray-300/60 transition-all duration-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg text-[#0D2137]">What's included in the practice platform?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 leading-relaxed">
                  All TEI question types, clinical judgment scenarios, domain-based analytics, and custom study plans.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md hover:border-gray-300/60 transition-all duration-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg text-[#0D2137]">Can I get a refund?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We offer a 7-day money-back guarantee on all digital products and memberships.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md hover:border-gray-300/60 transition-all duration-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg text-[#0D2137]">How do I schedule coaching?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Visit the Tutoring page and click "Book Now" to see available time slots via Zoom Scheduler.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
