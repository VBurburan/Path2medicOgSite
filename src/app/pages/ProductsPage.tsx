import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
// Icons removed — using numbered indicators instead
import { useInView } from '@/hooks/useInView';

// Import book covers
import proofCover from '@/assets/proof-cover.png';
import spotItCover from '@/assets/spotit-cover.png';
import catCover from '@/assets/cat-cover.png';
import workbookCover from '@/assets/workbook-cover.png';
import underTheHoodCover from '@/assets/underhood-cover.png';

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

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const products = [
    {
      title: 'Under the Hood',
      subtitle: 'Writing Better NREMT-Aligned EMS Questions',
      description: 'A practical guide to Clinical Judgment item writing, TEIs, and diagnostic error analysis for EMS educators. Learn how to build scenario-based items and use TEI formats effectively.',
      price: 22.99,
      level: 'All' as const,
      category: ['educators', 'all'],
      coverImage: underTheHoodCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3674017?price_id=4619456'
    },
    {
      title: 'The Proof is in the Pudding',
      subtitle: 'Break Down the Question, Find the Answer',
      description: 'NREMT Prep in 53 pages, straightforward and effective. Unlike endless practice tests and 500-page books, this focused guide teaches you systematic test-taking strategies to break down questions and find the right answers consistently.',
      price: 13.99,
      level: 'EMT' as const,
      category: ['emt', 'educators'],
      coverImage: proofCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528'
    },
    {
      title: 'Spot It, Sort It, Solve It',
      subtitle: 'NREMT Clinical Judgment Study Guide',
      description: 'Master NREMT Clinical Judgment with this 39-page research-backed guide. Designed for EMS students and educators, it uses proven frameworks to help you recognize patterns, prioritize interventions, and ace the new clinical judgment items on your exam.',
      price: 15.99,
      level: 'Paramedic' as const,
      category: ['aemt', 'paramedic', 'educators'],
      coverImage: spotItCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694'
    },
    {
      title: 'Clinical Judgment & TEI Workbook- Paramedic',
      subtitle: 'Paramedic Edition',
      description: 'Stop guessing and start thinking like an expert! This 70-page workbook enhances your clinical judgment skills with high-quality practice scenarios. Designed specifically for paramedic-level NREMT preparation.',
      price: 15.99,
      level: 'Paramedic' as const,
      category: ['paramedic', 'educators'],
      coverImage: workbookCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954'
    },
    {
      title: 'CAT Got Your Tongue?',
      subtitle: 'Guide to Computer Adaptive Testing (CAT)',
      description: 'Struggling with the NREMT CAT test format? This detailed guide offers proven strategies to conquer CAT confusion and approach your exam with confidence. Learn how the algorithm works and how to leverage it to your advantage.',
      price: 15.99,
      level: 'All' as const,
      category: ['emt', 'aemt', 'paramedic', 'educators', 'all'],
      coverImage: catCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3636485?price_id=4577181'
    }
  ];

  const bundles = [
    {
      title: 'NREMT Prep Complete Bundle',
      subtitle: 'Test Strategies + Clinical Judgment',
      description: 'The ultimate NREMT prep package combining two bestselling resources at a discounted rate. Includes "The Proof is in The Pudding" test strategies guide (53 pages) and "Spot It, Sort It, Solve It" clinical judgment study guide (39 pages), giving you comprehensive coverage of both test-taking strategies and clinical reasoning skills.',
      price: 24.99,
      level: 'All' as const,
      category: 'bundles',
      coverImages: [proofCover, spotItCover],
      purchaseLink: 'https://path2medic.thinkific.com/bundles/nremt-prep-complete-bundle'
    },
    {
      title: 'Paramedic Clinical Judgement Bundle',
      subtitle: 'Clinical Judgment Guide + Workbook',
      description: 'This comprehensive bundle combines two essential resources for paramedic students. You\'ll receive "Spot It, Sort It, Solve It" (39-page clinical judgment guide) and the "Clinical Judgment & TEI Workbook- Paramedic" (70-page workbook), giving you both strategic frameworks and hands-on practice to master clinical judgment skills at a discounted price.',
      price: 22.99,
      level: 'Paramedic' as const,
      category: 'bundles',
      coverImages: [spotItCover, workbookCover],
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605346?price_id=4541970'
    }
  ];

  const allProducts = [...products, ...bundles];

  const filteredProducts = activeTab === 'all'
    ? allProducts
    : allProducts.filter(p => {
        if (Array.isArray(p.category)) {
          return p.category.includes(activeTab);
        }
        return p.category === activeTab;
      });

  const features = [
    {
      num: '01',
      title: 'Evidence-Based',
      description: 'Every strategy is backed by peer-reviewed research on clinical judgment and exam performance',
    },
    {
      num: '02',
      title: 'Exam-Aligned',
      description: 'Updated for July 2024 changes including all TEI question types and clinical judgment focus',
    },
    {
      num: '03',
      title: 'Systematic Approach',
      description: 'Learn the thinking process, not just memorize content - the key to first-time success',
    }
  ];

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-[#0D2137] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-white/50 mb-4">Study Resources</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">Study Resources</h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
              Evidence-based guides designed for the recent NREMT exam changes
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-6 mb-14 bg-white shadow-md rounded-xl p-1">
                <TabsTrigger value="all" className="rounded-lg transition-all duration-300 data-[state=active]:shadow-sm">All</TabsTrigger>
                <TabsTrigger value="emt" className="rounded-lg transition-all duration-300 data-[state=active]:shadow-sm">EMT</TabsTrigger>
                <TabsTrigger value="aemt" className="rounded-lg transition-all duration-300 data-[state=active]:shadow-sm">AEMT</TabsTrigger>
                <TabsTrigger value="paramedic" className="rounded-lg transition-all duration-300 data-[state=active]:shadow-sm">Paramedic</TabsTrigger>
                <TabsTrigger value="educators" className="rounded-lg transition-all duration-300 data-[state=active]:shadow-sm">Educators</TabsTrigger>
                <TabsTrigger value="bundles" className="rounded-lg transition-all duration-300 data-[state=active]:shadow-sm">Bundles</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <AnimatedSection key={index} delay={index * 0.08}>
                      <ProductCard {...product} />
                    </AnimatedSection>
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-400 text-lg">No products found in this category.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </AnimatedSection>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">The Difference</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Why Path2Medic Resources Are Different
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <AnimatedSection key={index} delay={index * 0.12}>
                  <div className="text-center group">
                    <span className="font-mono text-2xl font-bold text-[#E03038] mb-4 block tracking-wide">
                      {feature.num}
                    </span>
                    <h3 className="text-xl font-semibold mb-3 text-[#0D2137]">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
