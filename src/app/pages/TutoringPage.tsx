import React from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Video, Lightbulb, Calendar, CheckCircle, Users, Target, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

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
      description: 'Most of the session dedicated to YOUR specific weak areas',
      color: '#E03038'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven',
      description: 'Custom content based on actual NREMT domain weaknesses',
      color: '#0D2137'
    },
    {
      icon: Award,
      title: 'Level-Appropriate',
      description: 'Tailored to EMT, AEMT, or Paramedic requirements',
      color: '#d4a843'
    },
    {
      icon: Video,
      title: 'Live Coaching',
      description: 'Real-time feedback via Zoom—flexible session length',
      color: '#E03038'
    },
    {
      icon: Lightbulb,
      title: 'Strategic Focus',
      description: 'Most students fail due to test format, not knowledge',
      color: '#0D2137'
    },
    {
      icon: CheckCircle,
      title: 'Proven Results',
      description: 'Students typically pass after 1-2 sessions',
      color: '#d4a843'
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
      <section className="relative bg-[#0D2137] py-28 text-white overflow-hidden">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-8 ring-1 ring-white/20">
              <Users className="h-10 w-10 text-white" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
              Path2Medic NREMT{' '}
              <span className="text-[#E03038]">Coaching</span> Service
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
              Specialized one-on-one NREMT coaching for students who have failed and need targeted strategic guidance
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="text-lg text-white/60 mb-10 font-medium">
              Most students pass after just 1-2 sessions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#0D2137] hover:bg-gray-100 font-semibold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                onClick={() => window.open('https://path2medic.thinkific.com/enroll/3570436?price_id=4503585', '_blank')}
              >
                Book Your Session - $189
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3-Phase Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-[#0D2137]/10 text-[#0D2137] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#0D2137]/10">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              The 3-Phase Process
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              A structured, proven approach to getting you past the NREMT
            </p>
          </AnimatedSection>
          <div className="space-y-8">
            {phases.map((phase, phaseIndex) => (
              <AnimatedSection key={phase.number} delay={phaseIndex * 0.15}>
                <Card className="border-0 rounded-2xl shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E03038] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <div className="bg-[#E03038] w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <span className="text-white text-xl font-bold">{phase.number}</span>
                        </div>
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
                    <ul className="space-y-3 ml-[4.75rem]">
                      {phase.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-[#0D2137]/70 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-[#E03038]/10 text-[#E03038] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#E03038]/10">Our Approach</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Why It Works
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              Six core principles that drive real results for every student
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="border-0 rounded-2xl shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                    <CardHeader>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon className="h-7 w-7" style={{ color: item.color }} />
                      </div>
                      <CardTitle className="text-xl text-[#0D2137]">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <Badge className="mb-4 bg-[#0D2137]/10 text-[#0D2137] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#0D2137]/10">Meet Your Coach</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Your Instructor
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <Card className="border border-[#0D2137]/15 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center bg-gradient-to-b from-[#0D2137]/[0.04] to-transparent border-b border-[#0D2137]/10 pb-6">
                <CardTitle className="text-2xl mb-2 text-[#0D2137]">Vincent Burburan, NRP</CardTitle>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                <ul className="space-y-4 max-w-2xl mx-auto">
                  {[
                    'Critical Care Paramedic (CCP)',
                    'Level 1 NAEMSE Instructor',
                    'University of Florida Critical Care Paramedic Program Graduate',
                    '10+ years EMS field experience (EMT → Critical Care Paramedic)',
                    'Proven track record helping students pass after previous failures'
                  ].map((credential, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <div className="bg-[#0D2137]/10 rounded-lg p-1 mt-0.5 group-hover/item:bg-[#E03038]/10 transition-colors duration-300">
                        <CheckCircle className="h-4 w-4 text-[#0D2137] group-hover/item:text-[#E03038] transition-colors duration-300" />
                      </div>
                      <span className="text-gray-600 leading-relaxed">{credential}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-[#E03038]/10 text-[#E03038] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#E03038]/10">Investment</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Pricing
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <Card className="border border-[#0D2137]/15 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E03038] via-[#d4a843] to-[#E03038]" />
              <CardHeader className="text-center bg-gradient-to-b from-[#0D2137]/[0.04] to-transparent border-b border-[#0D2137]/10 pt-12 pb-8">
                <CardTitle className="text-3xl mb-3 text-[#0D2137]">Single Comprehensive Coaching Session</CardTitle>
                <CardDescription className="text-lg">90 min to 2+ hours (flexible based on your needs) &bull; 1-on-1 via Zoom</CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-10 pb-12">
                <div className="text-7xl font-bold text-[#0D2137] mb-2 tracking-tight">
                  $189
                </div>
                <p className="text-gray-400 mb-10 text-sm font-medium tracking-wide uppercase">One-time payment</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button
                    size="lg"
                    className="bg-[#E03038] hover:bg-[#c52830] font-semibold text-base px-12 py-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                    onClick={() => window.open('https://path2medic.thinkific.com/enroll/3570436?price_id=4503585', '_blank')}
                  >
                    Book Your Session
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <p className="text-gray-600 mb-2">
                  TikTok: <span className="font-semibold text-[#0D2137]">@path2medic.education</span>
                </p>
                <p className="text-sm text-gray-400 mt-4 font-medium">Limited availability &mdash; book early</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-[#0D2137]/10 text-[#0D2137] border-0 px-4 py-1.5 text-sm font-semibold hover:bg-[#0D2137]/10">Common Questions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-0 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 px-6 overflow-hidden">
                  <AccordionTrigger className="text-left font-semibold text-[#0D2137] hover:no-underline py-6 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0D2137] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.08)_0%,_transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-8 ring-1 ring-white/20">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to Pass Your NREMT?
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Most students pass after just 1-2 coaching sessions. Book yours today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-[#0D2137] hover:bg-gray-100 font-semibold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
              onClick={() => window.open('https://path2medic.thinkific.com/enroll/3570436?price_id=4503585', '_blank')}
            >
              Book Your Session - $189
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
