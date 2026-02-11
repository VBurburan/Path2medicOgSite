import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { ArrowRight } from 'lucide-react';

const scoreColor = (s: number) => {
  if (s >= 90) return '#28a745';
  if (s >= 80) return '#17a2b8';
  if (s >= 70) return '#ffc107';
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
  const [submittedExams, setSubmittedExams] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [studentRes, intakeRes, posttestRes, availableRes, submittedRes] = await Promise.all([
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
          supabase
            .from('exam_assignments')
            .select('id')
            .eq('student_email', user.email!)
            .eq('status', 'submitted'),
        ]);

        if (studentRes.data) setStudent(studentRes.data);
        if (intakeRes.data?.[0]) setLatestIntake(intakeRes.data[0]);
        if (posttestRes.data?.[0]) setLatestPosttest(posttestRes.data[0]);
        if (availableRes.data) setPendingExams(availableRes.data.length);
        if (submittedRes.data) setSubmittedExams(submittedRes.data.length);
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
        <div className="animate-pulse space-y-6 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  const displayName = student?.full_name || user?.user_metadata?.full_name || 'Student';
  const certLevel = student?.certification_level || 'EMT';
  const membershipTier = student?.membership_tier || 'free';

  // Latest score
  const latestSubmission = latestPosttest || latestIntake;
  const latestScore = latestSubmission?.score_percentage ?? latestSubmission?.score_percent ?? latestSubmission?.score;

  // Determine the one contextual action
  const getAction = (): { heading: string; subtext: string; cta: string | null; link: string | null } => {
    // Has an exam to take
    if (pendingExams > 0) {
      return {
        heading: 'You have an exam ready.',
        subtext: `${pendingExams} exam${pendingExams > 1 ? 's' : ''} waiting for you.`,
        cta: 'Start Exam',
        link: '/exams',
      };
    }

    // Exam submitted, awaiting review
    if (submittedExams > 0) {
      return {
        heading: 'Your exam is being reviewed.',
        subtext: "You'll receive an email when your results are ready.",
        cta: null,
        link: null,
      };
    }

    // Post-test graded — results ready
    if (latestPosttest && (latestPosttest.score_percentage != null || latestPosttest.score_percent != null)) {
      return {
        heading: 'Your post-test results are ready!',
        subtext: 'See how you improved across every domain.',
        cta: 'View Results',
        link: '/results',
      };
    }

    // Pretest graded but no post-test yet
    if (latestIntake && (latestIntake.score_percentage != null || latestIntake.score_percent != null) && !latestPosttest) {
      return {
        heading: 'Your pretest has been graded.',
        subtext: 'Review your results and prepare for your coaching session.',
        cta: 'View Results',
        link: '/results',
      };
    }

    // Nothing pending — subscriber
    if (membershipTier !== 'free') {
      return {
        heading: 'Ready to practice?',
        subtext: 'Jump into a practice session to keep sharpening your skills.',
        cta: 'Start Practice',
        link: '/practice',
      };
    }

    // Nothing pending — non-subscriber
    return {
      heading: 'Want to keep practicing?',
      subtext: 'Unlock the full question bank with a subscription.',
      cta: 'View Plans',
      link: '/practice',
    };
  };

  const action = getAction();
  const tierLabel = membershipTier === 'pro' ? 'Pro' : membershipTier === 'max' ? 'Max' : 'Free';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Welcome */}
        <h1 className="text-2xl font-bold text-[#0D2137]">
          Welcome back, {displayName.split(' ')[0]}
        </h1>

        {/* Single contextual card */}
        <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-lg font-semibold text-[#0D2137]">{action.heading}</h2>
          <p className="text-sm text-gray-500 mt-1">{action.subtext}</p>
          {action.cta && action.link && (
            <button
              onClick={() => navigate(action.link!)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: '#E03038' }}
            >
              {action.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Info line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span>
            <span className="font-medium text-[#0D2137]">{certLevel}</span>
          </span>
          <span>
            Membership: <span className="font-medium text-[#0D2137]">{tierLabel}</span>
          </span>
          {latestScore != null && (
            <span>
              Last Score:{' '}
              <span className="font-medium" style={{ color: scoreColor(Number(latestScore)) }}>
                {Math.round(Number(latestScore))}%
              </span>
            </span>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
