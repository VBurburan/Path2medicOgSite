import React from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Video, Clipboard, Lightbulb, Calendar, CheckCircle, Users, Target, TrendingUp, Award, Mail, ArrowRight } from 'lucide-react';

export default function TutoringPage() {
  const phases = [
    {
      number: 1,
      title: 'Intake & Analysis',
      items: [
        'Complete pre-session questionnaire',
        'Identify certification level (EMT, AEMT, or Paramedic)',
        'Analyze weak domains from NREMT diagnostic report',
        'Review specific struggles: test anxiety, question interpretation, content gaps',
        'Determine primary challenge: test-taking strategy vs. content knowledge'
      ]
    },
    {
      number: 2,
      title: 'Live 1-on-1 Zoom Session',
      subtitle: '90 minutes to 2+ hours (flexible based on your needs)',
      items: [
        'Deep-dive into YOUR specific weak domains from NREMT report',
        'Break down questions in problem areas together',
        'Clarify misconceptions and fill knowledge gaps',
        'Apply strategic frameworks to real scenarios',
        'Build confidence through guided practice',
        'Learn test-taking strategies and question analysis techniques',
        'CAT-specific anxiety management',
        'Custom action plan and study recommendations'
      ]
    },
    {
      number: 3,
      title: 'Custom Post-Test Assignment',
      items: [
        'Personalized practice exam weighted toward YOUR weak domains',
        'Level-appropriate (EMT, AEMT, or Paramedic)',
        'Mimics NREMT format and difficulty',
        'Optional post-test performance review',
        'Second session if needed',
        'Ongoing messaging/email support'
      ]
    }
  ];

  const differentiators = [
    {
      icon: Target,
      title: 'Domain-Focused',
      description: 'Most of the session dedicated to YOUR specific weak areas'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven',
      description: 'Custom content based on actual NREMT domain weaknesses'
    },
    {
      icon: Award,
      title: 'Level-Appropriate',
      description: 'Tailored to EMT, AEMT, or Paramedic requirements'
    },
    {
      icon: Video,
      title: 'Live Coaching',
      description: 'Real-time feedback via Zoom—flexible session length'
    },
    {
      icon: Lightbulb,
      title: 'Strategic Focus',
      description: 'Most students fail due to test format, not knowledge'
    },
    {
      icon: CheckCircle,
      title: 'Proven Results',
      description: 'Students typically pass after 1-2 sessions'
    }
  ];

  const faqs = [
    {
      question: 'Who is this coaching service for?',
      answer: 'This service is specifically designed for EMS students at all certification levels (EMT, AEMT, Paramedic)—particularly those who have failed the NREMT and need targeted strategic guidance. Most students pass after just 1-2 sessions.'
    },
    {
      question: 'How long are the coaching sessions?',
      answer: 'Sessions are flexible based on your individual gaps and needs, typically ranging from 90 minutes to 2+ hours. We take the time necessary to thoroughly address your weak domains and build your confidence.'
    },
    {
      question: 'What if I don\'t have my NREMT diagnostic report?',
      answer: 'While the NREMT diagnostic report helps us identify your specific weak domains, we can still work with practice test results or areas where you feel less confident. The intake questionnaire will help us determine where to focus our session.'
    },
    {
      question: 'Do you offer group rates for EMS programs?',
      answer: 'Yes! I offer discounted rates for EMS programs, fire departments, and study groups. Contact me directly at vincent@path2medic.com to discuss group coaching options and institutional pricing.'
    },
    {
      question: 'What happens after the coaching session?',
      answer: 'You\'ll receive a personalized practice exam weighted toward your weak domains, matching your certification level and NREMT format. Optional follow-up includes post-test performance review, a second session if needed, and ongoing messaging/email support.'
    },
    {
      question: 'Can you help with specific content areas?',
      answer: 'Absolutely. Whether you\'re struggling with cardiology, trauma, pediatrics, or any other domain, we focus our session on your specific weak areas identified from your NREMT report or practice tests. My approach combines content review with the systematic reasoning skills you need to apply that knowledge on exam day.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0D2137] via-[#0D2137] to-[#142d45] py-24 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-8">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Path2Medic NREMT Coaching Service
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
            Specialized one-on-one NREMT coaching for students who have failed and need targeted strategic guidance
          </p>
          <p className="text-lg text-white/70 mb-10">
            Most students pass after just 1-2 sessions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-[#0D2137] hover:bg-gray-100 font-semibold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open('https://path2medic.thinkific.com/enroll/3570436?price_id=4503585', '_blank')}
            >
              Book Your Session - $189
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 3-Phase Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[#0D2137]/10 text-[#0D2137] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#0D2137]/10">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137]">
              The 3-Phase Process
            </h2>
          </div>
          <div className="space-y-6">
            {phases.map((phase) => (
              <Card key={phase.number} className="border-0 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-5">
                    <div className="bg-[#E03038] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-xl font-bold">{phase.number}</span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2 text-[#0D2137]">Phase {phase.number}: {phase.title}</CardTitle>
                      {phase.subtitle && (
                        <CardDescription className="text-base text-[#E03038] font-semibold">
                          {phase.subtitle}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 ml-16">
                    {phase.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[#E03038]/10 text-[#E03038] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#E03038]/10">Our Approach</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137]">
              Why It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-0 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="bg-[#E03038] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-[#0D2137]">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-[#0D2137]/10 text-[#0D2137] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#0D2137]/10">Meet Your Coach</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137]">
              Your Instructor
            </h2>
          </div>
          <Card className="border-2 border-[#0D2137] rounded-xl shadow-xl overflow-hidden">
            <CardHeader className="text-center bg-[#0D2137]/[0.03] border-b border-[#0D2137]/10 pb-6">
              <CardTitle className="text-2xl mb-2 text-[#0D2137]">Vincent Burburan, NRP</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <ul className="space-y-4 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Critical Care Paramedic (CCP)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Level 1 NAEMSE Instructor</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">University of Florida Critical Care Paramedic Program Graduate</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10+ years EMS field experience (EMT → Critical Care Paramedic)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Proven track record helping students pass after previous failures</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[#E03038]/10 text-[#E03038] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#E03038]/10">Investment</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137]">
              Pricing
            </h2>
          </div>
          <Card className="border-2 border-[#0D2137] rounded-xl shadow-xl overflow-hidden">
            <CardHeader className="text-center bg-[#0D2137]/[0.03] border-b border-[#0D2137]/10 pt-10 pb-8">
              <CardTitle className="text-3xl mb-3 text-[#0D2137]">Single Comprehensive Coaching Session</CardTitle>
              <CardDescription className="text-lg">90 min to 2+ hours (flexible based on your needs) • 1-on-1 via Zoom</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-10 pb-10">
              <div className="text-6xl font-bold text-[#0D2137] mb-2">
                $189
              </div>
              <p className="text-gray-500 mb-8 text-sm">One-time payment</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  className="bg-[#E03038] hover:bg-[#c52830] font-semibold text-base px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.open('https://path2medic.thinkific.com/enroll/3570436?price_id=4503585', '_blank')}
                >
                  Book Your Session
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-gray-600 mb-2">
                TikTok: <span className="font-semibold text-[#0D2137]">@path2medic.education</span>
              </p>
              <p className="text-sm text-gray-500 mt-4">Limited availability - book early</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[#0D2137]/10 text-[#0D2137] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#0D2137]/10">Common Questions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137]">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-0 bg-white rounded-xl shadow-md px-6 overflow-hidden">
                <AccordionTrigger className="text-left font-semibold text-[#0D2137] hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#E03038] to-[#c52830] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-8">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Pass Your NREMT?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Most students pass after just 1-2 coaching sessions. Book yours today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-[#E03038] hover:bg-gray-100 font-semibold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open('https://path2medic.thinkific.com/enroll/3570436?price_id=4503585', '_blank')}
          >
            Book Your Session - $189
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
