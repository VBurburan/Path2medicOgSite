import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { ArrowRight, ClipboardList, BookOpen, BarChart3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
  const [student, setStudent] = useState<Record<string, any> | null>(null);
  const [latestIntake, setLatestIntake] = useState<Record<string, any> | null>(null);
  const [latestPosttest, setLatestPosttest] = useState<Record<string, any> | null>(null);
  const [pendingExams, setPendingExams] = useState(0);
  const [submittedExams, setSubmittedExams] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Combine the two exam_assignments queries into one
        const [studentRes, intakeRes, posttestRes, assignRes, practiceRes] = await Promise.all([
          supabase
            .from('students')
            .select('full_name, certification_level, membership_tier')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('intake_submissions')
            .select('score_percentage, score_percent, score, submitted_at, total_questions, domain_breakdown')
            .eq('student_email', user.email)
            .order('submitted_at', { ascending: false })
            .limit(1),
          supabase
            .from('posttest_submissions')
            .select('score_percentage, score_percent, score, submitted_at, total_questions, domain_breakdown')
            .eq('student_email', user.email)
            .order('submitted_at', { ascending: false })
            .limit(1),
          supabase
            .from('exam_assignments')
            .select('id, status')
            .eq('student_email', user.email!)
            .in('status', ['available', 'submitted']),
          supabase
            .from('exam_sessions')
            .select('id')
            .eq('user_id', user.id),
        ]);

        if (studentRes.data) setStudent(studentRes.data);
        if (intakeRes.data?.[0]) setLatestIntake(intakeRes.data[0]);
        if (posttestRes.data?.[0]) setLatestPosttest(posttestRes.data[0]);

        // Derive pending/submitted from single query
        if (assignRes.data) {
          setPendingExams(assignRes.data.filter(a => a.status === 'available').length);
          setSubmittedExams(assignRes.data.filter(a => a.status === 'submitted').length);
        }

        if (practiceRes.data) setPracticeCount(practiceRes.data.length);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const displayName = student?.full_name || user?.user_metadata?.full_name || 'Student';
  const certLevel = student?.certification_level || 'EMT';
  const membershipTier = student?.membership_tier || 'free';
  const isSubscribed = membershipTier === 'pro' || membershipTier === 'max';

  const latestSubmission = latestPosttest || latestIntake;
  const latestScore = latestSubmission?.score_percentage ?? latestSubmission?.score_percent ?? latestSubmission?.score;

  const action = useMemo(() => {
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
  }, [pendingExams, submittedExams, latestPosttest, latestIntake, isSubscribed]);

  const quickLinks = useMemo(() => [
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
  ], [pendingExams, isSubscribed, practiceCount, latestScore]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-3xl">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200/60 rounded-lg w-64 animate-pulse" />
            <div className="h-4 bg-gray-100/80 rounded w-40 animate-pulse" />
          </div>
          <div className="h-44 bg-gray-200/50 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-28 bg-gray-200/50 rounded-2xl animate-pulse" />
            <div className="h-28 bg-gray-200/50 rounded-2xl animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="h-28 bg-gray-200/50 rounded-2xl animate-pulse" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Welcome */}
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137] tracking-tight">
            Welcome back, {displayName.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            {certLevel} <span className="text-gray-300 mx-1">/</span> {membershipTier === 'free' ? 'Free Plan' : membershipTier === 'pro' ? 'Pro Plan' : 'Max Plan'}
          </p>
        </div>

        {/* Action card */}
        <div
          className="relative bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden group"
          style={{ animation: 'fadeInUp 0.6s ease-out backwards', animationDelay: '0.1s' }}
          role="region"
          aria-label="Next action"
        >
          <div className="h-1 bg-gradient-to-r from-[#0D2137] via-[#E03038] to-[#d4a843]" />
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#E03038]/8 items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-5 w-5 text-[#E03038]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-[#0D2137] tracking-tight">{action.heading}</h2>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{action.subtext}</p>
                {action.cta && action.link && (
                  <button
                    onClick={() => navigate(action.link!)}
                    aria-label={action.cta}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[#E03038]/20 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#E03038] focus:ring-offset-2"
                    style={{ backgroundColor: '#E03038' }}
                  >
                    {action.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="navigation" aria-label="Quick links">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                aria-label={`${item.label} — ${item.stat}`}
                className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-5 text-left transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:border-gray-300/60 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:ring-offset-2"
                style={{
                  animation: 'fadeInUp 0.5s ease-out backwards',
                  animationDelay: `${0.2 + idx * 0.08}s`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${item.color}03 0%, transparent 60%)` }}
                />
                <div className="relative flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `${item.color}08` }}
                  >
                    <Icon className="h-[18px] w-[18px] transition-all duration-300" style={{ color: item.color }} aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-[#0D2137] tracking-tight">{item.label}</span>
                </div>
                <p className="relative text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-300 font-medium">
                  {item.stat}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
