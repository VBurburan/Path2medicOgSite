import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowUp, ArrowRight } from 'lucide-react';

const scoreColor = (s: number) => {
  if (s >= 90) return '#28a745';
  if (s >= 80) return '#17a2b8';
  if (s >= 70) return '#d4a843';
  return '#dc3545';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [latestIntake, setLatestIntake] = useState<any>(null);
  const [latestPosttest, setLatestPosttest] = useState<any>(null);
  const [pendingExams, setPendingExams] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [studentRes, intakeRes, posttestRes, assignmentsRes] = await Promise.all([
          supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('intake_submissions')
            .select('*')
            .eq('student_email', user.email)
            .order('submitted_at', { ascending: false })
            .limit(1),
          supabase
            .from('posttest_submissions')
            .select('*')
            .eq('student_email', user.email)
            .order('submitted_at', { ascending: false })
            .limit(1),
          supabase
            .from('exam_assignments')
            .select('id')
            .eq('student_email', user.email!)
            .eq('status', 'available'),
        ]);

        if (studentRes.data) setStudent(studentRes.data);
        if (intakeRes.data?.[0]) setLatestIntake(intakeRes.data[0]);
        if (posttestRes.data?.[0]) setLatestPosttest(posttestRes.data[0]);
        if (assignmentsRes.data) setPendingExams(assignmentsRes.data.length);
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayName = student?.full_name || user?.user_metadata?.full_name || 'Student';
  const certLevel = student?.certification_level || 'EMT';
  const membershipTier = student?.membership_tier || 'free';

  // Latest score logic — prefer posttest, fallback to intake
  const latestSubmission = latestPosttest || latestIntake;
  const latestScore = latestSubmission?.score_percentage ?? latestSubmission?.score_percent ?? latestSubmission?.score;
  const latestType = latestPosttest ? 'Post-Test' : 'Intake Exam';
  const latestDate = latestSubmission?.submitted_at;

  // Improvement delta
  const intakeScore = latestIntake?.score_percentage ?? latestIntake?.score_percent ?? latestIntake?.score;
  const posttestScore = latestPosttest?.score_percentage ?? latestPosttest?.score_percent ?? latestPosttest?.score;
  const hasBoth = intakeScore != null && posttestScore != null;
  const delta = hasBoth ? Number(posttestScore) - Number(intakeScore) : null;

  // Quick stats
  const totalQuestions = student?.total_questions_answered || 0;
  const overallAccuracy = student?.total_correct && student?.total_questions_answered
    ? Math.round((student.total_correct / student.total_questions_answered) * 100)
    : null;

  // Weakest domain from latest submission
  const domainBreakdown = latestSubmission?.domain_breakdown;
  let weakestDomain: { name: string; score: number } | null = null;
  if (domainBreakdown && typeof domainBreakdown === 'object') {
    let minScore = 101;
    for (const [name, value] of Object.entries(domainBreakdown)) {
      const v = value as any;
      const score = v.pct ?? v.percentage ?? (v.correct / v.total) * 100;
      if (score < minScore) {
        minScore = score;
        weakestDomain = { name, score: Math.round(score) };
      }
    }
  }

  // Coaching status
  const getCoachingStatus = () => {
    if (!latestIntake && pendingExams > 0) return 'Pretest Pending';
    if (!latestIntake && pendingExams === 0) return null; // not a coaching student
    if (latestIntake && !latestIntake.graded_at && !latestIntake.score_percentage) return 'Pretest Submitted';
    if (latestIntake && !latestPosttest && pendingExams > 0) return 'Post-Test Available';
    if (latestPosttest) return 'Completed';
    return 'Session Scheduled';
  };
  const coachingStatus = getCoachingStatus();

  // Action needed logic
  const getAction = () => {
    if (pendingExams > 0) {
      return { text: 'You have an exam ready to take', link: '/exams' };
    }
    if (latestIntake && !latestPosttest) {
      if (latestIntake.score_percentage || latestIntake.score_percent) {
        return { text: 'Your pretest has been graded. Check your results.', link: '/results' };
      }
      return { text: 'Your pretest is being reviewed. You\'ll receive an email when results are ready.', link: null };
    }
    if (membershipTier !== 'free') {
      return { text: 'Start a practice session', link: '/practice' };
    }
    return { text: 'Book a coaching session to get started', link: '/tutoring' };
  };
  const action = getAction();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-[#0D2137]">Welcome back, {displayName.split(' ')[0]}</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your overview.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Your Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Your Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-[#0D2137]">{displayName}</p>
              <p className="text-sm text-gray-500">{certLevel}</p>
              {coachingStatus && (
                <p className="text-xs mt-3 text-[#1a5f7a] font-medium">
                  Coaching: {coachingStatus}
                </p>
              )}
              {membershipTier !== 'free' && (
                <p className="text-xs mt-1 text-gray-500">
                  Membership: {membershipTier === 'pro' ? 'Pro' : membershipTier === 'max' ? 'Max' : membershipTier} — Active
                </p>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Latest Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Latest Score</CardTitle>
            </CardHeader>
            <CardContent>
              {latestScore != null ? (
                <>
                  <div
                    className="text-4xl font-bold"
                    style={{ color: scoreColor(Number(latestScore)) }}
                  >
                    {Math.round(Number(latestScore))}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {certLevel} {latestType}
                  </p>
                  {delta !== null && (
                    <p className="text-sm mt-2 font-medium" style={{ color: delta >= 0 ? '#28a745' : '#dc3545' }}>
                      <ArrowUp className={`inline h-4 w-4 mr-0.5 ${delta < 0 ? 'rotate-180' : ''}`} />
                      {delta > 0 ? '+' : ''}{Math.round(delta)} points since intake
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-400 text-sm">No assessments yet</p>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Action Needed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Action Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{action.text}</p>
              {action.link && (
                <button
                  onClick={() => navigate(action.link!)}
                  className="mt-3 text-sm font-medium text-[#1a5f7a] hover:underline flex items-center gap-1"
                >
                  Go <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Quick Stats */}
          {totalQuestions > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Questions Answered</span>
                  <span className="font-semibold text-[#0D2137]">{totalQuestions.toLocaleString()}</span>
                </div>
                {overallAccuracy !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Overall Accuracy</span>
                    <span className="font-semibold text-[#0D2137]">{overallAccuracy}%</span>
                  </div>
                )}
                {weakestDomain && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Weakest Domain</span>
                    <span className="font-semibold text-[#dc3545]">{weakestDomain.name} ({weakestDomain.score}%)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Complete exams to see your stats here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
