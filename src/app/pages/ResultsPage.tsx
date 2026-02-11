import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const scoreColor = (s: number) => {
  if (s >= 90) return '#28a745';
  if (s >= 80) return '#17a2b8';
  if (s >= 70) return '#ffc107';
  return '#dc3545';
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface DomainEntry {
  name: string;
  correct: number;
  total: number;
  pct: number;
}

function parseDomainBreakdown(breakdown: any): DomainEntry[] {
  if (!breakdown || typeof breakdown !== 'object') return [];

  return Object.entries(breakdown).map(([name, value]: [string, any]) => {
    const correct = value.correct ?? 0;
    const total = value.total ?? 1;
    const pct = value.pct ?? value.percentage ?? (total > 0 ? (correct / total) * 100 : 0);
    return { name, correct, total, pct: Math.round(pct * 10) / 10 };
  }).sort((a, b) => a.pct - b.pct);
}

export default function ResultsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [intakes, setIntakes] = useState<any[]>([]);
  const [posttests, setPosttests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<'comparison' | 'all'>('comparison');

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      try {
        const [intakeRes, posttestRes, sessionRes] = await Promise.all([
          supabase
            .from('intake_submissions')
            .select('*')
            .eq('student_email', user.email!)
            .order('submitted_at', { ascending: false }),
          supabase
            .from('posttest_submissions')
            .select('*')
            .eq('student_email', user.email!)
            .order('submitted_at', { ascending: false }),
          supabase
            .from('exam_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false }),
        ]);

        if (intakeRes.data) setIntakes(intakeRes.data);
        if (posttestRes.data) setPosttests(posttestRes.data);
        if (sessionRes.data) setSessions(sessionRes.data);
      } catch (err) {
        console.error('Results fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const latestIntake = intakes[0];
  const latestPosttest = posttests[0];
  const intakeScore = latestIntake?.score_percentage ?? latestIntake?.score_percent ?? latestIntake?.score;
  const posttestScore = latestPosttest?.score_percentage ?? latestPosttest?.score_percent ?? latestPosttest?.score;
  const hasBoth = intakeScore != null && posttestScore != null;
  const delta = hasBoth ? Number(posttestScore) - Number(intakeScore) : null;

  // Domain comparison data
  const intakeDomains = useMemo(() => parseDomainBreakdown(latestIntake?.domain_breakdown), [latestIntake]);
  const posttestDomains = useMemo(() => parseDomainBreakdown(latestPosttest?.domain_breakdown), [latestPosttest]);

  // Merged domain comparison
  const domainComparison = useMemo(() => {
    if (!hasBoth) return [];
    const allNames = new Set([...intakeDomains.map(d => d.name), ...posttestDomains.map(d => d.name)]);
    return Array.from(allNames).map((name) => {
      const pre = intakeDomains.find(d => d.name === name);
      const post = posttestDomains.find(d => d.name === name);
      return {
        name,
        pretest: pre?.pct ?? null,
        posttest: post?.pct ?? null,
        change: pre && post ? Math.round((post.pct - pre.pct) * 10) / 10 : null,
      };
    }).sort((a, b) => (a.posttest ?? a.pretest ?? 0) - (b.posttest ?? b.pretest ?? 0));
  }, [intakeDomains, posttestDomains, hasBoth]);

  // Single exam domain data (for when only one exists)
  const latestSubmission = latestPosttest || latestIntake;
  const singleDomains = useMemo(() => {
    return parseDomainBreakdown(latestSubmission?.domain_breakdown);
  }, [latestSubmission]);

  // Chart data for single view
  const chartData = singleDomains.map((d) => ({
    name: d.name,
    score: d.pct,
    fill: scoreColor(d.pct),
  }));

  // All results list
  const allResults = useMemo(() => {
    const items: any[] = [];
    intakes.forEach((i) => items.push({
      ...i,
      type: 'Intake',
      date: i.submitted_at,
      score: i.score_percentage ?? i.score_percent ?? i.score,
    }));
    posttests.forEach((p) => items.push({
      ...p,
      type: 'Post-Test',
      date: p.submitted_at,
      score: p.score_percentage ?? p.score_percent ?? p.score,
    }));
    sessions.forEach((s) => items.push({
      ...s,
      type: 'Practice',
      date: s.completed_at,
      score: s.score_percent ?? s.score,
    }));
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [intakes, posttests, sessions]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200/70 rounded-lg w-40" />
          <div className="h-48 bg-gray-200/70 rounded-xl" />
          <div className="h-64 bg-gray-200/70 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  const hasAnyResults = allResults.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0D2137]">My Results</h1>
          {hasAnyResults && (
            <div className="flex bg-white rounded-lg border border-gray-200/60 shadow-sm p-1">
              <button
                onClick={() => setSelectedView('comparison')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedView === 'comparison'
                    ? 'bg-[#0D2137] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#0D2137] hover:bg-gray-50'
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setSelectedView('all')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedView === 'all'
                    ? 'bg-[#0D2137] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#0D2137] hover:bg-gray-50'
                }`}
              >
                All Results
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!hasAnyResults && (
          <Card className="rounded-xl border-gray-200/60 shadow-sm">
            <CardContent className="py-16 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <BarChart className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No results yet. Complete an exam to see your performance here.</p>
            </CardContent>
          </Card>
        )}

        {/* ─── Comparison / Analysis View ─── */}
        {hasAnyResults && selectedView === 'comparison' && (
          <>
            {/* Improvement Summary - Side by Side Cards */}
            {hasBoth && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pretest Card */}
                <Card className="rounded-xl border-gray-200/60 shadow-sm overflow-hidden">
                  <div className="h-1 bg-[#0D2137]" />
                  <CardContent className="pt-5 pb-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Pretest</p>
                    <p className="text-4xl font-bold" style={{ color: scoreColor(Number(intakeScore)) }}>
                      {Math.round(Number(intakeScore))}%
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {latestIntake?.total_questions ? `${latestIntake.total_questions} questions` : ''}
                      {' — '}{formatDate(latestIntake?.submitted_at)}
                    </p>
                  </CardContent>
                </Card>

                {/* Post-Test Card */}
                <Card className="rounded-xl border-gray-200/60 shadow-sm overflow-hidden">
                  <div className="h-1 bg-[#E03038]" />
                  <CardContent className="pt-5 pb-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Post-Test</p>
                    <p className="text-4xl font-bold" style={{ color: scoreColor(Number(posttestScore)) }}>
                      {Math.round(Number(posttestScore))}%
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {latestPosttest?.total_questions ? `${latestPosttest.total_questions} questions` : ''}
                      {' — '}{formatDate(latestPosttest?.submitted_at)}
                    </p>
                  </CardContent>
                </Card>

                {/* Change Card */}
                <Card className="rounded-xl border-gray-200/60 shadow-sm overflow-hidden">
                  <div
                    className="h-1"
                    style={{ backgroundColor: delta! >= 0 ? '#28a745' : '#dc3545' }}
                  />
                  <CardContent className="pt-5 pb-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Change</p>
                    <p
                      className="text-4xl font-bold flex items-center justify-center gap-1"
                      style={{ color: delta! >= 0 ? '#28a745' : '#dc3545' }}
                    >
                      {delta! >= 0 ? <ArrowUp className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                      {delta! > 0 ? '+' : ''}{Math.round(delta!)} pts
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Domain Comparison Table */}
            {hasBoth && domainComparison.length > 0 && (
              <Card className="rounded-xl border-gray-200/60 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-[#0D2137]">Domain Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Domain</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Pretest</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Post-Test</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {domainComparison.map((row, idx) => (
                          <tr
                            key={row.name}
                            className={`border-b border-gray-50 last:border-0 ${
                              idx % 2 === 1 ? 'bg-[#f8f9fa]' : 'bg-white'
                            }`}
                          >
                            <td className="px-6 py-3.5 font-medium text-[#0D2137]">{row.name}</td>
                            <td className="px-6 py-3.5 text-right font-medium" style={{ color: row.pretest != null ? scoreColor(row.pretest) : undefined }}>
                              {row.pretest != null ? `${Math.round(row.pretest)}%` : '—'}
                            </td>
                            <td className="px-6 py-3.5 text-right font-medium" style={{ color: row.posttest != null ? scoreColor(row.posttest) : undefined }}>
                              {row.posttest != null ? `${Math.round(row.posttest)}%` : '—'}
                            </td>
                            <td className="px-6 py-3.5 text-right font-medium">
                              {row.change != null ? (
                                <span
                                  className="inline-flex items-center gap-0.5"
                                  style={{
                                    color: row.change > 0 ? '#28a745' : row.change < 0 ? '#dc3545' : '#6b7280',
                                  }}
                                >
                                  {row.change > 0 && <ArrowUp className="h-3.5 w-3.5" />}
                                  {row.change < 0 && <ArrowDown className="h-3.5 w-3.5" />}
                                  {row.change === 0 && <Minus className="h-3.5 w-3.5" />}
                                  {row.change > 0 ? '+' : ''}{Math.round(row.change)}
                                </span>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Single exam view (no comparison) */}
            {!hasBoth && latestSubmission && (
              <>
                <Card className="rounded-xl border-gray-200/60 shadow-sm overflow-hidden">
                  <div className="h-1 bg-[#0D2137]" />
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0D2137]">
                      {latestPosttest ? 'Post-Test' : 'Intake Exam'} Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div
                        className="text-5xl font-bold"
                        style={{ color: scoreColor(Number(intakeScore ?? posttestScore)) }}
                      >
                        {Math.round(Number(intakeScore ?? posttestScore))}%
                      </div>
                      <p className="text-sm text-gray-400 mt-3">
                        {latestSubmission.total_questions ? `${latestSubmission.total_questions} questions` : ''}
                        {' — '}{formatDate(latestSubmission.submitted_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Domain bar chart */}
                {chartData.length > 0 && (
                  <Card className="rounded-xl border-gray-200/60 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="text-lg font-semibold text-[#0D2137]">Domain Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* TEI Format Breakdown */}
            {latestSubmission?.tei_breakdown && (
              <Card className="rounded-xl border-gray-200/60 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-[#0D2137]">Question Type (TEI) Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Correct</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(latestSubmission.tei_breakdown).map(([type, data]: [string, any], idx: number) => (
                          <tr
                            key={type}
                            className={`border-b border-gray-50 last:border-0 ${
                              idx % 2 === 1 ? 'bg-[#f8f9fa]' : 'bg-white'
                            }`}
                          >
                            <td className="px-6 py-3.5 font-medium text-[#0D2137]">{type}</td>
                            <td className="px-6 py-3.5 text-right text-gray-600">{data.correct ?? 0}</td>
                            <td className="px-6 py-3.5 text-right text-gray-600">{data.total ?? 0}</td>
                            <td className="px-6 py-3.5 text-right font-semibold" style={{ color: scoreColor(data.pct ?? 0) }}>
                              {data.pct != null ? `${Math.round(data.pct)}%` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* ─── All Results List ─── */}
        {hasAnyResults && selectedView === 'all' && (
          <Card className="rounded-xl border-gray-200/60 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Score</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResults.map((item, idx) => {
                      const pct = Number(item.score);
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-gray-50 last:border-0 transition-colors hover:bg-blue-50/30 ${
                            idx % 2 === 1 ? 'bg-[#f8f9fa]' : 'bg-white'
                          }`}
                        >
                          <td className="px-6 py-3.5 text-gray-600">{formatDate(item.date)}</td>
                          <td className="px-6 py-3.5">
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-3.5 text-right font-semibold" style={{ color: scoreColor(pct) }}>
                            {isNaN(pct) ? '—' : `${Math.round(pct)}%`}
                          </td>
                          <td className="px-6 py-3.5 text-right text-gray-500">
                            {item.total_questions || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
