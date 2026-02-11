import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { ArrowRight, ClipboardList, BookOpen, BarChart3 } from 'lucide-react';

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
  const [practiceCount, setPracticeCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [studentRes, intakeRes, posttestRes, availableRes, submittedRes, practiceRes] = await Promise.all([
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
          supabase
            .from('exam_sessions')
            .select('id')
            .eq('user_id', user.id),
        ]);

        if (studentRes.data) setStudent(studentRes.data);
        if (intakeRes.data?.[0]) setLatestIntake(intakeRes.data[0]);
        if (posttestRes.data?.[0]) setLatestPosttest(posttestRes.data[0]);
        if (availableRes.data) setPendingExams(availableRes.data.length);
        if (submittedRes.data) setSubmittedExams(submittedRes.data.length);
        if (practiceRes.data) setPracticeCount(practiceRes.data.length);
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
        <div className="animate-pulse space-y-6 max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayName = student?.full_name || user?.user_metadata?.full_name || 'Student';
  const certLevel = student?.certification_level || 'EMT';
  const membershipTier = student?.membership_tier || 'free';
  const isSubscribed = membershipTier === 'pro' || membershipTier === 'max';

  const latestSubmission = latestPosttest || latestIntake;
  const latestScore = latestSubmission?.score_percentage ?? latestSubmission?.score_percent ?? latestSubmission?.score;

  const getAction = (): { heading: string; subtext: string; cta: string | null; link: string | null } => {
    if (pendingExams > 0) {
      return {
        heading: 'You have an exam ready.',
        subtext: `${pendingExams} exam${pendingExams > 1 ? 's' : ''} waiting for you.`,
        cta: 'Start Exam',
        link: '/exams',
      };
    }
    if (submittedExams > 0) {
      return {
        heading: 'Your exam is being reviewed.',
        subtext: "You'll receive an email when your results are ready.",
        cta: null,
        link: null,
      };
    }
    if (latestPosttest && (latestPosttest.score_percentage != null || latestPosttest.score_percent != null)) {
      return {
        heading: 'Your post-test results are ready!',
        subtext: 'See how you improved across every domain.',
        cta: 'View Results',
        link: '/results',
      };
    }
    if (latestIntake && (latestIntake.score_percentage != null || latestIntake.score_percent != null) && !latestPosttest) {
      return {
        heading: 'Your pretest has been graded.',
        subtext: 'Review your results and prepare for your coaching session.',
        cta: 'View Results',
        link: '/results',
      };
    }
    if (isSubscribed) {
      return {
        heading: 'Ready to practice?',
        subtext: 'Jump into a practice session to keep sharpening your skills.',
        cta: 'Start Practice',
        link: '/practice',
      };
    }
    return {
      heading: 'Want to keep practicing?',
      subtext: 'Unlock the full question bank with a subscription.',
      cta: 'View Plans',
      link: '/practice',
    };
  };

  const action = getAction();

  const quickLinks = [
    {
      label: 'Exams',
      icon: ClipboardList,
      path: '/exams',
      stat: pendingExams > 0 ? `${pendingExams} pending` : 'View exams',
      color: '#0D2137',
    },
    {
      label: 'Practice',
      icon: BookOpen,
      path: '/practice',
      stat: isSubscribed ? `${practiceCount} sessions` : 'Subscribe',
      color: '#E03038',
    },
    {
      label: 'Results',
      icon: BarChart3,
      path: '/results',
      stat: latestScore != null ? `${Math.round(Number(latestScore))}% latest` : 'View results',
      color: latestScore != null ? scoreColor(Number(latestScore)) : '#6b7280',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-[#0D2137]">
            Welcome back, {displayName.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{certLevel} &middot; {membershipTier === 'free' ? 'Free Plan' : membershipTier === 'pro' ? 'Pro Plan' : 'Max Plan'}</p>
        </div>

        {/* Action card */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#0D2137]">{action.heading}</h2>
            <p className="text-sm text-gray-500 mt-1">{action.subtext}</p>
            {action.cta && action.link && (
              <button
                onClick={() => navigate(action.link!)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg"
                style={{ backgroundColor: '#E03038' }}
              >
                {action.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-4 text-left hover:shadow-md hover:border-gray-300/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}10` }}>
                    <Icon className="h-[18px] w-[18px]" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-[#0D2137]">{item.label}</span>
                </div>
                <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">{item.stat}</p>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
