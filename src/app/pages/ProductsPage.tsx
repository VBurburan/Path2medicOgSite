import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Import book covers
import proofCover from '../../assets/5c9cc05b9263baa3a352ea86e5d9e616da333add.png';
import spotItCover from '../../assets/c96381ee722dcf250fe4e2642e201c8802dc3930.png';
import catCover from '../../assets/82e98b0c076d1ccc611ae137148c3b03243ef9d8.png';
import workbookCover from '../../assets/fdfb19885d9e08b5312f32a21629fca03db0d3ad.png';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const products = [
    {
      title: 'The Proof is in the Pudding',
      subtitle: 'Break Down the Question, Find the Answer',
      description: 'NREMT Prep in 53 pages, straightforward and effective. Unlike endless practice tests and 500-page books, this focused guide teaches you systematic test-taking strategies to break down questions and find the right answers consistently.',
      price: 13.99,
      level: 'EMT' as const,
      category: 'emt',
      coverImage: proofCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3569566?price_id=4502528'
    },
    {
      title: 'Spot It, Sort It, Solve It',
      subtitle: 'NREMT Clinical Judgment Study Guide',
      description: 'Master NREMT Clinical Judgment with this 39-page research-backed guide. Designed for EMS students and educators, it uses proven frameworks to help you recognize patterns, prioritize interventions, and ace the new clinical judgment items on your exam.',
      price: 15.99,
      level: 'Paramedic' as const,
      category: ['aemt', 'paramedic'],
      coverImage: spotItCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3585671?price_id=4520694'
    },
    {
      title: 'Clinical Judgment & TEI Workbook- Paramedic',
      subtitle: 'Paramedic Edition',
      description: 'Stop guessing and start thinking like an expert! This 70-page workbook enhances your clinical judgment skills with high-quality practice scenarios. Designed specifically for paramedic-level NREMT preparation.',
      price: 11.99,
      level: 'Paramedic' as const,
      category: 'paramedic',
      coverImage: workbookCover,
      purchaseLink: 'https://path2medic.thinkific.com/enroll/3605333?price_id=4541954'
    },
    {
      title: 'CAT Got Your Tongue?',
      subtitle: 'Guide to Computer Adaptive Testing (CAT)',
      description: 'Struggling with the NREMT CAT test format? This detailed guide offers proven strategies to conquer CAT confusion and approach your exam with confidence. Learn how the algorithm works and how to leverage it to your advantage.',
      price: 11.99,
      level: 'All' as const,
      category: ['emt', 'aemt', 'paramedic', 'all'],
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
      coverImages: [spotItCover, workbookCover]
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

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#1B4F72] to-[#5DADE2] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Resources</h1>
          <p className="text-xl text-white/90">
            Evidence-based guides designed for the recent NREMT exam changes
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-12">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="emt">EMT</TabsTrigger>
              <TabsTrigger value="aemt">AEMT</TabsTrigger>
              <TabsTrigger value="paramedic">Paramedic</TabsTrigger>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found in this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1B4F72] mb-12">
            Why Path2Medic Resources Are Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#7FA99B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Evidence-Based</h3>
              <p className="text-gray-600">
                Every strategy is backed by peer-reviewed research on clinical judgment and exam performance
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#5DADE2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Exam-Aligned</h3>
              <p className="text-gray-600">
                Updated for July 2024 changes including all TEI question types and clinical judgment focus
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#E67E22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Systematic Approach</h3>
              <p className="text-gray-600">
                Learn the thinking process, not just memorize content - the key to first-time success
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}