import React from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, BookOpen, Users, BarChart3, Download, GraduationCap, Building2 } from 'lucide-react';

export default function EducatorsPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Generate TEI-Formatted Questions',
      description: 'Create practice questions in all 6 Technology-Enhanced Item formats used on national certification exams—no manual formatting required.'
    },
    {
      icon: GraduationCap,
      title: 'Curriculum Alignment',
      description: 'Align questions to specific domains, learning objectives, and your program\'s certification level (EMT, AEMT, Paramedic).'
    },
    {
      icon: Download,
      title: 'LMS Integration',
      description: 'Export questions for use in your Learning Management System, classroom assessments, or study materials.'
    },
    {
      icon: BarChart3,
      title: 'Cohort Analytics',
      description: 'Track student performance across your entire cohort. Identify trends, knowledge gaps, and areas needing additional instruction.'
    },
    {
      icon: Users,
      title: 'Student Progress Tracking',
      description: 'Monitor individual student progress by domain and question type to provide targeted remediation.'
    },
    {
      icon: Building2,
      title: 'Evidence-Based Content',
      description: 'All questions built on publicly available test plan specifications and current EMS educational standards.'
    }
  ];

  const useCases = [
    {
      title: 'Mid-Course Knowledge Checks',
      description: 'Generate quick assessments aligned to recent lecture topics to verify student understanding.',
      icon: CheckCircle
    },
    {
      title: 'Final Exam Preparation',
      description: 'Create comprehensive practice exams that mirror the format and weighting of national certification tests.',
      icon: GraduationCap
    },
    {
      title: 'Remediation for Struggling Students',
      description: 'Identify weak areas and generate targeted practice questions to help students improve before test day.',
      icon: Users
    },
    {
      title: 'Supplemental Practice Materials',
      description: 'Provide students with additional practice questions aligned to your curriculum and pacing.',
      icon: BookOpen
    }
  ];

  const benefits = [
    'Save hours of question-writing time each week',
    'Ensure students practice with modern TEI formats before certification',
    'Align practice materials to your program\'s learning objectives',
    'Track cohort performance to improve curriculum delivery',
    'Provide evidence-based rationales that reinforce clinical reasoning',
    'Access updated content as test plans and standards evolve'
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4F72] to-[#5DADE2] py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white text-[#1B4F72] mb-4">FOR INSTRUCTORS & PROGRAMS</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Generate Practice Questions Aligned with Your Curriculum
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Stop spending hours writing questions. Our platform creates TEI-formatted practice items that match your course content and national exam specifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-[#1B4F72] hover:bg-gray-100">
              Request Educator Access
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Why Educators Choose Path2Medic */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-4">
            Why EMS Programs Choose Path2Medic
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Designed by an NRP with real-world teaching experience and aligned to current national certification standards
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-[#5DADE2] mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-12">
            How Instructors Use Path2Medic
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="border-l-4 border-[#5DADE2]">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Icon className="h-8 w-8 text-[#5DADE2] flex-shrink-0" />
                      <div>
                        <CardTitle className="mb-2">{useCase.title}</CardTitle>
                        <CardDescription className="text-base">{useCase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-12">
            Benefits for Your Program
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing & Access */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B4F72] mb-4">
            Institutional Pricing Available
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Custom pricing for EMS programs, departments, and training centers
          </p>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription>
                Contact us to discuss your program's needs and get a custom quote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#F8F9FA] p-6 rounded-lg">
                <h3 className="font-semibold text-[#1B4F72] mb-4">What to expect:</h3>
                <ul className="text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>15-minute consultation to understand your needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>Personalized platform demo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>Custom pricing based on program size</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7FA99B] flex-shrink-0 mt-0.5" />
                    <span>Onboarding and training included</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full bg-[#5DADE2] hover:bg-[#3498DB]" size="lg">
                Request Educator Access
              </Button>
              <p className="text-sm text-gray-500">
                Questions? Email <a href="mailto:vincent@path2medic.com" className="text-[#5DADE2] hover:underline">vincent@path2medic.com</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-12">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-[#5DADE2] mx-auto mb-2" />
                <CardTitle>EMS Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  College and university EMS education programs
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Building2 className="h-12 w-12 text-[#5DADE2] mx-auto mb-2" />
                <CardTitle>Training Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Independent EMS training and testing centers
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-[#5DADE2] mx-auto mb-2" />
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Fire and EMS agencies with in-house training
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
