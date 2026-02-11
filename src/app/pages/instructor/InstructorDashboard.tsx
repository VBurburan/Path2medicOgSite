import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Brain, FileText, Users, BarChart3, Sparkles, Lock } from 'lucide-react';

const tools = [
  { title: 'AI Question Generator', desc: 'Generate NREMT-aligned questions using AI and RAG', icon: Brain, href: '/instructor/generate', ready: false },
  { title: 'Exam Builder', desc: 'Create and manage shareable exam links', icon: FileText, href: '/instructor/exams', ready: false },
  { title: 'Student Management', desc: 'View and track student performance', icon: Users, href: '/instructor/students', ready: false },
  { title: 'Analytics', desc: 'Aggregate performance data and insights', icon: BarChart3, href: '/instructor/analytics', ready: false },
];

export default function InstructorDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="bg-[#0D2137] text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-[#d4a843]" />
              <Badge className="bg-[#d4a843] text-[#0D2137]">Beta</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
            <p className="text-gray-300 max-w-2xl">
              AI-powered tools for EMS educators. Generate NREMT-aligned questions, build assessments, and track student performance.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link key={tool.href} to={tool.href}>
                <Card className="hover:shadow-lg transition-shadow h-full opacity-60 cursor-not-allowed">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <tool.icon className="h-8 w-8 text-[#0D2137]" />
                      <Lock className="h-4 w-4 text-[#6c757d]" />
                    </div>
                    <CardTitle className="text-lg text-[#0D2137]">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#6c757d] text-sm">{tool.desc}</p>
                    <Badge variant="outline" className="mt-3 text-[#6c757d]">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-8">
            <CardContent className="py-8 text-center">
              <Sparkles className="h-12 w-12 text-[#d4a843] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0D2137] mb-2">Instructor Tools — Coming Soon</h3>
              <p className="text-[#6c757d] max-w-lg mx-auto">
                We're building AI-powered tools to help EMS educators create better assessments. The instructor platform will include question generation with the Clinical Judgment framework, automated exam creation, and student analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
