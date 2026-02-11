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
      <section className="bg-gradient-to-br from-[#1B4F72] to-[#5DADE2] py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet the Instructor</h1>
          <p className="text-xl text-white/90">
            Teaching the thinking process that expert clinicians use daily
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={vincentHeadshot}
                alt="Vincent Burburan, NRP"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1B4F72] mb-4">Vincent Burburan, NRP</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {credentials.map((cred, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#5DADE2] text-white px-3 py-1">
                    {cred.title}
                  </Badge>
                ))}
              </div>
              <div className="space-y-4 text-gray-700">
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
                <p className="italic font-semibold text-[#1B4F72]">
                  "Clinical judgment isn't innate talent—it's a trainable skill that can be learned, practiced, 
                  and perfected."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-8">
            The Path2Medic Mission
          </h2>
          <Card className="border-4 border-[#E67E22]">
            <CardContent className="p-8 space-y-4 text-gray-700">
              <p className="text-lg">
                I created Path2Medic to bridge the gap between EMS education and exam success. Too many capable 
                students fail the NREMT not because they don't know the material, but because no one taught them 
                HOW to think through complex scenarios under pressure.
              </p>
              <p className="text-lg">
                My guides are different. Every claim is supported by research. Every scenario builds systematic 
                reasoning. Every strategy is evidence-based.
              </p>
              <p className="text-lg font-semibold text-[#1B4F72]">
                You're not just studying for an exam—you're becoming the clinician your future patients need.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="bg-[#E67E22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1B4F72]">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-12">
            My EMS Journey
          </h2>
          <div className="space-y-8">
            {[
              { year: '2014', event: 'Began his EMS Career' },
              { year: '2021', event: 'Started tutoring EMS students online on tutoring platforms' },
              { year: '2022', event: 'Earned NAEMSE Level 1 Instructor Certification' },
              { year: '2023', event: 'Graduated University of Florida Critical Care Paramedic Program' },
              { year: '2025', event: 'Founded Path2Medic to help students master clinical judgment' }
            ].map((item, index) => (
              <div key={index} className="flex gap-8 items-center">
                <div className="bg-[#1B4F72] text-white px-6 py-3 rounded-lg font-bold text-xl min-w-[100px] text-center">
                  {item.year}
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}