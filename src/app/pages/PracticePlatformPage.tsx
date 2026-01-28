import React from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, CheckSquare, MousePointer, ArrowDownUp, ListOrdered, Grid3x3, Image as ImageIcon } from 'lucide-react';

export default function PracticePlatformPage() {
  const studentFeatures = [
    'All 6 Technology-Enhanced Item (TEI) formats used on national certification exams',
    'Questions for EMT, AEMT, and Paramedic levels',
    'Domain-weighted to match published test plan specifications',
    'New questions added monthly',
    'Progress tracking by domain and question type',
    'Detailed rationales that teach clinical reasoning'
  ];

  const teiFormats = [
    {
      icon: CheckCircle,
      name: 'Multiple Choice',
      description: 'Standard single-answer selection'
    },
    {
      icon: CheckSquare,
      name: 'Multiple Response',
      description: 'Select All That Apply'
    },
    {
      icon: MousePointer,
      name: 'Drag-and-Drop',
      description: 'Interactive placement items'
    },
    {
      icon: ListOrdered,
      name: 'Build List',
      description: 'Sequencing and ordering'
    },
    {
      icon: Grid3x3,
      name: 'Options Box',
      description: 'Categorization tasks'
    },
    {
      icon: ImageIcon,
      name: 'Graphical Items',
      description: 'Visual-based questions'
    }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4F72] to-[#5DADE2] py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Practice Questions Built for Modern EMS Certification
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Technology-Enhanced Items aligned with current national exam specifications — for students and educators
          </p>
        </div>
      </section>

      {/* TEI Formats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-4">
            All 6 TEI Question Formats
          </h2>
          <p className="text-center text-gray-600 mb-12">
            The same item formats used on national EMS certification exams
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {teiFormats.map((format, index) => {
              const Icon = format.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-[#E67E22] mx-auto mb-2" />
                    <CardTitle className="text-sm">{format.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600">{format.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOR STUDENTS Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B4F72] mb-4">
              Master the Question Formats Before Test Day
            </h2>
          </div>

          {/* Features */}
          <div className="max-w-3xl mx-auto mb-12">
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {studentFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Monthly</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-[#1B4F72]">$29</span>
                  <span className="text-gray-500">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>Full access, all levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>Cancel anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>7-day free trial</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-4 border-[#E67E22] shadow-xl">
              <div className="bg-[#E67E22] text-white text-center py-2 font-semibold">
                Save $149
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Annual</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-[#1B4F72]">$199</span>
                  <span className="text-gray-500">/year</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>Full access, all levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Includes 1 coaching call ($150 value)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>7-day free trial</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#E67E22] hover:bg-[#D35400]">
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#1B4F72] mb-2">1000+</div>
              <p className="text-gray-600">Practice Questions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#1B4F72] mb-2">6</div>
              <p className="text-gray-600">TEI Question Types</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#1B4F72] mb-2">3</div>
              <p className="text-gray-600">Certification Levels</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#1B4F72] mb-2">100%</div>
              <p className="text-gray-600">Evidence-Based</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}