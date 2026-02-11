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
      <section className="bg-gradient-to-br from-[#0D2137] to-[#1a5f7a] py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-white/90">
            Have questions? We're here to help
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Mail className="h-10 w-10 text-[#E03038] mb-2" />
                  <CardTitle>Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:vincent@path2medic.com" className="text-[#1a5f7a] hover:text-[#1a5f7a]">
                    vincent@path2medic.com
                  </a>
                  <p className="text-sm text-gray-600 mt-2">We'll respond within 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-[#E03038] mb-2" />
                  <CardTitle>Based In</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">United States</p>
                  <p className="text-sm text-gray-600 mt-2">Serving EMS students nationwide</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your question or concern..."
                        rows={6}
                        disabled={status === 'submitting'}
                      />
                    </div>

                    {status === 'success' && (
                      <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                        Message sent successfully! We'll get back to you soon.
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                        {errorMessage || 'Failed to send message. Please try again.'}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-[#E03038] hover:bg-[#c52830]"
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0D2137] mb-4">
            Quick Answers
          </h2>
          <p className="text-gray-600 mb-8">
            Looking for answers? Check out these common topics
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="text-left cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">How do I access my purchased materials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Log in to your account and visit the Customer Portal to download all your purchases.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">What's included in the practice platform?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  All TEI question types, clinical judgment scenarios, domain-based analytics, and custom study plans.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Can I get a refund?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  We offer a 7-day money-back guarantee on all digital products and memberships.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">How do I schedule coaching?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
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