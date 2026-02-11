import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowUp, ArrowDown, Minus, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const scoreColor = (s: number) => {
  if (s >= 90) return '#28a745';
  if (s >= 80) return '#17a2b8';
  if (s >= 70) return '#ffc107';
  return '#dc3545';
};

const scoreBgColor = (s: number) => {
  if (s >= 90) return 'rgba(40, 167, 69, 0.08)';
  if (s >= 80) return 'rgba(23, 162, 184, 0.08)';
  if (s >= 70) return 'rgba(255, 193, 7, 0.08)';
  return 'rgba(220, 53, 69, 0.08)';
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '---';
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
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200/60 rounded-lg w-40 animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-36 bg-gray-200/40 rounded-2xl animate-pulse" />
            <div className="h-36 bg-gray-200/40 rounded-2xl animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="h-36 bg-gray-200/40 rounded-2xl animate-pulse" style={{ animationDelay: '200ms' }} />
          </div>
          <div className="h-64 bg-gray-200/40 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  const hasAnyResults = allResults.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Page Header */}
        <div
          className="flex items-center justify-between"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137] tracking-tight">My Results</h1>
          {hasAnyResults && (
            <div className="flex bg-white rounded-xl border border-gray-200/60 shadow-sm p-1">
              <button
                onClick={() => setSelectedView('comparison')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  selectedView === 'comparison'
                    ? 'bg-[#0D2137] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#0D2137] hover:bg-gray-50'
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setSelectedView('all')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${
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
          <Card
            className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
            style={{ animation: 'fadeInUp 0.6s ease-out backwards', animationDelay: '0.1s' }}
          >
            <CardContent className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f5f6f8] flex items-center justify-center mb-5">
                <BarChart3 className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-700 font-semibold text-lg tracking-tight">No results yet</p>
              <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Complete an exam to see your performance here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comparison / Analysis View */}
        {hasAnyResults && selectedView === 'comparison' && (
          <>
            {/* Improvement Summary - Side by Side Cards */}
            {hasBoth && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pretest Card */}
                <Card
                  className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]"
                  style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.1s' }}
                >
                  <div className="h-1 bg-[#0D2137]" />
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Pretest</p>
                    <p
                      className="text-5xl font-bold tracking-tight"
                      style={{ color: scoreColor(Number(intakeScore)) }}
                    >
                      {Math.round(Number(intakeScore))}%
                    </p>
                    <p className="text-xs text-gray-400 mt-3 font-medium">
                      {latestIntake?.total_questions ? `${latestIntake.total_questions} questions` : ''}
                      {' --- '}{formatDate(latestIntake?.submitted_at)}
                    </p>
                  </CardContent>
                </Card>

                {/* Post-Test Card */}
                <Card
                  className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]"
                  style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.15s' }}
                >
                  <div className="h-1 bg-[#E03038]" />
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Post-Test</p>
                    <p
                      className="text-5xl font-bold tracking-tight"
                      style={{ color: scoreColor(Number(posttestScore)) }}
                    >
                      {Math.round(Number(posttestScore))}%
                    </p>
                    <p className="text-xs text-gray-400 mt-3 font-medium">
                      {latestPosttest?.total_questions ? `${latestPosttest.total_questions} questions` : ''}
                      {' --- '}{formatDate(latestPosttest?.submitted_at)}
                    </p>
                  </CardContent>
                </Card>

                {/* Change Card */}
                <Card
                  className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]"
                  style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.2s' }}
                >
                  <div
                    className="h-1"
                    style={{ backgroundColor: delta! >= 0 ? '#28a745' : '#dc3545' }}
                  />
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Change</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <p
                        className="text-5xl font-bold tracking-tight flex items-center gap-1"
                        style={{ color: delta! >= 0 ? '#28a745' : '#dc3545' }}
                      >
                        {delta! >= 0 ? <ArrowUp className="h-7 w-7" /> : <ArrowDown className="h-7 w-7" />}
                        {delta! > 0 ? '+' : ''}{Math.round(delta!)}
                      </p>
                      <span
                        className="text-lg font-semibold mt-1"
                        style={{ color: delta! >= 0 ? '#28a745' : '#dc3545' }}
                      >
                        pts
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Domain Comparison Table */}
            {hasBoth && domainComparison.length > 0 && (
              <Card
                className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
                style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.25s' }}
              >
                <CardHeader className="border-b border-gray-100/80 px-6 py-5">
                  <CardTitle className="text-lg font-semibold text-[#0D2137] tracking-tight">Domain Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100/80">
                          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Domain</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Pretest</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Post-Test</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {domainComparison.map((row, idx) => (
                          <tr
                            key={row.name}
                            className="border-b border-gray-50 last:border-0 transition-colors duration-200 hover:bg-[#0D2137]/[0.02]"
                            style={{
                              backgroundColor: idx % 2 === 1 ? '#f8f9fa' : 'white',
                            }}
                          >
                            <td className="px-6 py-4 font-medium text-[#0D2137] tracking-tight">{row.name}</td>
                            <td className="px-6 py-4 text-right">
                              <span
                                className="font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                  color: row.pretest != null ? scoreColor(row.pretest) : undefined,
                                  backgroundColor: row.pretest != null ? scoreBgColor(row.pretest) : undefined,
                                }}
                              >
                                {row.pretest != null ? `${Math.round(row.pretest)}%` : '---'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span
                                className="font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                  color: row.posttest != null ? scoreColor(row.posttest) : undefined,
                                  backgroundColor: row.posttest != null ? scoreBgColor(row.posttest) : undefined,
                                }}
                              >
                                {row.posttest != null ? `${Math.round(row.posttest)}%` : '---'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {row.change != null ? (
                                <span
                                  className="inline-flex items-center gap-0.5 font-semibold"
                                  style={{
                                    color: row.change > 0 ? '#28a745' : row.change < 0 ? '#dc3545' : '#6b7280',
                                  }}
                                >
                                  {row.change > 0 && <ArrowUp className="h-3.5 w-3.5" />}
                                  {row.change < 0 && <ArrowDown className="h-3.5 w-3.5" />}
                                  {row.change === 0 && <Minus className="h-3.5 w-3.5" />}
                                  {row.change > 0 ? '+' : ''}{Math.round(row.change)}
                                </span>
                              ) : '---'}
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
                <Card
                  className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                  style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.1s' }}
                >
                  <div className="h-1 bg-gradient-to-r from-[#0D2137] to-[#0D2137]/60" />
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold text-[#0D2137] tracking-tight">
                      {latestPosttest ? 'Post-Test' : 'Intake Exam'} Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div
                        className="text-6xl font-bold tracking-tight inline-block px-4 py-2 rounded-2xl"
                        style={{
                          color: scoreColor(Number(intakeScore ?? posttestScore)),
                          backgroundColor: scoreBgColor(Number(intakeScore ?? posttestScore)),
                        }}
                      >
                        {Math.round(Number(intakeScore ?? posttestScore))}%
                      </div>
                      <p className="text-sm text-gray-400 mt-4 font-medium">
                        {latestSubmission.total_questions ? `${latestSubmission.total_questions} questions` : ''}
                        {' --- '}{formatDate(latestSubmission.submitted_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Domain bar chart */}
                {chartData.length > 0 && (
                  <Card
                    className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
                    style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.15s' }}
                  >
                    <CardHeader className="border-b border-gray-100/80 px-6 py-5">
                      <CardTitle className="text-lg font-semibold text-[#0D2137] tracking-tight">Domain Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={{ stroke: '#e5e7eb' }} />
                            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} />
                            <Tooltip
                              formatter={(value: number) => [`${value}%`, 'Score']}
                              contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                fontSize: '13px',
                              }}
                            />
                            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={22}>
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
              <Card
                className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
                style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.2s' }}
              >
                <CardHeader className="border-b border-gray-100/80 px-6 py-5">
                  <CardTitle className="text-lg font-semibold text-[#0D2137] tracking-tight">Question Type (TEI) Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100/80">
                          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Correct</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(latestSubmission.tei_breakdown).map(([type, data]: [string, any], idx: number) => (
                          <tr
                            key={type}
                            className="border-b border-gray-50 last:border-0 transition-colors duration-200 hover:bg-[#0D2137]/[0.02]"
                            style={{
                              backgroundColor: idx % 2 === 1 ? '#f8f9fa' : 'white',
                            }}
                          >
                            <td className="px-6 py-4 font-medium text-[#0D2137] tracking-tight">{type}</td>
                            <td className="px-6 py-4 text-right text-gray-600">{data.correct ?? 0}</td>
                            <td className="px-6 py-4 text-right text-gray-600">{data.total ?? 0}</td>
                            <td className="px-6 py-4 text-right">
                              <span
                                className="font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                  color: scoreColor(data.pct ?? 0),
                                  backgroundColor: scoreBgColor(data.pct ?? 0),
                                }}
                              >
                                {data.pct != null ? `${Math.round(data.pct)}%` : '---'}
                              </span>
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

        {/* All Results List */}
        {hasAnyResults && selectedView === 'all' && (
          <Card
            className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.1s' }}
          >
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100/80 bg-[#f8f9fa]">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Score</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResults.map((item, idx) => {
                      const pct = Number(item.score);
                      return (
                        <tr
                          key={idx}
                          className="border-b border-gray-50 last:border-0 transition-colors duration-200 hover:bg-[#0D2137]/[0.02]"
                          style={{
                            backgroundColor: idx % 2 === 1 ? '#f8f9fa' : 'white',
                            animation: 'fadeIn 0.3s ease-out backwards',
                            animationDelay: `${idx * 0.03}s`,
                          }}
                        >
                          <td className="px-6 py-4 text-gray-600 font-medium">{formatDate(item.date)}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={`text-xs font-medium px-2.5 py-0.5 ${
                                item.type === 'Intake'
                                  ? 'bg-[#0D2137]/8 text-[#0D2137]'
                                  : item.type === 'Post-Test'
                                    ? 'bg-[#E03038]/8 text-[#E03038]'
                                    : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isNaN(pct) ? (
                              <span className="text-gray-400">---</span>
                            ) : (
                              <span
                                className="font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                  color: scoreColor(pct),
                                  backgroundColor: scoreBgColor(pct),
                                }}
                              >
                                {Math.round(pct)}%
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-500 font-medium">
                            {item.total_questions || '---'}
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
