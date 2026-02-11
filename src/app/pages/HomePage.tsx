import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Award, Brain, TrendingUp, BookOpen, Users, Star } from 'lucide-react';

// Import book covers
import proofCover from '@/assets/proof-cover.png';
import spotItCover from '@/assets/spotit-cover.png';
import catCover from '@/assets/cat-cover.png';
import workbookCover from '@/assets/workbook-cover.png';
import vincentHeadshot from '@/assets/vincent-headshot.png';
import underTheHoodCover from '@/assets/underhood-cover.png';

export default function HomePage() {
  const trustBadges = [
    'All 6 TEI Formats',
    'Evidence-Based Content',
    'Updated Monthly'
  ];

  const problems = [
    {
      title: 'The Problem',
      description: 'Generic memorization-focused materials leave students unprepared for Clinical Judgment questions (31-38% of exam)',
      icon: Brain
    },
    {
      title: 'The Reality',
      description: 'July 2024 brought major exam changes. TEI questions require systematic reasoning, not rote memory.',
      icon: TrendingUp
    },
    {
      title: 'The Solution',
      description: 'Path2Medic\'s evidence-based framework teaches you HOW to think through complex scenarios.',
      icon: CheckCircle
    }
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
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3674017?price_id=4619456'
    },
    {
      title: 'The Proof is in the Pudding',
      subtitle: 'Break Down the Question, Find the Answer',
      description: 'NREMT Prep in 53 pages, straightforward and effective. Unlike endless practice tests and 500-page books, this focused guide teaches you systematic test-taking strategies.',
      price: 13.99,
      level: 'EMT' as const,
      coverImage: proofCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528'
    },
    {
      title: 'Spot It, Sort It, Solve It',
      subtitle: 'NREMT Clinical Judgment Study Guide',
      description: 'Master NREMT Clinical Judgment with this 39-page research-backed guide. Designed for EMS students and educators, it uses proven frameworks to help you recognize patterns and prioritize interventions.',
      price: 15.99,
      level: 'Paramedic' as const,
      coverImage: spotItCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694'
    },
    {
      title: 'Clinical Judgment & TEI Workbook',
      subtitle: 'Paramedic Edition',
      description: 'Stop guessing and start thinking like an expert! This 70-page workbook enhances your clinical judgment skills with high-quality practice scenarios.',
      price: 11.99,
      level: 'Paramedic' as const,
      coverImage: workbookCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954'
    },
    {
      title: 'CAT Got Your Tongue?',
      subtitle: 'Guide to Computer Adaptive Testing (CAT)',
      description: 'Struggling with the NREMT CAT test format? This detailed guide offers proven strategies to conquer CAT confusion and approach your exam with confidence. Learn how the algorithm works and how to leverage it to your advantage.',
      price: 15.99,
      level: 'All' as const,
      coverImage: catCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3636485?price_id=4577181'
    }
  ];

  const features = [
    'All 6 TEI Question Types (Drag & Drop, Build List, Options Box, etc.)',
    'Clinical Judgment Scenarios with 3-Phase Structure',
    'Custom Weakness Analysis & Study Plans',
    'Real-Time Progress Tracking by Domain',
    'EMT, AEMT & Paramedic Question Banks'
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(13, 33, 55, 0.85), rgba(26, 95, 122, 0.7)), url(https://images.unsplash.com/photo-1649768862026-f21a814945f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJ1bGFuY2UlMjBtb3Rpb258ZW58MXx8fHwxNzY3NzE0MDYwfDA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Pass Your NREMT the First Time
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            1-on-1 Private NREMT Coaching + Evidence-Based Study Materials
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get personalized tutoring from a National Registry Paramedic, plus proven strategies for EMT, AEMT & Paramedic certification exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/tutoring">
              <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] text-lg px-8 py-6 shadow-lg">
                Book 1-on-1 Coaching
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" className="bg-[#E03038] hover:bg-[#c52830] text-lg px-8 py-6">
                Purchase Study Materials
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D2137] mb-4">
            Study Resources Built for the New NREMT
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Evidence-based guides designed for the recent NREMT exam changes
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-[#0D2137] text-[#0D2137]">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D2137] mb-12">
            Traditional Test Prep Doesn't Work. Here's What Does.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-[#E03038] mb-4" />
                    <CardTitle className="text-xl text-[#0D2137]">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{problem.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice Platform Preview */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D2137] mb-12">
            Practice Like It's Test Day
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-[#0D2137] to-[#1a5f7a] rounded-lg p-8 aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <BookOpen className="h-24 w-24 mx-auto mb-4" />
                <p className="text-lg">Interactive Practice Interface</p>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#1a5f7a] flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
              <Link to="/practice">
                <Button size="lg" className="mt-8 bg-[#E03038] hover:bg-[#c52830]">
                  Start Practicing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tutoring CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1a5f7a] to-[#0d3b4c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            1-on-1 coaching sessions via Zoom with a National Registry Paramedic and certified instructor.
          </p>
          <Link to="/tutoring">
            <Button size="lg" variant="secondary" className="bg-white text-[#1a5f7a] hover:bg-gray-100">
              Book a Coaching Call
            </Button>
          </Link>
        </div>
      </section>

      {/* About/Credibility */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={vincentHeadshot}
                alt="Vincent Burburan, NRP"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0D2137] mb-4">
                Vincent Burburan, NRP
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-[#1a5f7a] text-white">
                  All 6 TEI Formats
                </Badge>
                <Badge variant="secondary" className="bg-[#0d3b4c] text-white">
                  Evidence-Based Content
                </Badge>
                <Badge variant="secondary" className="bg-[#E03038] text-white">
                  Updated Monthly
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">
                "After years of tutoring EMS students, I discovered a pattern: candidates weren't failing
                because they lacked knowledge. They failed because they couldn't systematically reason through
                complex scenarios."
              </p>
              <p className="text-gray-700 mb-6">
                "That's why I created Path2Medic - to teach the thinking process that expert clinicians use daily."
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-[#0D2137] text-[#0D2137]">
                  Read My Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
