import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Brain, TrendingUp, BookOpen, Users, ArrowRight, Zap, Shield } from 'lucide-react';

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
      <section
        className="relative bg-cover bg-center py-28 md:py-36"
        style={{
          backgroundImage: `linear-gradient(rgba(13, 33, 55, 0.9), rgba(13, 33, 55, 0.75)), url(https://images.unsplash.com/photo-1649768862026-f21a814945f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJ1bGFuY2UlMjBtb3Rpb258ZW58MXx8fHwxNzY3NzE0MDYwfDA&ixlib=rb-4.1.0&q=80&w=1080)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <span className="text-white/90 text-sm font-medium">Updated for 2025 NREMT Exam Changes</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Pass Your NREMT<br className="hidden md:block" /> the First Time
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto font-light">
            1-on-1 Private NREMT Coaching + Evidence-Based Study Materials
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tutoring">
              <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] text-lg px-8 py-6 shadow-lg shadow-red-500/20 font-semibold">
                Book 1-on-1 Coaching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" className="bg-white text-[#0D2137] hover:bg-gray-100 text-lg px-8 py-6 font-semibold">
                Purchase Study Materials
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
                <Card key={index} className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: problem.color }} />
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${problem.color}15` }}>
                      <Icon className="h-6 w-6" style={{ color: problem.color }} />
                    </div>
                    <CardTitle className="text-xl text-[#0D2137]">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{problem.description}</p>
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
            <Badge className="bg-[#E03038] text-white px-4 py-1.5 text-xs font-semibold mb-4 border-0">
              STUDY RESOURCES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">
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
              <Badge className="bg-[#0D2137] text-white px-4 py-1.5 text-xs font-semibold mb-6 border-0">
                PRACTICE PLATFORM
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-6">
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
                  <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] shadow-lg shadow-red-500/20">
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
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0D2137] to-[#162d47] rounded-2xl p-8 shadow-2xl">
                <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
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
                      <div className="bg-white/10 rounded-lg p-3 border border-white/5 hover:border-[#E03038]/50 cursor-pointer transition-colors">
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
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#28a745]/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#28a745]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Domain Score</p>
                    <p className="text-lg font-bold text-[#28a745]">+12% improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutoring CTA */}
      <section className="py-20 bg-[#0D2137] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#E03038] blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-xl mb-10 text-white/70 max-w-2xl mx-auto">
            1-on-1 coaching sessions via Zoom. Targeted strategy for YOUR weak domains. Most students pass after 1-2 sessions.
          </p>
          <Link to="/tutoring">
            <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] text-lg px-8 py-6 shadow-lg shadow-red-500/30">
              Book a Coaching Session — $189
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About/Credibility */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src={vincentHeadshot}
                alt="Vincent Burburan, NRP"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-[#d4a843] flex items-center justify-center">
                        <span className="text-white text-[8px]">★</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#0D2137] ml-1">Proven Track Record</span>
                </div>
              </div>
            </div>
            <div>
              <Badge className="bg-[#0D2137] text-white px-4 py-1.5 text-xs font-semibold mb-6 border-0">
                YOUR INSTRUCTOR
              </Badge>
              <h2 className="text-3xl font-bold text-[#0D2137] mb-4">
                Vincent Burburan, NRP
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-[#0D2137]/10 text-[#0D2137] border-0 px-3 py-1">
                  Critical Care Paramedic
                </Badge>
                <Badge variant="secondary" className="bg-[#0D2137]/10 text-[#0D2137] border-0 px-3 py-1">
                  NAEMSE Level 1 Instructor
                </Badge>
                <Badge variant="secondary" className="bg-[#0D2137]/10 text-[#0D2137] border-0 px-3 py-1">
                  UF CCP Program Graduate
                </Badge>
                <Badge variant="secondary" className="bg-[#0D2137]/10 text-[#0D2137] border-0 px-3 py-1">
                  10+ Years EMS Experience
                </Badge>
              </div>
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
