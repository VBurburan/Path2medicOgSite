import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Skeleton } from '../components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  BookOpen,
  BarChart3,
  Calendar,
  ChevronRight,
  Lightbulb,
  Play,
  ClipboardList,
  Users,
  Rocket,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

/* ── brand palette ── */
const NAVY = '#0D2137';
const RED = '#E03038';
const TEAL = '#1a5f7a';
const GOLD = '#d4a843';
const BG = '#f5f5f5';

interface DomainScore {
  domain: string;
  score: number;
}

function domainBarColor(score: number): string {
  if (score >= 90) return '#28a745';
  if (score >= 80) return '#17a2b8';
  if (score >= 70) return '#ffc107';
  return '#dc3545';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── loading skeleton ── */
function DashboardSkeleton() {
  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-28 w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-xl mb-8" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </section>
    </Layout>
  );
}

/* ── empty / new-user state ── */
function EmptyDashboard({ name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Rocket className="mx-auto h-16 w-16 mb-4" style={{ color: TEAL }} />
          <h1 className="text-3xl font-bold mb-2" style={{ color: NAVY }}>
            Welcome, {name}!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            You haven&apos;t started any practice sessions yet. Take your first
            exam to unlock your personalised dashboard.
          </p>
          <button
            onClick={() => navigate('/practice')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg transition hover:opacity-90"
            style={{ backgroundColor: RED }}
          >
            <Play className="h-5 w-5" /> Get Started
          </button>
        </div>
      </section>
    </Layout>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [intakes, setIntakes] = useState<any[]>([]);
  const [posttests, setPosttests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);

  /* ── fetch all data ── */
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [studentRes, intakeRes, posttestRes, sessionRes, streakRes] =
          await Promise.all([
            supabase
              .from('students')
              .select('*')
              .eq('user_id', user.id)
              .single(),
            supabase
              .from('intake_submissions')
              .select('*')
              .eq('student_email', user.email)
              .order('submitted_at', { ascending: false }),
            supabase
              .from('posttest_submissions')
              .select('*')
              .eq('student_email', user.email)
              .order('submitted_at', { ascending: false }),
            supabase
              .from('exam_sessions')
              .select('*')
              .eq('student_id', user.id)
              .order('completed_at', { ascending: false }),
            supabase
              .from('study_streaks')
              .select('*')
              .eq('student_id', user.id)
              .order('date', { ascending: false })
              .limit(1),
          ]);

        if (studentRes.data) setStudent(studentRes.data);
        if (intakeRes.data) setIntakes(intakeRes.data);
        if (posttestRes.data) setPosttests(posttestRes.data);
        if (sessionRes.data) setSessions(sessionRes.data);
        if (streakRes.data && streakRes.data.length > 0)
          setStreak(streakRes.data[0]);
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ── derived data ── */
  const allSubmissions = [
    ...intakes.map((i) => ({
      ...i,
      type: 'Intake',
      date: i.submitted_at,
      score: i.score_percent ?? i.score,
    })),
    ...posttests.map((p) => ({
      ...p,
      type: 'Post-Test',
      date: p.submitted_at,
      score: p.score_percent ?? p.score,
    })),
    ...sessions.map((s) => ({
      ...s,
      type: 'Practice',
      date: s.completed_at,
      score: s.score_percent ?? s.score,
    })),
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const latestScore =
    allSubmissions.length > 0 ? Number(allSubmissions[0].score) : null;
  const firstScore =
    allSubmissions.length > 1
      ? Number(allSubmissions[allSubmissions.length - 1].score)
      : latestScore;
  const improvement =
    latestScore !== null && firstScore !== null
      ? Math.round(latestScore - firstScore)
      : 0;

  const questionsAnswered = student?.total_questions_answered ?? 0;
  const currentStreak = streak?.current_streak ?? streak?.streak_count ?? 0;

  /* domain performance from latest submission */
  const latestWithDomains = allSubmissions.find(
    (s) => s.domain_scores || s.domain_breakdown,
  );
  let domainData: DomainScore[] = [];
  if (latestWithDomains) {
    const raw =
      latestWithDomains.domain_scores ?? latestWithDomains.domain_breakdown;
    if (Array.isArray(raw)) {
      domainData = raw
        .map((d: any) => ({
          domain: d.domain ?? d.name ?? 'Unknown',
          score: Number(d.score ?? d.percent ?? 0),
        }))
        .sort((a: DomainScore, b: DomainScore) => a.score - b.score);
    } else if (typeof raw === 'object' && raw !== null) {
      domainData = Object.entries(raw)
        .map(([domain, score]) => ({
          domain,
          score: Number(score),
        }))
        .sort((a, b) => a.score - b.score);
    }
  }

  /* score trend data */
  const trendData = [...allSubmissions]
    .reverse()
    .map((s) => ({
      label: new Date(s.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: Number(s.score),
    }));

  /* smart recommendations */
  const weakDomains = domainData.filter((d) => d.score < 70);
  const recommendations: string[] = [];
  if (weakDomains.length > 0) {
    recommendations.push(
      `Focus on "${weakDomains[0].domain}" -- your lowest domain at ${weakDomains[0].score}%.`,
    );
  }
  if (weakDomains.length > 1) {
    recommendations.push(
      `Schedule a targeted practice session on "${weakDomains[1].domain}" (${weakDomains[1].score}%).`,
    );
  }
  if (allSubmissions.length < 3) {
    recommendations.push(
      'Complete more practice exams to build a reliable trend line.',
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Great work! Keep practising consistently to maintain your scores.',
    );
    recommendations.push(
      'Consider booking a coaching session for advanced test-taking strategies.',
    );
  }
  if (recommendations.length < 3) {
    recommendations.push(
      'Review rationales for every question you miss to reinforce learning.',
    );
  }

  /* recent activity (last 5) */
  const recentActivity = allSubmissions.slice(0, 5);

  /* ── guards ── */
  if (loading) return <DashboardSkeleton />;

  const displayName =
    student?.full_name || user?.user_metadata?.full_name || user?.email || 'Student';

  if (allSubmissions.length === 0) {
    return <EmptyDashboard name={displayName.split(' ')[0]} />;
  }

  const certLevel =
    student?.certification_level || user?.user_metadata?.certification_level;

  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ───── Welcome Header ───── */}
          <div
            className="rounded-xl p-6 md:p-8 mb-8 text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Welcome back, {displayName}
                </h1>
                {certLevel && (
                  <span
                    className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: GOLD, color: NAVY }}
                  >
                    {certLevel}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate('/practice')}
                className="self-start md:self-center inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow transition hover:opacity-90"
                style={{ backgroundColor: RED }}
              >
                <Play className="h-4 w-4" /> Start Practice
              </button>
            </div>
          </div>

          {/* ───── Score Overview Cards ───── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Latest Score */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Latest Score
                </span>
                <Target className="h-5 w-5" style={{ color: TEAL }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: NAVY }}>
                {latestScore !== null ? `${Math.round(latestScore)}%` : '—'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {allSubmissions[0]?.type} &mdash;{' '}
                {formatDate(allSubmissions[0]?.date)}
              </p>
            </div>

            {/* Improvement */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Improvement
                </span>
                {improvement >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p
                className="text-3xl font-bold"
                style={{
                  color: improvement >= 0 ? '#28a745' : '#dc3545',
                }}
              >
                {improvement > 0 ? '+' : ''}
                {improvement}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Since first assessment
              </p>
            </div>

            {/* Questions Practiced */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Questions Practiced
                </span>
                <BookOpen className="h-5 w-5" style={{ color: TEAL }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: NAVY }}>
                {questionsAnswered.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">Total answered</p>
            </div>

            {/* Study Streak */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Study Streak
                </span>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold" style={{ color: GOLD }}>
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Keep it going!
              </p>
            </div>
          </div>

          {/* ───── Charts Row ───── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Domain Performance */}
            {domainData.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5" style={{ color: NAVY }} />
                  <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                    Domain Performance
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Sorted weakest-first (80/20 focus)
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={domainData}
                    layout="vertical"
                    margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                  >
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="domain"
                      type="category"
                      width={160}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Score']}
                    />
                    <Bar
                      dataKey="score"
                      radius={[0, 6, 6, 0]}
                      barSize={22}
                      isAnimationActive
                    >
                      {domainData.map((entry, idx) => (
                        <rect
                          key={`cell-${idx}`}
                          fill={domainBarColor(entry.score)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* color legend */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: '#28a745' }} /> 90%+
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: '#17a2b8' }} /> 80-89%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: '#ffc107' }} /> 70-79%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: '#dc3545' }} /> &lt;70%
                  </span>
                </div>
              </div>
            )}

            {/* Score Trend */}
            {trendData.length > 1 && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5" style={{ color: NAVY }} />
                  <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                    Score Trend
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Score']}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={TEAL}
                      strokeWidth={2.5}
                      dot={{ fill: TEAL, r: 4 }}
                      activeDot={{ r: 6, fill: RED }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* If only one chart, fill remaining space with recommendations */}
            {domainData.length === 0 && trendData.length <= 1 && (
              <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 flex items-center justify-center text-gray-400">
                <p>Complete more sessions to unlock charts.</p>
              </div>
            )}
          </div>

          {/* ───── Smart Recommendations ───── */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5" style={{ color: GOLD }} />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                Smart Recommendations
              </h2>
            </div>
            <ul className="space-y-3">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: TEAL }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ───── Quick Actions ───── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => navigate('/practice')}
              className="group bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${TEAL}15` }}
              >
                <Play className="h-5 w-5" style={{ color: TEAL }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: NAVY }}>
                Start Practice
              </h3>
              <p className="text-sm text-gray-500">
                Jump into a new question set
              </p>
              <ChevronRight className="h-4 w-4 mt-2 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/results')}
              className="group bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${GOLD}20` }}
              >
                <ClipboardList className="h-5 w-5" style={{ color: GOLD }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: NAVY }}>
                View Results
              </h3>
              <p className="text-sm text-gray-500">
                Review past exam performance
              </p>
              <ChevronRight className="h-4 w-4 mt-2 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://path2medic.thinkific.com/enroll/3570436?price_id=4503585"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition block"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${RED}15` }}
              >
                <Users className="h-5 w-5" style={{ color: RED }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: NAVY }}>
                Book Coaching
              </h3>
              <p className="text-sm text-gray-500">
                1-on-1 session with an instructor
              </p>
              <ChevronRight className="h-4 w-4 mt-2 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* ───── Recent Activity ───── */}
          {recentActivity.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" style={{ color: NAVY }} />
                <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y">
                {recentActivity.map((item, idx) => {
                  const pct = Number(item.score);
                  const scoreColor =
                    pct >= 80
                      ? '#28a745'
                      : pct >= 70
                        ? '#ffc107'
                        : '#dc3545';
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium" style={{ color: NAVY }}>
                          {item.type}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: `${scoreColor}18`,
                          color: scoreColor,
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              {allSubmissions.length > 5 && (
                <Link
                  to="/results"
                  className="block text-center mt-4 text-sm font-medium hover:underline"
                  style={{ color: TEAL }}
                >
                  View all results &rarr;
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
