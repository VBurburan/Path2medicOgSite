import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Brain, TrendingUp, ArrowRight, Zap, Shield } from 'lucide-react';

// Import book covers
import proofCover from '@/assets/proof-cover.png';
import spotItCover from '@/assets/spotit-cover.png';
import catCover from '@/assets/cat-cover.png';
import workbookCover from '@/assets/workbook-cover.png';
import vincentHeadshot from '@/assets/vincent-headshot.png';
import underTheHoodCover from '@/assets/underhood-cover.png';

export default function HomePage() {
  const problems = [
    {
      title: 'The Problem',
      description: 'Generic memorization-focused materials leave students unprepared for Clinical Judgment questions (31-38% of exam)',
      icon: Brain,
      color: '#dc3545',
    },
    {
      title: 'The Reality',
      description: 'July 2024 brought major exam changes. TEI questions require systematic reasoning, not rote memory.',
      icon: TrendingUp,
      color: '#d4a843',
    },
    {
      title: 'The Solution',
      description: "Path2Medic's evidence-based framework teaches you HOW to think through complex scenarios.",
      icon: CheckCircle,
      color: '#28a745',
    },
  ];

  const products = [
    {
      title: 'Under the Hood',
      subtitle: 'Writing Better NREMT-Aligned EMS Questions',
      description: 'A practical guide to Clinical Judgment item writing, TEIs, and diagnostic error analysis for EMS educators.',
      price: 22.99,
      level: 'All' as const,
      category: ['educators', 'all'],
      coverImage: underTheHoodCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3674017?price_id=4619456',
    },
    {
      title: 'The Proof is in the Pudding',
      subtitle: 'Break Down the Question, Find the Answer',
      description: 'NREMT Prep in 53 pages, straightforward and effective. Systematic test-taking strategies to break down questions and find the right answers.',
      price: 13.99,
      level: 'EMT' as const,
      coverImage: proofCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528',
    },
    {
      title: 'Spot It, Sort It, Solve It',
      subtitle: 'NREMT Clinical Judgment Study Guide',
      description: 'Master NREMT Clinical Judgment with this 39-page research-backed guide. Proven frameworks to recognize patterns and prioritize interventions.',
      price: 15.99,
      level: 'Paramedic' as const,
      coverImage: spotItCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694',
    },
    {
      title: 'Clinical Judgment & TEI Workbook',
      subtitle: 'Paramedic Edition',
      description: 'Stop guessing and start thinking like an expert! 70-page workbook with high-quality practice scenarios for paramedic-level NREMT.',
      price: 15.99,
      level: 'Paramedic' as const,
      coverImage: workbookCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954',
    },
    {
      title: "CAT Got Your Tongue?",
      subtitle: 'Guide to Computer Adaptive Testing (CAT)',
      description: 'Proven strategies to conquer CAT confusion and approach your exam with confidence. Learn how the algorithm works.',
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-[#0D2137] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Pass Your NREMT the First Time
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            1-on-1 Private NREMT Coaching + Evidence-Based Study Materials
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tutoring">
              <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] text-lg px-8 py-6 font-semibold">
                Book 1-on-1 Coaching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" className="bg-white text-[#0D2137] hover:bg-gray-100 text-lg px-8 py-6 font-semibold">
                Browse Study Materials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">
              Traditional Test Prep Doesn't Work Anymore
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              The NREMT changed. Your study strategy should too.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <Card key={index} className="border border-gray-200/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <Icon className="h-5 w-5 mb-3" style={{ color: problem.color }} />
                    <CardTitle className="text-lg text-[#0D2137]">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed text-sm">{problem.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0D2137] mb-4">
              Built for the New NREMT
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Evidence-based guides designed for the July 2024 exam changes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-[calc(66.666%+0.75rem)] mx-auto">
            {products.slice(3).map((product, index) => (
              <ProductCard key={index + 3} {...product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137] hover:text-white transition-colors px-8">
                View All Products & Bundles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Practice Platform Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0D2137] mb-6">
                Practice Like It's Test Day
              </h2>
              <p className="text-gray-500 mb-8 text-lg">
                Our question bank mirrors the real NREMT experience — all 6 TEI formats, timed sessions, and domain-level performance tracking.
              </p>
              <div className="space-y-5">
                {practiceFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#E03038]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#E03038]" />
                      </div>
                      <p className="text-gray-700 pt-2">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-10 flex gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830]">
                    Start Practicing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <div className="bg-[#0D2137] rounded-2xl p-6 md:p-8">
                <div className="rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-3 h-3 rounded-full bg-[#E03038]" />
                    <div className="w-3 h-3 rounded-full bg-[#d4a843]" />
                    <div className="w-3 h-3 rounded-full bg-[#28a745]" />
                    <span className="text-white/40 text-xs ml-2 font-mono">Practice Session</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-xs font-mono mb-2">QUESTION 14 / 25</p>
                      <p className="text-white text-sm leading-relaxed">A 45-year-old male presents with crushing substernal chest pain radiating to the left arm. He is diaphoretic and anxious. Vitals: BP 88/60, HR 110, RR 24...</p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/5">
                        <p className="text-white/80 text-sm">A. Administer aspirin and establish IV access</p>
                      </div>
                      <div className="bg-[#E03038]/20 rounded-lg p-3 border border-[#E03038]/50">
                        <p className="text-white text-sm font-medium">B. Obtain a 12-lead ECG and administer nitroglycerin</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 border border-white/5">
                        <p className="text-white/80 text-sm">C. Administer oxygen via nasal cannula</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 border border-white/5">
                        <p className="text-white/80 text-sm">D. Prepare for immediate transport</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutoring CTA */}
      <section className="py-20 bg-[#0D2137]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-lg mb-8 text-white/60 max-w-2xl mx-auto">
            1-on-1 coaching sessions via Zoom. Targeted strategy for your weak domains. Most students pass after 1-2 sessions.
          </p>
          <Link to="/tutoring">
            <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] text-lg px-8 py-6">
              Book a Coaching Session — $189
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About/Credibility */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={vincentHeadshot}
                alt="Vincent Burburan, NRP"
                className="w-full rounded-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0D2137] mb-2">
                Vincent Burburan, NRP
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Critical Care Paramedic &middot; NAEMSE Level 1 Instructor &middot; UF CCP Graduate
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                "After years of tutoring EMS students, I discovered a pattern: candidates weren't failing
                because they lacked knowledge. They failed because they couldn't systematically reason through
                complex scenarios."
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                "That's why I created Path2Medic — to teach the thinking process that expert clinicians use daily."
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137] hover:text-white transition-colors">
                  Read My Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
