import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { CheckCircle, Brain, TrendingUp, BookOpen, Users, Shield, Stethoscope, GraduationCap, ArrowRight, Layers } from 'lucide-react';

// Import assets
import proofCover from '@/assets/proof-cover.png';
import spotItCover from '@/assets/spotit-cover.png';
import catCover from '@/assets/cat-cover.png';
import workbookCover from '@/assets/workbook-cover.png';
import underTheHoodCover from '@/assets/underhood-cover.png';
import vincentHeadshot from '@/assets/vincent-headshot.png';

/* ── brand palette ── */
const NAVY = '#0D2137';
const RED = '#E03038';
const TEAL = '#1a5f7a';
const GOLD = '#d4a843';

export default function HomePage() {
  const products = [
    {
      title: 'The Proof is in the Pudding',
      subtitle: 'Break Down the Question, Find the Answer',
      description: 'NREMT test-taking strategies in 53 pages. Learn how to systematically break down questions, interpret what they\'re really asking, and find the best answer.',
      price: 13.99,
      level: 'EMT',
      coverImage: proofCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528',
    },
    {
      title: 'Spot It, Sort It, Solve It',
      subtitle: 'Clinical Judgment Framework for AEMT & Paramedic',
      description: 'The NREMT adopted a Clinical Judgment framework in July 2024. This guide breaks it down into the six cognitive functions the exam actually tests.',
      price: 15.99,
      level: 'AEMT & Paramedic',
      coverImage: spotItCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694',
    },
    {
      title: 'CAT Got Your Tongue?',
      subtitle: 'Guide to Computer Adaptive Testing',
      description: 'Evidence-based strategies for managing test anxiety and mastering the CAT format. Backed by peer-reviewed research and EMS student outcomes.',
      price: 15.99,
      level: 'EMT & Paramedic',
      coverImage: catCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3636485?price_id=4577181',
    },
    {
      title: 'Clinical Judgment & TEI Workbook',
      subtitle: 'Paramedic Edition',
      description: '10 clinical scenarios with 30 questions across every TEI format. Complete answer key with detailed clinical rationales.',
      price: 11.99,
      level: 'Paramedic',
      coverImage: workbookCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954',
    },
  ];

  return (
    <Layout>
      {/* ─── Hero Section ─── */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 50%, #0d3b4c 100%)` }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6"
              style={{ backgroundColor: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}40` }}>
              <Shield className="h-3.5 w-3.5" />
              EVIDENCE-BASED NREMT PREP
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Think Like a Clinician.{' '}
              <span style={{ color: GOLD }}>Pass Like a Pro.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
              Strategic NREMT prep from a National Registry Paramedic and NAEMSE Level 1 Instructor.
              Study guides, practice exams, and 1-on-1 coaching designed around how the exam actually works.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold text-base shadow-lg transition-all hover:shadow-xl hover:opacity-95 active:scale-[0.98]"
                style={{ backgroundColor: RED }}
              >
                Browse Study Guides
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tutoring"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base border-2 border-white/30 text-white transition-all hover:bg-white/10"
              >
                Book 1-on-1 Coaching
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" /> NRP + NAEMSE L1 Instructor
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> All 6 TEI Formats
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" /> Based on 2025 Test Plan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem / Solution ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>
              The NREMT Changed. Your Prep Should Too.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Since July 2024, the NREMT evaluates Clinical Judgment across six cognitive functions.
              Memorization alone won't cut it anymore.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${RED}12` }}>
                <Brain className="h-7 w-7" style={{ color: RED }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Clinical Judgment Framework</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                31-38% of your exam now tests clinical reasoning through TEI questions. Generic practice tests don't prepare you for this.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${TEAL}12` }}>
                <TrendingUp className="h-7 w-7" style={{ color: TEAL }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Evidence-Based Methods</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every strategy references official NREMT documentation, peer-reviewed research, and validated frameworks (88.1% concordance).
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${GOLD}15` }}>
                <CheckCircle className="h-7 w-7" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>Systematic Approach</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Learn HOW to think through complex scenarios, not just what to memorize. The same reasoning expert clinicians use daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Products Showcase ─── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>
              Study Guides Built for the New NREMT
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each guide is focused, evidence-based, and designed to complement — not replace — your clinical education.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border-2 hover:shadow-md"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Practice Platform ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4"
                style={{ backgroundColor: `${TEAL}12`, color: TEAL }}>
                <BookOpen className="h-3.5 w-3.5" />
                FREE PRACTICE PLATFORM
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: NAVY }}>
                Practice Like It's Test Day
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  'All 6 TEI Question Types (Drag & Drop, Build List, Options Box, and more)',
                  'Clinical Judgment Scenarios with real patient encounters',
                  'Weakness analysis to target your lowest-scoring domains',
                  'Progress tracking by domain, question type, and CJ step',
                  'EMT, AEMT & Paramedic question banks',
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
                style={{ backgroundColor: RED }}
              >
                Start Practicing Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mock exam UI */}
            <div className="rounded-xl border border-gray-200 shadow-xl overflow-hidden bg-white">
              <div className="px-4 py-3 flex items-center justify-between border-b" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500">Question 7 of 25</span>
                  <div className="w-32 h-1.5 rounded-full bg-gray-200">
                    <div className="w-[28%] h-full rounded-full" style={{ backgroundColor: TEAL }} />
                  </div>
                </div>
                <span className="font-mono text-xs text-gray-500">12:34</span>
              </div>
              <div className="p-6">
                <div className="rounded-lg p-4 mb-5 text-sm" style={{ backgroundColor: `${TEAL}08`, border: `1px solid ${TEAL}20` }}>
                  <span className="text-xs font-semibold uppercase tracking-wide mb-1 block" style={{ color: TEAL }}>Clinical Scenario</span>
                  <p className="text-gray-700">You arrive on scene to find a 62-year-old male sitting in a tripod position, complaining of difficulty breathing...</p>
                </div>
                <p className="font-semibold text-gray-900 mb-4">Based on your initial assessment, which finding would be MOST concerning?</p>
                <div className="space-y-2.5">
                  {['Respiratory rate of 28', 'SpO2 of 88% on room air', 'Bilateral wheezing', 'Use of accessory muscles'].map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${
                        i === 1
                          ? 'border-[#1a5f7a] bg-[#1a5f7a]/5 font-medium'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        i === 1 ? 'border-[#1a5f7a]' : 'border-gray-300'
                      }`}>
                        {i === 1 && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TEAL }} />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 flex justify-between items-center border-t bg-[#f8f9fa]">
                <button className="text-xs text-gray-500 hover:text-gray-700">Previous</button>
                <button className="text-xs px-4 py-1.5 rounded font-semibold text-white" style={{ backgroundColor: TEAL }}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tutoring CTA ─── */}
      <section className="py-16 md:py-20" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Need Personalized Guidance?
          </h2>
          <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">
            1-on-1 coaching sessions via Zoom with a National Registry Paramedic and NAEMSE L1 Instructor.
            Targeted to your specific weak areas and learning style.
          </p>
          <Link
            to="/tutoring"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Book a Coaching Session
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ─── About / Credibility ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={vincentHeadshot}
                alt="Vincent Burburan, NRP"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: NAVY }}>
                Vincent Burburan, NRP
              </h2>
              <p className="text-sm font-medium mb-6" style={{ color: TEAL }}>
                National Registry Paramedic &bull; NAEMSE Level 1 Instructor
              </p>
              <blockquote className="border-l-4 pl-4 mb-6" style={{ borderColor: GOLD }}>
                <p className="text-gray-700 italic leading-relaxed">
                  "After years of tutoring EMS students, I discovered a pattern: candidates weren't failing
                  because they lacked knowledge. They failed because they couldn't systematically reason through
                  complex scenarios. That's why I created Path2Medic — to teach the thinking process that
                  expert clinicians use daily."
                </p>
              </blockquote>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4" style={{ color: TEAL }} />
                  NAEMSE L1 Certified
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope className="h-4 w-4" style={{ color: TEAL }} />
                  Active NRP
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" style={{ color: TEAL }} />
                  5 Published Guides
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" style={{ color: TEAL }} />
                  Hundreds Tutored
                </div>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
                style={{ color: TEAL }}
              >
                Read More About Path2Medic
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Educator CTA ─── */}
      <section className="py-12 border-t border-gray-200" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color: NAVY }}>
                Are you an EMS educator or program director?
              </h3>
              <p className="text-gray-600">
                Check out "Under the Hood" — item writing methodology, TEI scoring rules, and diagnostic error analysis.
              </p>
            </div>
            <Link
              to="/products/under-the-hood"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: NAVY }}
            >
              View Educator Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
