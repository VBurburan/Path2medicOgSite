import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Skeleton } from '../components/ui/skeleton';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Filter,
  ClipboardList,
  ExternalLink,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

/* ── brand palette ── */
const NAVY = '#0D2137';
const RED = '#E03038';
const TEAL = '#1a5f7a';
const GOLD = '#d4a843';
const BG = '#f5f5f5';

type FilterType = 'All' | 'Practice' | 'Intake' | 'Post-Test';

interface UnifiedResult {
  id: string;
  type: FilterType;
  date: string;
  score: number;
  questionCount: number;
  duration: number | null; // minutes
  domainScores: { domain: string; score: number }[] | null;
  teiBreakdown: { type: string; correct: number; total: number }[] | null;
  raw: any;
}

function scoreColor(pct: number): string {
  if (pct >= 80) return '#28a745';
  if (pct >= 70) return '#ffc107';
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

function formatDuration(mins: number | null): string {
  if (mins === null || mins === undefined) return '—';
  if (mins < 1) return '<1 min';
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function parseDomainScores(raw: any): { domain: string; score: number }[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw.map((d: any) => ({
      domain: d.domain ?? d.name ?? 'Unknown',
      score: Number(d.score ?? d.percent ?? 0),
    }));
  }
  if (typeof raw === 'object') {
    return Object.entries(raw).map(([domain, score]) => ({
      domain,
      score: Number(score),
    }));
  }
  return null;
}

function parseTeiBreakdown(raw: any): { type: string; correct: number; total: number }[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw.map((t: any) => ({
      type: t.type ?? t.name ?? 'Unknown',
      correct: Number(t.correct ?? 0),
      total: Number(t.total ?? 0),
    }));
  }
  if (typeof raw === 'object') {
    return Object.entries(raw).map(([type, val]: [string, any]) => ({
      type,
      correct: Number(val?.correct ?? val ?? 0),
      total: Number(val?.total ?? 1),
    }));
  }
  return null;
}

