import React from 'react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Award, BookOpen, Users, Target } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import vincentHeadshot from '@/assets/vincent-headshot.png';

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

export default function AboutPage() {
  const credentials = [
    { title: 'NRP', description: 'National Registry Paramedic' },
    { title: 'NAEMSE', description: 'Level 1 Instructor' },
    { title: 'UFCCP', description: 'Graduate' },
    { title: '10+ Years', description: 'EMS Experience' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Evidence-Based',
      description: 'Every strategy is backed by peer-reviewed research in clinical judgment and exam performance',
      color: '#E03038'
    },
    {
      icon: BookOpen,
      title: 'Student-Centered',
      description: 'Designed for real students struggling with real challenges, not just content review',
      color: '#0D2137'
    },
    {
      icon: Users,
      title: 'Accessible',
      description: 'Quality NREMT prep shouldn\'t break the bank. Fair pricing for all students',
      color: '#d4a843'
    },
    {
      icon: Target,
      title: 'Results-Focused',
      description: 'Success measured by first-time pass rates, not just material sold',
      color: '#E03038'
    }
  ];

  const timeline = [
    { year: '2014', event: 'Began his EMS Career' },
    { year: '2021', event: 'Started tutoring EMS students online on tutoring platforms' },
    { year: '2022', event: 'Earned NAEMSE Level 1 Instructor Certification' },
    { year: '2023', event: 'Graduated University of Florida Critical Care Paramedic Program' },
    { year: '2025', event: 'Founded Path2Medic to help students master clinical judgment' }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#0D2137] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-white/50 mb-4">About Path2Medic</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">Meet the Instructor</h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Teaching the thinking process that expert clinicians use daily
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-br from-[#E03038]/20 to-[#d4a843]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                  <img
                    src={vincentHeadshot}
                    alt="Vincent Burburan, NRP"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold text-[#0D2137] mb-4 tracking-tight">Vincent Burburan, NRP</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {credentials.map((cred, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#0D2137]/8 text-[#0D2137] font-medium px-3 py-1.5 rounded-lg border-0 hover:bg-[#0D2137]/12 transition-colors duration-300"
                    >
                      {cred.title}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-4 text-gray-500 leading-relaxed">
                  <p>
                    Vincent Burburan is a National Registry Paramedic (NRP) with over 10 years of EMS experience
                    spanning critical care transport, ground emergency response, and EMS education. He holds his
                    NAEMSE Level 1 Instructor certification and is a graduate of the University of Florida Critical
                    Care Paramedic Program.
                  </p>
                  <p>
                    After years of tutoring EMS students on various platforms, Vincent noticed a consistent pattern
                    among those who struggled with the NREMT: they weren't failing due to lack of clinical
                    knowledge—they were failing because they couldn't systematically reason through complex,
                    undifferentiated patient presentations.
                  </p>
                  <p>
                    This insight led him to develop Path2Medic, an evidence-based exam preparation platform built
                    on peer-reviewed research in clinical judgment. Every strategy, framework, and practice scenario
                    is designed to help students master the THINKING PROCESS that expert clinicians use daily.
                  </p>
                  <div className="bg-[#0D2137]/[0.03] border-l-2 border-[#E03038]/30 rounded-r-xl px-6 py-5 mt-8">
                    <p className="italic font-semibold text-[#0D2137] text-lg leading-relaxed">
                      "Clinical judgment isn't innate talent—it's a trainable skill that can be learned, practiced,
                      and perfected."
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D2137] mb-10 tracking-tight">
              The Path2Medic Mission
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-1 bg-gradient-to-r from-[#E03038] via-[#d4a843] to-[#E03038]/60" />
              <CardContent className="p-8 md:p-12 space-y-5 text-gray-500">
                <p className="text-lg leading-relaxed">
                  I created Path2Medic to bridge the gap between EMS education and exam success. Too many capable
                  students fail the NREMT not because they don't know the material, but because no one taught them
                  HOW to think through complex scenarios under pressure.
                </p>
                <p className="text-lg leading-relaxed">
                  My guides are different. Every claim is supported by research. Every scenario builds systematic
                  reasoning. Every strategy is evidence-based.
                </p>
                <div className="border-l-2 border-[#E03038]/30 pl-6 mt-4">
                  <p className="text-lg font-semibold text-[#0D2137]">
                    You're not just studying for an exam—you're becoming the clinician your future patients need.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Our Core Values
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="text-center border-0 shadow-md rounded-2xl hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                    <CardContent className="pt-8 pb-6 px-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${value.color}15` }}
                      >
                        <Icon className="h-7 w-7" style={{ color: value.color }} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-[#0D2137]">{value.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">The Story So Far</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              My EMS Journey
            </h2>
          </AnimatedSection>
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-[62px] top-4 bottom-4 w-px bg-gradient-to-b from-[#E03038]/20 via-[#0D2137]/20 to-[#d4a843]/20" />
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="flex gap-6 md:gap-8 items-center group">
                    <div className="relative z-10">
                      <div className="bg-[#0D2137] text-white px-5 py-2.5 rounded-xl font-bold text-lg min-w-[96px] text-center shadow-md group-hover:bg-[#E03038] transition-colors duration-300">
                        {item.year}
                      </div>
                    </div>
                    <div className="flex-1 bg-white border-l-2 border-[#E03038]/30 rounded-2xl shadow-sm px-6 py-5 group-hover:shadow-md group-hover:translate-x-1 transition-all duration-300">
                      <p className="text-gray-600 leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
