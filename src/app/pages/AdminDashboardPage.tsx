import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Users, Calendar, DollarSign, FileText, CheckCircle, TrendingUp, Eye, Send, Edit } from 'lucide-react';
import logo from 'figma:asset/7e2353c04204bd5b39085f4855f3eadf3139a233.png';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    } else if (session.user?.user_metadata?.role !== 'admin') {
      // Not an admin, redirect to regular dashboard
      navigate('/dashboard');
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
  const stats = {
    activeClients: 24,
    newThisWeek: 3,
    upcomingSessions: 5,
    revenue: 2100,
    revenueTrend: 15,
    pendingReviews: 3,
    passRate: 87,
  };

  const todaySchedule = [
    { 
      id: 1, 
      time: '10:00 AM', 
      client: 'Tamala R.', 
      level: 'Paramedic', 
      type: 'Follow-up',
      weakDomains: ['Primary Assessment', 'Patient Treatment'],
      zoomLink: 'https://zoom.us/j/123456789'
    },
    { 
      id: 2, 
      time: '2:00 PM', 
      client: 'Marcus J.', 
      level: 'EMT', 
      type: 'Intake',
      weakDomains: [],
      zoomLink: 'https://zoom.us/j/987654321'
    },
  ];

  const clients = [
    { id: 1, name: 'Tamala R.', email: 'tamala@example.com', level: 'Paramedic', status: 'Active', lastScore: 72, lastAssessment: 'Jan 8', sessions: 2 },
    { id: 2, name: 'Marcus J.', email: 'marcus@example.com', level: 'EMT', status: 'Active', lastScore: 65, lastAssessment: 'Jan 10', sessions: 1 },
    { id: 3, name: 'Sarah K.', email: 'sarah@example.com', level: 'AEMT', status: 'Passed', lastScore: 84, lastAssessment: 'Dec 15', sessions: 4 },
    { id: 4, name: 'David L.', email: 'david@example.com', level: 'EMT', status: 'Active', lastScore: 70, lastAssessment: 'Jan 5', sessions: 3 },
  ];

  const pendingAssessments = [
    { id: 1, client: 'Tamala R.', type: 'Intake Exam', date: 'Jan 8', score: 72, status: 'new', userId: 'user-123' },
    { id: 2, client: 'Marcus J.', type: 'Practice #3', date: 'Jan 10', score: 68, status: 'in-progress', userId: 'user-456' },
    { id: 3, client: 'Sarah K.', type: 'Final Test', date: 'Dec 15', score: 84, status: 'ready', userId: 'user-789' },
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Path2Medic" className="h-10 w-auto" />
              <Badge className="bg-[#E67E22] text-white">ADMIN</Badge>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/admin" className="text-[#1B4F72] font-semibold border-b-2 border-[#E67E22] py-4">Overview</a>
              <a href="#clients" className="text-gray-600 hover:text-[#1B4F72] py-4">Clients</a>
              <a href="#sessions" className="text-gray-600 hover:text-[#1B4F72] py-4">Sessions</a>
              <a href="#analytics" className="text-gray-600 hover:text-[#1B4F72] py-4">Analytics</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">New Client</Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1B4F72]">{stats.activeClients}</div>
              <p className="text-xs text-green-600 mt-1">+{stats.newThisWeek} new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Sessions This Week</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1B4F72]">{stats.upcomingSessions}</div>
              <p className="text-xs text-gray-500 mt-1">Upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue (MTD)</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1B4F72]">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.revenueTrend}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E67E22]">{stats.pendingReviews}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7FA99B]">{stats.passRate}%</div>
              <p className="text-xs text-gray-500 mt-1">Student success</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.map((session) => (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-[#1B4F72]">{session.time}</span>
                      <span className="text-gray-600">{session.client}</span>
                      <Badge variant="outline">{session.level}</Badge>
                      <Badge className="bg-[#7FA99B] text-white">{session.type}</Badge>
                    </div>
                    {session.weakDomains.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Weak areas: {session.weakDomains.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-[#5DADE2] hover:bg-[#3498DB]">
                      Join Zoom
                    </Button>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Management Table */}
        <Card className="mb-8" id="clients">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Client List</CardTitle>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline">Filter</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Last Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Last Assessment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Sessions</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-[#1B4F72]">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{client.level}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            client.status === 'Passed' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }
                        >
                          {client.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold">{client.lastScore}%</td>
                      <td className="py-3 px-4 text-gray-600">{client.lastAssessment}</td>
                      <td className="py-3 px-4 text-gray-600">{client.sessions}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Review Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Assessment Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingAssessments.map((assessment) => (
                <div 
                  key={assessment.id} 
                  className={`border rounded-lg p-4 ${
                    assessment.status === 'new' ? 'border-red-300 bg-red-50' :
                    assessment.status === 'in-progress' ? 'border-yellow-300 bg-yellow-50' :
                    'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1B4F72]">{assessment.client}</h4>
                      <p className="text-sm text-gray-600">{assessment.type}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${
                      assessment.status === 'new' ? 'bg-red-500' :
                      assessment.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{assessment.date} · {assessment.score}%</p>
                  <Button 
                    size="sm" 
                    className={`w-full ${
                      assessment.status === 'ready' 
                        ? 'bg-[#7FA99B] hover:bg-[#6B9989]' 
                        : 'bg-[#1B4F72] hover:bg-[#163D5A]'
                    }`}
                  >
                    {assessment.status === 'new' && 'Review Now'}
                    {assessment.status === 'in-progress' && 'Continue'}
                    {assessment.status === 'ready' && (
                      <span className="flex items-center">
                        <Send className="h-4 w-4 mr-1" />
                        Send Report
                      </span>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}