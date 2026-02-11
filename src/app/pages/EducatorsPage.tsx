import React from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, BookOpen, Users, BarChart3, Download, GraduationCap, Building2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnderTheHoodHero, UnderTheHoodDetailed } from '../components/products/UnderTheHoodPromo';
import { useInView } from '@/hooks/useInView';

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

export default function EducatorsPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Generate TEI-Formatted Questions',
      description: 'Create practice questions in all 6 Technology-Enhanced Item formats used on national certification exams—no manual formatting required.',
      color: '#E03038'
    },
    {
      icon: GraduationCap,
      title: 'Curriculum Alignment',
      description: 'Align questions to specific domains, learning objectives, and your program\'s certification level (EMT, AEMT, Paramedic).',
      color: '#0D2137'
    },
    {
      icon: Download,
      title: 'LMS Integration',
      description: 'Export questions for use in your Learning Management System, classroom assessments, or study materials.',
      color: '#d4a843'
    },
    {
      icon: BarChart3,
      title: 'Cohort Analytics',
      description: 'Track student performance across your entire cohort. Identify trends, knowledge gaps, and areas needing additional instruction.',
      color: '#E03038'
    },
    {
      icon: Users,
      title: 'Student Progress Tracking',
      description: 'Monitor individual student progress by domain and question type to provide targeted remediation.',
      color: '#0D2137'
    },
    {
      icon: Building2,
      title: 'Evidence-Based Content',
      description: 'All questions built on publicly available test plan specifications and current EMS educational standards.',
      color: '#d4a843'
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
      <section className="bg-[#0D2137] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-0 p-4 opacity-[0.04]">
          <GraduationCap className="w-64 h-64" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <Badge className="bg-white/10 text-white/90 border-white/20 mb-6 py-1.5 px-4 font-medium backdrop-blur-sm">FOR INSTRUCTORS & PROGRAMS</Badge>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <div className="block mt-2 mb-8">
              <Badge className="bg-[#E03038] text-white px-6 py-2.5 text-lg font-bold border-none shadow-lg shadow-[#E03038]/25 animate-pulse rounded-xl">
                PLATFORM COMING SOON
              </Badge>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
              Generate Practice Questions Aligned with Your Curriculum
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop spending hours writing questions. Our platform is coming soon to help you create TEI-formatted practice items that match your course content.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.35}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#0D2137] hover:bg-gray-100 font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                Get Notified on Launch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Book: Under the Hood */}
      <section className="py-12 bg-white relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UnderTheHoodHero />
        </div>
      </section>

      {/* Why Educators Choose Path2Medic */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4 tracking-tight">
              Why EMS Programs Choose Path2Medic
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Designed by an NRP with real-world teaching experience and aligned to current national certification standards
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.08}>
                  <Card className="border-0 rounded-2xl shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                    <CardHeader>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${feature.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: feature.color }} />
                      </div>
                      <CardTitle className="text-[#0D2137]">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              How Instructors Use Path2Medic
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="border-0 border-l-2 border-l-[#E03038]/30 rounded-2xl shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="bg-[#0D2137]/10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-5 w-5 text-[#0D2137]" />
                        </div>
                        <div>
                          <CardTitle className="mb-2 text-[#0D2137]">{useCase.title}</CardTitle>
                          <CardDescription className="text-base text-gray-400 leading-relaxed">{useCase.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">Benefits</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Benefits for Your Program
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-1 bg-gradient-to-r from-[#E03038] via-[#d4a843] to-[#E03038]/60" />
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-2 gap-5">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="bg-[#0D2137]/10 rounded-lg p-1 mt-0.5 group-hover/item:bg-[#E03038]/10 transition-colors duration-300">
                        <CheckCircle className="h-4 w-4 text-[#0D2137] group-hover/item:text-[#E03038] transition-colors duration-300" />
                      </div>
                      <span className="text-gray-600 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Deep Dive: Under The Hood Book */}
      <UnderTheHoodDetailed />

      {/* Coming Soon Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4 tracking-tight">
              Institutional Pricing Coming Soon
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              We are working on custom solutions for EMS programs, departments, and training centers.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <Card className="max-w-2xl mx-auto border border-[#E03038]/15 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#E03038] via-[#d4a843] to-[#E03038]/60" />
              <CardHeader className="pt-10">
                <div className="mx-auto bg-[#E03038]/10 p-4 rounded-2xl w-fit mb-4">
                  <Bell className="h-10 w-10 text-[#E03038]" />
                </div>
                <CardTitle className="text-2xl text-[#0D2137]">Partner With Us</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Contact us to discuss your program's needs and be the first to access the platform.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-3 pb-8">
                <Button
                  className="w-full bg-[#0D2137] hover:bg-[#162d47] font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Contact for Early Access
                </Button>
                <p className="text-sm text-gray-400">
                  Questions? Email <a href="mailto:vincent@path2medic.com" className="text-[#0D2137] hover:text-[#E03038] font-medium transition-colors duration-300">vincent@path2medic.com</a>
                </p>
              </CardFooter>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">Audience</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Perfect For
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: 'EMS Programs', desc: 'College and university EMS education programs', color: '#E03038' },
              { icon: Building2, title: 'Training Centers', desc: 'Independent EMS training and testing centers', color: '#0D2137' },
              { icon: Users, title: 'Departments', desc: 'Fire and EMS agencies with in-house training', color: '#d4a843' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="text-center border-0 shadow-md rounded-2xl hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                    <CardHeader>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon className="h-7 w-7" style={{ color: item.color }} />
                      </div>
                      <CardTitle className="text-[#0D2137]">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