/* ── loading skeleton ── */
function ResultsSkeleton() {
  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-56 mb-6 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ── empty state ── */
function EmptyResults() {
  const navigate = useNavigate();
  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <ClipboardList className="mx-auto h-16 w-16 mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>
            No Results Yet
          </h2>
          <p className="text-gray-500 mb-6">
            Complete your first practice exam to see your results here.
          </p>
          <button
            onClick={() => navigate('/practice')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition hover:opacity-90"
            style={{ backgroundColor: RED }}
          >
            Start Practice
          </button>
        </div>
      </section>
    </Layout>
  );
}

/* ── expandable row ── */
function ResultRow({ result }: { result: UnifiedResult }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const pct = Math.round(result.score);
  const color = scoreColor(pct);

  const typeBadgeColors: Record<string, { bg: string; text: string }> = {
    Practice: { bg: `${TEAL}18`, text: TEAL },
    Intake: { bg: `${GOLD}25`, text: '#9a7a20' },
    'Post-Test': { bg: `${RED}15`, text: RED },
  };
  const badge = typeBadgeColors[result.type] ?? typeBadgeColors.Practice;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {result.type}
          </span>
          <div className="min-w-0">
            <p className="font-medium truncate" style={{ color: NAVY }}>
              {formatDate(result.date)}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span>{result.questionCount} questions</span>
              {result.duration !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(result.duration)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-lg font-bold"
            style={{ color }}
          >
            {pct}%
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* expanded detail */}
      {expanded && (
        <div className="border-t px-5 py-5 space-y-6">
          {/* Domain Breakdown */}
          {result.domainScores && result.domainScores.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: NAVY }}>
                Domain Breakdown
              </h4>
              <div className="space-y-2.5">
                {result.domainScores.map((d, idx) => {
                  const dColor = scoreColor(d.score);
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">{d.domain}</span>
                        <span className="font-semibold" style={{ color: dColor }}>
                          {Math.round(d.score)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(d.score, 100)}%`,
                            backgroundColor: dColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TEI Breakdown */}
          {result.teiBreakdown && result.teiBreakdown.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: NAVY }}>
                TEI Type Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.teiBreakdown.map((t, idx) => {
                  const tPct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border p-3 text-center"
                    >
                      <p className="text-xs text-gray-500 mb-1">{t.type}</p>
                      <p className="text-lg font-bold" style={{ color: scoreColor(tPct) }}>
                        {tPct}%
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.correct}/{t.total}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review questions link */}
          {result.type === 'Practice' && (
            <button
              onClick={() =>
                navigate('/practice/results', {
                  state: { sessionId: result.id, sessionData: result.raw },
                })
              }
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: TEAL }}
            >
              <ExternalLink className="h-4 w-4" />
              Review Individual Questions
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN RESULTS PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function ResultsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<UnifiedResult[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      try {
        const [sessionRes, intakeRes, posttestRes] = await Promise.all([
          supabase
            .from('exam_sessions')
            .select('*')
            .eq('student_id', user.id)
            .order('completed_at', { ascending: false }),
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
        ]);

        const unified: UnifiedResult[] = [];

        // Map exam sessions
        if (sessionRes.data) {
          sessionRes.data.forEach((s: any) => {
            unified.push({
              id: s.id,
              type: 'Practice',
              date: s.completed_at,
              score: Number(s.score_percent ?? s.score ?? 0),
              questionCount: Number(s.total_questions ?? s.question_count ?? 0),
              duration: s.duration_minutes ?? s.duration ?? null,
              domainScores: parseDomainScores(s.domain_scores ?? s.domain_breakdown),
              teiBreakdown: parseTeiBreakdown(s.tei_breakdown ?? s.tei_scores),
              raw: s,
            });
          });
        }

        // Map intake submissions
        if (intakeRes.data) {
          intakeRes.data.forEach((i: any) => {
            unified.push({
              id: i.id,
              type: 'Intake',
              date: i.submitted_at,
              score: Number(i.score_percent ?? i.score ?? 0),
              questionCount: Number(i.total_questions ?? i.question_count ?? 0),
              duration: i.duration_minutes ?? i.duration ?? null,
              domainScores: parseDomainScores(i.domain_scores ?? i.domain_breakdown),
              teiBreakdown: parseTeiBreakdown(i.tei_breakdown ?? i.tei_scores),
              raw: i,
            });
          });
        }

        // Map posttest submissions
        if (posttestRes.data) {
          posttestRes.data.forEach((p: any) => {
            unified.push({
              id: p.id,
              type: 'Post-Test',
              date: p.submitted_at,
              score: Number(p.score_percent ?? p.score ?? 0),
              questionCount: Number(p.total_questions ?? p.question_count ?? 0),
              duration: p.duration_minutes ?? p.duration ?? null,
              domainScores: parseDomainScores(p.domain_scores ?? p.domain_breakdown),
              teiBreakdown: parseTeiBreakdown(p.tei_breakdown ?? p.tei_scores),
              raw: p,
            });
          });
        }

        // Sort newest first
        unified.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setResults(unified);
      } catch (err) {
        console.error('Results fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  /* ── derived ── */
  const filtered =
    filter === 'All' ? results : results.filter((r) => r.type === filter);

  const trendData = [...results]
    .reverse()
    .map((r) => ({
      label: new Date(r.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: Math.round(r.score),
      type: r.type,
    }));

  const filterOptions: FilterType[] = ['All', 'Practice', 'Intake', 'Post-Test'];

  /* ── guards ── */
  if (loading) return <ResultsSkeleton />;
  if (results.length === 0) return <EmptyResults />;

  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>
                Results History
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {results.length} total exam{results.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Score Trend Chart */}
          {trendData.length > 1 && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: NAVY }}>
                Score Trend
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => label}
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

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400" />
            {filterOptions.map((f) => {
              const count =
                f === 'All'
                  ? results.length
                  : results.filter((r) => r.type === f).length;
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    active
                      ? 'text-white shadow'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  style={active ? { backgroundColor: NAVY } : {}}
                >
                  {f}{' '}
                  <span className={active ? 'opacity-70' : 'text-gray-400'}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                <FileText className="mx-auto h-10 w-10 mb-2" />
                <p>No {filter} results found.</p>
              </div>
            ) : (
              filtered.map((r) => <ResultRow key={r.id} result={r} />)
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
