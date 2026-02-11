import React from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, CheckSquare, MousePointer, ArrowDownUp, ListOrdered, Grid3x3, Image as ImageIcon, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PracticePlatformPage() {
  const navigate = useNavigate();

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
      <section className="bg-gradient-to-br from-[#0D2137] to-[#0D2137] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform rotate-12">
          <Bell className="w-64 h-64" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-white/10 backdrop-blur-sm mb-8 border border-white/20">
            <Badge className="bg-[#E03038] text-white hover:bg-[#c52830] px-6 py-2 text-lg font-bold border-none shadow-lg animate-pulse">
              🚀 COMING SOON
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Practice Questions Built for Modern EMS Certification
          </h1>
          <p className="text-xl text-white/90 mb-8">
            We're preparing the ultimate TEI-focused practice platform aligned with current national exam specifications.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-[#0D2137] hover:bg-gray-100 font-semibold"
            onClick={() => navigate('/contact')}
          >
            Get Notified When We Launch
          </Button>
        </div>
      </section>

      {/* TEI Formats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D2137] mb-4">
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
                    <Icon className="h-10 w-10 text-[#E03038] mx-auto mb-2" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">
              Master the Question Formats Before Test Day
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We are finalizing our question bank and testing the platform to ensure the best experience.
            </p>
          </div>

          {/* Features */}
          <div className="max-w-3xl mx-auto mb-16">
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {studentFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#0D2137] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Call to Action */}
          <Card className="max-w-3xl mx-auto text-center border-2 border-[#E03038]/20 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-[#FFF3E0] p-4 rounded-full w-fit mb-4">
                  <Bell className="h-10 w-10 text-[#E03038]" />
              </div>
              <CardTitle className="text-2xl text-[#0D2137]">Launch Notification</CardTitle>
              <CardDescription className="text-lg">
                Join our waitlist to be the first to know when the platform goes live.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                 <Button 
                   size="lg" 
                   className="bg-[#0D2137] hover:bg-[#0D2137] text-white px-8" 
                   onClick={() => navigate('/contact')}
                 >
                    Join Waitlist
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#0D2137] mb-2">1000+</div>
              <p className="text-gray-600">Practice Questions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0D2137] mb-2">6</div>
              <p className="text-gray-600">TEI Question Types</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0D2137] mb-2">3</div>
              <p className="text-gray-600">Certification Levels</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0D2137] mb-2">100%</div>
              <p className="text-gray-600">Evidence-Based</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
