import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { projectId } from '../../../utils/supabase/info';
import { PortalSidebar } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';
import { DashboardView } from '../components/portal/DashboardView';
import { PracticeView } from '../components/portal/PracticeView';
import { ExamView } from '../components/portal/ExamView';
import { ResultsView } from '../components/portal/ResultsView';
import { SettingsView } from '../components/portal/SettingsView';
import { Loader2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function CustomerPortalPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Data states
  const [intakeSubmission, setIntakeSubmission] = useState<any>(null);
  const [posttestSubmission, setPosttestSubmission] = useState<any>(null);
  const [practiceStats, setPracticeStats] = useState<any>(null);

  // Exam Logic
  const [viewState, setViewState] = useState<'portal' | 'exam' | 'results'>('portal');
  const [examConfig, setExamConfig] = useState<any>(null);
  const [examResults, setExamResults] = useState<any>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // 1. Basic User Info
      const currentUser = {
        ...session.user,
        profile: {
          certification_level: 'Paramedic', // Default or fetch from DB
          membership_tier: 'max', // Default to max/paid tier
          ...session.user.user_metadata
        }
      };

      // 2. Try to fetch from 'students' table
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (studentData) {
        currentUser.profile = { ...currentUser.profile, ...studentData };
      }

      setUser(currentUser);

      // 3. Fetch Intake Submissions
      const { data: intakes } = await supabase
        .from('intake_submissions')
        .select('*')
        .eq('student_email', session.user.email)
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (intakes && intakes.length > 0) {
        setIntakeSubmission(intakes[0]);
      }

      // 4. Fetch Post-test Submissions
      const { data: posttests } = await supabase
        .from('posttest_submissions')
        .select('*')
        .eq('student_email', session.user.email)
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (posttests && posttests.length > 0) {
        setPosttestSubmission(posttests[0]);
      }

    } catch (error) {
      console.error('Error loading portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const startExam = (config: any) => {
    setExamConfig(config);
    setViewState('exam');
  };

  const completeExam = (results: any) => {
    setExamResults(results);
    setViewState('results');
    // Here you would save to 'exam_sessions' DB
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a5f7a]" />
      </div>
    );
  }

  // Full Screen Exam View
  if (viewState === 'exam') {
    return (
      <ExamView 
        user={user} 
        moduleConfig={examConfig} 
        onComplete={completeExam} 
        onExit={() => setViewState('portal')} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <PortalSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        hasCoaching={!!intakeSubmission}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <PortalHeader 
          user={user} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={
            activeTab === 'dashboard' ? 'Student Dashboard' :
            activeTab === 'practice' ? 'Practice Modules' :
            activeTab === 'coaching' ? 'My Coaching' :
            activeTab === 'history' ? 'Exam History' :
            'Settings'
          }
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {viewState === 'results' ? (
            <ResultsView 
              results={examResults} 
              onRetake={() => setViewState('exam')} 
              onExit={() => setViewState('portal')} 
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView 
                  user={user}
                  intakeSubmission={intakeSubmission}
                  posttestSubmission={posttestSubmission}
                  practiceStats={practiceStats}
                  onNavigate={setActiveTab}
                />
              )}
              
              {activeTab === 'practice' && (
                <PracticeView user={user} onStartModule={startExam} />
              )}

              {activeTab === 'coaching' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#1a5f7a]">My Coaching Journey</h2>
                   {intakeSubmission ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Session</CardTitle>
                        <CardDescription>
                          {intakeSubmission.coaching_session_scheduled 
                            ? `Scheduled for ${new Date(intakeSubmission.coaching_session_date).toLocaleDateString()}`
                            : "No session scheduled yet."
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {intakeSubmission.coaching_session_scheduled && (
                          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <Calendar className="h-6 w-6 text-[#1a5f7a] mr-4" />
                              <div>
                                <p className="font-semibold text-[#1a5f7a]">1-on-1 Strategy Session</p>
                                <p className="text-sm text-gray-600">with Vincent Burburan</p>
                              </div>
                            </div>
                            <Button>Join Zoom</Button>
                          </div>
                        )}
                        {!intakeSubmission.coaching_session_scheduled && (
                          <Button>Book Your Session</Button>
                        )}
                      </CardContent>
                    </Card>
                   ) : (
                     <div className="text-center py-12 text-gray-500">
                       No coaching data found. Please contact support if you believe this is an error.
                     </div>
                   )}
                </div>
              )}
              
              {/* Placeholders for History and Settings */}
              {activeTab === 'history' && (
                <div className="text-center py-12 text-gray-500">Exam History coming soon.</div>
              )}
              
              {activeTab === 'settings' && (
                <SettingsView user={user} onLogout={handleLogout} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
