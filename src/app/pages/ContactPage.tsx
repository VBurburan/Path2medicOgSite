import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

import { projectId, publicAnonKey } from '/utils/supabase/info';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div ref={ref} className={className} style={{
      opacity: isInView ? 1 : 0,
      transform: isInView ? 'none' : 'translateY(32px)',
      transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

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
      <section className="bg-[#0D2137] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-white/50 mb-4">Contact Us</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">Get in Touch</h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Have questions? We're here to help
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <AnimatedSection>
                <Card className="rounded-2xl shadow-md border-0 overflow-hidden group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                  <CardHeader className="pb-2">
                    <Mail className="h-5 w-5 text-gray-400 mb-3" />
                    <CardTitle className="text-[#0D2137]">Email Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href="mailto:vincent@path2medic.com" className="text-[#0D2137] font-medium hover:text-[#E03038] transition-colors duration-300">
                      vincent@path2medic.com
                    </a>
                    <p className="text-sm text-gray-400 mt-2">We'll respond within 24 hours</p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Card className="rounded-2xl shadow-md border-0 overflow-hidden group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                  <CardHeader className="pb-2">
                    <MapPin className="h-5 w-5 text-gray-400 mb-3" />
                    <CardTitle className="text-[#0D2137]">Based In</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-medium">United States</p>
                    <p className="text-sm text-gray-400 mt-2">Serving EMS students nationwide</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <AnimatedSection delay={0.15}>
                <Card className="rounded-2xl shadow-md border-0 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b border-gray-100 bg-white">
                    <CardTitle className="text-2xl text-[#0D2137]">Send Us a Message</CardTitle>
                    <CardDescription className="text-gray-400">Fill out the form below and we'll get back to you soon</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[#0D2137] font-medium text-sm">Name *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-[#0D2137]/10 focus:border-[#0D2137]/30 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[#0D2137] font-medium text-sm">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-[#0D2137]/10 focus:border-[#0D2137]/30 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-[#0D2137] font-medium text-sm">Subject *</Label>
                        <Input
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="How can we help?"
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-[#0D2137]/10 focus:border-[#0D2137]/30 transition-all duration-300 hover:border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-[#0D2137] font-medium text-sm">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us more about your question or concern..."
                          rows={6}
                          disabled={status === 'submitting'}
                          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-[#0D2137]/10 focus:border-[#0D2137]/30 transition-all duration-300 resize-none hover:border-gray-300"
                        />
                      </div>

                      {status === 'success' && (
                        <div className="p-5 bg-green-50 text-green-700 rounded-xl border border-green-200/60 flex items-start gap-3">
                          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          <div>
                            <p className="font-semibold text-sm">Message sent successfully!</p>
                            <p className="text-sm text-green-600 mt-0.5">We'll get back to you within 24 hours.</p>
                          </div>
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="p-5 bg-red-50 text-red-700 rounded-xl border border-red-200/60 flex items-start gap-3">
                          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                          <div>
                            <p className="font-semibold text-sm">Failed to send message</p>
                            <p className="text-sm text-red-600 mt-0.5">{errorMessage || 'Please try again.'}</p>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-[#0D2137] hover:bg-[#162d47] rounded-xl h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                        disabled={status === 'submitting'}
                      >
                        {status === 'submitting' ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-[#0D2137] mb-3 tracking-tight">
              Quick Answers
            </h2>
            <p className="text-gray-400">
              Looking for answers? Check out these common topics
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { q: 'How do I access my purchased materials?', a: 'Log in to your account and visit the Customer Portal to download all your purchases.' },
              { q: "What's included in the practice platform?", a: 'All TEI question types, clinical judgment scenarios, domain-based analytics, and custom study plans.' },
              { q: 'Can I get a refund?', a: 'We offer a 7-day money-back guarantee on all digital products and memberships.' },
              { q: 'How do I schedule coaching?', a: 'Visit the Tutoring page and click "Book Now" to see available time slots via Zoom Scheduler.' }
            ].map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.08}>
                <Card className="text-left rounded-2xl shadow-md border-0 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-lg text-[#0D2137] group-hover:text-[#E03038] transition-colors duration-300">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
