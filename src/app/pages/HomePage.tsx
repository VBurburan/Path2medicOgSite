import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Brain, TrendingUp, ArrowRight, Zap, Shield, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

import proofCover from '@/assets/proof-cover.png';
import spotItCover from '@/assets/spotit-cover.png';
import catCover from '@/assets/cat-cover.png';
import workbookCover from '@/assets/workbook-cover.png';
import vincentHeadshot from '@/assets/vincent-headshot.png';
import underTheHoodCover from '@/assets/underhood-cover.png';

const HERO_BG = 'https://images.unsplash.com/photo-1649768862026-f21a814945f7?auto=format&fit=crop&w=1920&q=80';

function AnimatedSection({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView
          ? 'none'
          : animation === 'fadeInUp'
          ? 'translateY(32px)'
          : animation === 'slideInLeft'
          ? 'translateX(-40px)'
          : animation === 'slideInRight'
          ? 'translateX(40px)'
          : animation === 'scaleIn'
          ? 'scale(0.92)'
          : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function StatCounter({ end, suffix = '', label }: { end: number; suffix?: string; label: string }) {
  const { ref, isInView } = useInView();
  const count = useAnimatedCounter(end, isInView, 2200);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-1">
        {count}
        {suffix}
      </div>
      <div className="text-white/50 text-sm font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const problems = [
    {
      title: 'The Problem',
      description:
        'Generic memorization-focused materials leave students unprepared for Clinical Judgment questions — 31-38% of the exam.',
      icon: Brain,
      color: '#dc3545',
    },
    {
      title: 'The Reality',
      description:
        'July 2024 brought major exam changes. TEI questions require systematic reasoning, not rote memory.',
      icon: TrendingUp,
      color: '#d4a843',
    },
    {
      title: 'The Solution',
      description:
        "Path2Medic's evidence-based framework teaches you HOW to think through complex scenarios — not just what to memorize.",
      icon: CheckCircle,
      color: '#28a745',
    },
  ];

  const products = [
    {
      title: 'Under the Hood',
      subtitle: 'Writing Better NREMT-Aligned EMS Questions',
      description:
        'A practical guide to Clinical Judgment item writing, TEIs, and diagnostic error analysis for EMS educators.',
      price: 22.99,
      level: 'All' as const,
      category: ['educators', 'all'],
      coverImage: underTheHoodCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3674017?price_id=4619456',
    },
    {
      title: 'The Proof is in the Pudding',
      subtitle: 'Break Down the Question, Find the Answer',
      description:
        'NREMT Prep in 53 pages, straightforward and effective. Systematic test-taking strategies to break down questions and find the right answers.',
      price: 13.99,
      level: 'EMT' as const,
      coverImage: proofCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528',
    },
    {
      title: 'Spot It, Sort It, Solve It',
      subtitle: 'NREMT Clinical Judgment Study Guide',
      description:
        'Master NREMT Clinical Judgment with this 39-page research-backed guide. Proven frameworks to recognize patterns and prioritize interventions.',
      price: 15.99,
      level: 'Paramedic' as const,
      coverImage: spotItCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694',
    },
    {
      title: 'Clinical Judgment & TEI Workbook',
      subtitle: 'Paramedic Edition',
      description:
        'Stop guessing and start thinking like an expert! 70-page workbook with high-quality practice scenarios for paramedic-level NREMT.',
      price: 15.99,
      level: 'Paramedic' as const,
      coverImage: workbookCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954',
    },
    {
      title: "CAT Got Your Tongue?",
      subtitle: 'Guide to Computer Adaptive Testing (CAT)',
      description:
        'Proven strategies to conquer CAT confusion and approach your exam with confidence. Learn how the algorithm works.',
      price: 15.99,
      level: 'All' as const,
      coverImage: catCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3636485?price_id=4577181',
    },
  ];

  const practiceFeatures = [
    { icon: Zap, text: 'All 6 TEI Question Types (Drag & Drop, Build List, Options Box, etc.)' },
    { icon: Brain, text: 'Clinical Judgment Scenarios with 3-Phase Structure' },
    { icon: TrendingUp, text: 'Custom Weakness Analysis & Domain Tracking' },
    { icon: Shield, text: 'EMT, AEMT & Paramedic Question Banks' },
  ];

  const process = [
    {
      step: '01',
      title: 'Take the Diagnostic Pretest',
      description: 'A timed exam that mirrors real NREMT conditions — all TEI formats included.',
    },
    {
      step: '02',
      title: 'Get Your Domain Analysis',
      description: 'See exactly where you stand in each NREMT domain with a full breakdown.',
    },
    {
      step: '03',
      title: '1-on-1 Coaching via Zoom',
      description: 'Targeted strategies for YOUR weak areas from a Critical Care Paramedic.',
    },
    {
      step: '04',
      title: 'Post-Test & Comparative Results',
      description: 'Measure your improvement. Most students see a 15-25% score increase.',
    },
  ];

  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Background image with Ken Burns */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            animation: 'heroZoom 25s ease-out forwards',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2137]/95 via-[#0D2137]/85 to-[#0D2137]/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 text-[#E03038] text-sm font-semibold mb-6 tracking-wide uppercase"
              style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
            >
              <div className="w-8 h-px bg-[#E03038]" />
              NREMT Exam Prep
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
              style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both' }}
            >
              Pass Your NREMT
              <br />
              <span className="text-white/60">the First Time</span>
            </h1>

            <p
              className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed"
              style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both' }}
            >
              1-on-1 coaching from a Critical Care Paramedic, plus evidence-based study materials built for the new exam format.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both' }}
            >
              <Link to="/tutoring">
                <Button
                  size="lg"
                  className="bg-[#E03038] hover:bg-[#c52830] text-base px-8 py-6 font-semibold group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-500/25"
                >
                  Book 1-on-1 Coaching
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 text-base px-8 py-6 font-semibold transition-all duration-300"
                >
                  Browse Study Materials
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[#0D2137] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCounter end={500} suffix="+" label="Students Coached" />
            <StatCounter end={92} suffix="%" label="Pass Rate" />
            <StatCounter end={3} suffix="" label="Cert Levels" />
            <StatCounter end={6} suffix="" label="TEI Formats" />
          </div>
        </div>
      </section>

      {/* ===== PROBLEM / SOLUTION ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">
              Traditional Test Prep Doesn't Work Anymore
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              The NREMT changed. Your study strategy should too.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.12}>
                  <Card className="border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] group h-full">
                    <CardHeader className="pb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${problem.color}12` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: problem.color }} />
                      </div>
                      <CardTitle className="text-lg text-[#0D2137]">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed text-sm">{problem.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (Coaching Process) ===== */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">
              How Coaching Works
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              A proven 4-step process that identifies your weak areas and fixes them.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="relative group">
                  {/* Connector line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gray-300/60" />
                  )}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] relative">
                    <div className="text-[#E03038] font-mono text-sm font-bold mb-3 tracking-wider">
                      {item.step}
                    </div>
                    <h3 className="text-[#0D2137] font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.4}>
            <Link to="/tutoring">
              <Button
                size="lg"
                className="bg-[#0D2137] hover:bg-[#162d47] text-base px-8 py-6 font-semibold group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Learn More About Coaching
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PRACTICE PLATFORM ===== */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="slideInLeft">
              <div className="inline-flex items-center gap-2 text-[#E03038] text-sm font-semibold mb-4 tracking-wide uppercase">
                <div className="w-8 h-px bg-[#E03038]" />
                Practice Platform
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-6">
                Practice Like It's Test Day
              </h2>
              <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                Our question bank mirrors the real NREMT experience — all 6 TEI formats, timed sessions, and domain-level performance tracking.
              </p>
              <div className="space-y-5">
                {practiceFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-[#E03038]/8 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#E03038]/15 group-hover:scale-105">
                        <Icon className="h-5 w-5 text-[#E03038]" />
                      </div>
                      <p className="text-gray-700 pt-2 text-[15px]">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-10 flex gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-[#E03038] hover:bg-[#c52830] group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-500/20"
                  >
                    Start Practicing
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    View Plans
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideInRight" delay={0.15}>
              <div className="bg-[#0D2137] rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#0D2137]/30">
                <div className="rounded-xl p-5 border border-white/10 bg-white/[0.03]">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-3 h-3 rounded-full bg-[#E03038]" />
                    <div className="w-3 h-3 rounded-full bg-[#d4a843]" />
                    <div className="w-3 h-3 rounded-full bg-[#28a745]" />
                    <span className="text-white/30 text-xs ml-2 font-mono">Practice Session</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-white/20 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5">14:32</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 bg-white/10 rounded-full mb-5">
                    <div className="h-1 bg-[#E03038] rounded-full" style={{ width: '56%' }} />
                  </div>

                  {/* Question */}
                  <div className="space-y-4">
                    <div className="bg-white/[0.06] rounded-lg p-4">
                      <p className="text-white/40 text-xs font-mono mb-2">QUESTION 14 / 25</p>
                      <p className="text-white text-sm leading-relaxed">
                        A 45-year-old male presents with crushing substernal chest pain radiating to the left arm. He is diaphoretic and anxious. Vitals: BP 88/60, HR 110, RR 24...
                      </p>
                    </div>

                    {/* Answer choices */}
                    <div className="space-y-2">
                      <div className="bg-white/[0.06] rounded-lg p-3.5 border border-white/5 transition-colors cursor-default hover:border-white/10">
                        <p className="text-white/70 text-sm">A. Administer aspirin and establish IV access</p>
                      </div>
                      <div className="bg-[#E03038]/15 rounded-lg p-3.5 border border-[#E03038]/40">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium">B. Obtain a 12-lead ECG and administer nitroglycerin</p>
                          <div className="w-4 h-4 rounded-full border-2 border-[#E03038] flex items-center justify-center flex-shrink-0 ml-3">
                            <div className="w-2 h-2 rounded-full bg-[#E03038]" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/[0.06] rounded-lg p-3.5 border border-white/5">
                        <p className="text-white/70 text-sm">C. Administer oxygen via nasal cannula</p>
                      </div>
                      <div className="bg-white/[0.06] rounded-lg p-3.5 border border-white/5">
                        <p className="text-white/70 text-sm">D. Prepare for immediate transport</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom controls */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                    <span className="text-white/20 text-xs font-mono">Multiple Choice</span>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-md bg-white/5 text-white/40 text-xs font-medium">Previous</div>
                      <div className="px-3 py-1.5 rounded-md bg-[#E03038] text-white text-xs font-medium">Next</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SHOWCASE ===== */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">
              Built for the New NREMT
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Evidence-based guides designed for the July 2024 exam changes
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product, index) => (
              <AnimatedSection key={index} delay={index * 0.08}>
                <ProductCard {...product} />
              </AnimatedSection>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-[calc(66.666%+0.75rem)] mx-auto">
            {products.slice(3).map((product, index) => (
              <AnimatedSection key={index + 3} delay={(index + 3) * 0.08}>
                <ProductCard {...product} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.3}>
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137] hover:text-white transition-all duration-300 px-8 group"
              >
                View All Products & Bundles
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== TUTORING CTA ===== */}
      <section className="py-24 bg-[#0D2137] relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
              Need Personalized Guidance?
            </h2>
            <p className="text-lg mb-10 text-white/50 max-w-2xl mx-auto leading-relaxed">
              1-on-1 coaching sessions via Zoom. Targeted strategy for your weak domains. Most students pass after 1-2 sessions.
            </p>
            <Link to="/tutoring">
              <Button
                size="lg"
                className="bg-[#E03038] hover:bg-[#c52830] text-lg px-10 py-7 font-semibold group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-500/25"
              >
                Book a Coaching Session — $189
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== ABOUT / CREDIBILITY ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="slideInLeft">
              <div className="relative">
                <img
                  src={vincentHeadshot}
                  alt="Vincent Burburan, NRP"
                  className="w-full rounded-2xl shadow-xl"
                />
                {/* Accent border */}
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-[#E03038]/20 -z-10" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideInRight" delay={0.1}>
              <div className="inline-flex items-center gap-2 text-[#E03038] text-sm font-semibold mb-4 tracking-wide uppercase">
                <div className="w-8 h-px bg-[#E03038]" />
                Your Instructor
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-2">
                Vincent Burburan, NRP
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Critical Care Paramedic · NAEMSE Level 1 Instructor · UF CCP Graduate
              </p>

              <blockquote className="border-l-2 border-[#E03038]/30 pl-5 mb-6">
                <p className="text-gray-600 leading-relaxed italic">
                  "After years of tutoring EMS students, I discovered a pattern: candidates weren't failing
                  because they lacked knowledge. They failed because they couldn't systematically reason through
                  complex scenarios."
                </p>
              </blockquote>

              <p className="text-gray-600 mb-8 leading-relaxed">
                "That's why I created Path2Medic — to teach the thinking process that expert clinicians use daily."
              </p>

              <Link to="/about">
                <Button
                  variant="outline"
                  className="border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137] hover:text-white transition-all duration-300 group"
                >
                  Read My Story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-[#0D2137] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
              {/* Subtle accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#E03038] to-transparent" />

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Pass Your NREMT?
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Join hundreds of students who passed with Path2Medic's coaching and study materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/tutoring">
                  <Button
                    size="lg"
                    className="bg-[#E03038] hover:bg-[#c52830] text-base px-8 py-6 font-semibold group transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    Book Coaching
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 text-base px-8 py-6 font-semibold transition-all duration-300"
                  >
                    Browse Materials
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
