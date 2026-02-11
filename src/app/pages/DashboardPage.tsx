import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, BookOpen, Calendar, Target } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    } else {
      setUser(session.user);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Mock data for demonstration
  const mockData = {
    readinessScore: 72,
    scoreTrend: 3,
    questionsCompleted: 247,
    questionsToday: 12,
    weakDomains: 2,
    coachingSessions: { completed: 2, total: 3, nextDate: 'Tuesday, Jan 14 @ 7:00 PM EST' },
    examDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
    domains: [
      { name: 'Scene Size-up & Safety', score: 78, target: 70, status: 'good' },
      { name: 'Primary Assessment', score: 62, target: 70, status: 'warning' },
      { name: 'Secondary Assessment', score: 71, target: 70, status: 'good' },
      { name: 'Patient Treatment & Transport', score: 58, target: 70, status: 'critical' },
      { name: 'Operations', score: 85, target: 70, status: 'excellent' },
    ],
    recentAssessments: [
      { id: 1, type: 'Intake Exam', date: 'Jan 8', score: 72, questions: 100 },
      { id: 2, type: 'Practice Test #2', date: 'Dec 28', score: 68, questions: 80 },
    ],
    products: [
      { id: 1, title: 'The Proof is in the Pudding', type: 'Guide', progress: 80, image: null },
      { id: 2, title: 'CAT Got Your Tongue?', type: 'Guide', progress: 0, image: null },
    ],
  };

  const daysUntilExam = mockData.examDate ? Math.ceil((mockData.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <img src={logo} alt="Path2Medic" className="h-10 w-auto" />
              <nav className="hidden md:flex space-x-6">
                <a href="/dashboard" className="text-[#1B4F72] font-semibold border-b-2 border-[#E67E22] py-4">Dashboard</a>
                <a href="/products" className="text-gray-600 hover:text-[#1B4F72] py-4">My Products</a>
                <a href="/practice" className="text-gray-600 hover:text-[#1B4F72] py-4">Practice Tests</a>
                <a href="/tutoring" className="text-gray-600 hover:text-[#1B4F72] py-4">Book Coaching</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1B4F72] to-[#2874A6] rounded-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.name?.split(' ')[0] || 'Student'}!</h1>
              <div className="flex items-center space-x-4">
                <Badge className="bg-[#7FA99B] text-white">Paramedic Candidate</Badge>
                {daysUntilExam && (
                  <span className="text-lg">Your NREMT is in <span className="font-bold">{daysUntilExam} days</span></span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white" onClick={() => navigate('/intake-exam')}>
                Take Intake Exam →
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Continue where you left off →
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Readiness Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-[#1B4F72]">{mockData.readinessScore}%</span>
                <span className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{mockData.scoreTrend}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Based on most recent assessment</p>
            </CardContent>
          </Card>

          {/* Questions Completed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Questions Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-[#1B4F72]">{mockData.questionsCompleted}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{mockData.questionsToday} questions today</p>
            </CardContent>
          </Card>

          {/* Weak Domains */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Weak Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-[#E67E22]">{mockData.weakDomains}</span>
              </div>
              <Button variant="link" className="text-xs text-[#5DADE2] p-0 mt-2">View Full Report →</Button>
            </CardContent>
          </Card>

          {/* Coaching Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Coaching Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-[#1B4F72]">
                  {mockData.coachingSessions.completed} of {mockData.coachingSessions.total}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Next: Tue</p>
            </CardContent>
          </Card>
        </div>

        {/* Domain Performance Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Domain Performance</CardTitle>
            <CardDescription>Your progress across the 5 NREMT domains</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockData.domains.map((domain, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{domain.name}</span>
                    {domain.status === 'excellent' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {domain.status === 'good' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {domain.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {domain.status === 'critical' && <XCircle className="h-4 w-4 text-red-600" />}
                  </div>
                  <span className="text-sm font-semibold">{domain.score}%</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={domain.score} 
                    className="h-3"
                  />
                  <div 
                    className="absolute top-0 h-3 w-0.5 bg-gray-400" 
                    style={{ left: `${domain.target}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.recentAssessments.map((assessment) => (
                <div key={assessment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-[#1B4F72]">{assessment.type}</h4>
                      <p className="text-sm text-gray-500">{assessment.date} · {assessment.questions} questions</p>
                    </div>
                    <Badge 
                      className={
                        assessment.score >= 80 ? 'bg-green-100 text-green-800' :
                        assessment.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {assessment.score}%
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Report
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Products */}
          <Card>
            <CardHeader>
              <CardTitle>My Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="h-8 w-8 text-[#1B4F72]" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1B4F72]">{product.title}</h4>
                      <Badge variant="outline" className="text-xs">{product.type}</Badge>
                    </div>
                  </div>
                  {product.progress > 0 ? (
                    <>
                      <Progress value={product.progress} className="mb-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{product.progress}% complete</span>
                        <Button size="sm" className="bg-[#E67E22] hover:bg-[#D35400]">
                          Continue
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button size="sm" className="w-full bg-[#E67E22] hover:bg-[#D35400]">
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Session */}
        <Card className="mt-8 bg-gradient-to-r from-[#7FA99B] to-[#5DADE2] text-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <CardTitle className="text-white">Upcoming Coaching Session</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">{mockData.coachingSessions.nextDate}</p>
            <p className="text-sm opacity-90 mb-4">Focus: Patient Treatment & Primary Assessment</p>
            <div className="flex space-x-3">
              <Button variant="secondary" size="sm">
                Join Zoom
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}