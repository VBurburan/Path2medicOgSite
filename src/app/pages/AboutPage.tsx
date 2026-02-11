import React from 'react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Award, BookOpen, Users, Target } from 'lucide-react';
import vincentHeadshot from '@/assets/vincent-headshot.png';

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
      description: 'Every strategy is backed by peer-reviewed research in clinical judgment and exam performance'
    },
    {
      icon: BookOpen,
      title: 'Student-Centered',
      description: 'Designed for real students struggling with real challenges, not just content review'
    },
    {
      icon: Users,
      title: 'Accessible',
      description: 'Quality NREMT prep shouldn\'t break the bank. Fair pricing for all students'
    },
    {
      icon: Target,
      title: 'Results-Focused',
      description: 'Success measured by first-time pass rates, not just material sold'
    }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#0D2137] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-sm font-semibold tracking-widest uppercase text-white/60 mb-4">About Path2Medic</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">Meet the Instructor</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Teaching the thinking process that expert clinicians use daily
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
                <img
                  src={vincentHeadshot}
                  alt="Vincent Burburan, NRP"
                  className="w-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0D2137] mb-4 tracking-tight">Vincent Burburan, NRP</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {credentials.map((cred, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#0D2137]/10 text-[#0D2137] font-medium px-3 py-1 rounded-full border-0"
                  >
                    {cred.title}
                  </Badge>
                ))}
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
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
                <div className="bg-[#0D2137]/[0.03] border-l-4 border-[#E03038] rounded-r-lg px-5 py-4 mt-6">
                  <p className="italic font-semibold text-[#0D2137]">
                    "Clinical judgment isn't innate talent—it's a trainable skill that can be learned, practiced,
                    and perfected."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0D2137] mb-10 tracking-tight">
            The Path2Medic Mission
          </h2>
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#E03038] to-[#E03038]/60" />
            <CardContent className="p-8 md:p-10 space-y-5 text-gray-600">
              <p className="text-lg leading-relaxed">
                I created Path2Medic to bridge the gap between EMS education and exam success. Too many capable
                students fail the NREMT not because they don't know the material, but because no one taught them
                HOW to think through complex scenarios under pressure.
              </p>
              <p className="text-lg leading-relaxed">
                My guides are different. Every claim is supported by research. Every scenario builds systematic
                reasoning. Every strategy is evidence-based.
              </p>
              <p className="text-lg font-semibold text-[#0D2137]">
                You're not just studying for an exam—you're becoming the clinician your future patients need.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              Our Core Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="bg-[#E03038]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5">
                      <Icon className="h-7 w-7 text-[#E03038]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0D2137]">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3">The Story So Far</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] tracking-tight">
              My EMS Journey
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-[62px] top-4 bottom-4 w-px bg-gray-200" />
            <div className="space-y-5">
              {[
                { year: '2014', event: 'Began his EMS Career' },
                { year: '2021', event: 'Started tutoring EMS students online on tutoring platforms' },
                { year: '2022', event: 'Earned NAEMSE Level 1 Instructor Certification' },
                { year: '2023', event: 'Graduated University of Florida Critical Care Paramedic Program' },
                { year: '2025', event: 'Founded Path2Medic to help students master clinical judgment' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-6 md:gap-8 items-center group"
                >
                  <div className="relative z-10 bg-[#0D2137] text-white px-5 py-2.5 rounded-lg font-bold text-lg min-w-[96px] text-center shadow-sm">
                    {item.year}
                  </div>
                  <div className="flex-1 bg-white border-l-4 border-[#E03038] rounded-xl shadow-sm px-6 py-4 group-hover:shadow-md transition-shadow duration-200">
                    <p className="text-gray-700 leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
