import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Trophy,
  Clock,
  BarChart3,
  Target,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Home,
  Flag,
  Layers,
  Brain,
  AlertCircle,
} from 'lucide-react';

/* ================================================================== */
/*  TYPES (mirrored from session page)                                 */
/* ================================================================== */

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  stem: string;
  options: QuestionOption[];
  correct_answer: string | string[] | string[][];
  item_type: 'MC' | 'MR' | 'BL' | 'DD' | 'OB' | 'Graphics';
  difficulty_level: number;
  domain: string;
  cj_step: string;
  rationale_correct: string;
  rationales_distractors: Record<string, string>;
  scenario_context: string | null;
  certification_level: string;
  image_url: string | null;
}

type UserAnswer = string | string[] | string[][];

interface AnswerRecord {
  answer: UserAnswer;
  startedAt: number;
}

interface BreakdownEntry {
  correct: number;
  total: number;
  pct: number;
}

interface SessionResults {
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  flagged: Set<string>;
  score: number;
  totalQuestions: number;
  correctCount: number;
  domainBreakdown: Record<string, BreakdownEntry>;
  teiBreakdown: Record<string, BreakdownEntry>;
  cjBreakdown: Record<string, BreakdownEntry>;
  durationSeconds: number;
  certLevel: string;
  mode: string;
}

/* ================================================================== */
/*  HELPERS                                                            */
/* ================================================================== */

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as Record<string, unknown>);
    const bKeys = Object.keys(b as Record<string, unknown>);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  return false;
}

function isAnswerCorrect(question: Question, userAnswer: UserAnswer): boolean {
  const correct = question.correct_answer;

  if (question.item_type === 'MC' || question.item_type === 'Graphics') {
    return correct === userAnswer;
  }

  if (question.item_type === 'MR') {
    if (!Array.isArray(userAnswer) || !Array.isArray(correct)) return false;
    const sortedUser = [...(userAnswer as string[])].sort();
    const sortedCorrect = [...(correct as string[])].sort();
    return deepEqual(sortedUser, sortedCorrect);
  }

  if (question.item_type === 'BL') {
    return deepEqual(correct, userAnswer);
  }

  if (question.item_type === 'DD' || question.item_type === 'OB') {
    if (!Array.isArray(userAnswer) || !Array.isArray(correct)) return false;
    const sortPairs = (arr: string[][]) =>
      [...arr].sort((a, b) => {
        const ja = JSON.stringify(a);
        const jb = JSON.stringify(b);
        return ja < jb ? -1 : ja > jb ? 1 : 0;
      });
    return deepEqual(sortPairs(correct as string[][]), sortPairs(userAnswer as string[][]));
  }

  return false;
}

/** Format a user answer for display */
function formatAnswer(question: Question, answer: UserAnswer | undefined): string {
  if (answer == null) return 'Not answered';

  const optMap = new Map<string, string>();
  question.options.forEach((o) => optMap.set(o.id, o.text));

  if (typeof answer === 'string') {
    return optMap.get(answer) || answer;
  }

  if (Array.isArray(answer)) {
    if (answer.length === 0) return 'Not answered';

    // Array of strings (MR or BL)
    if (typeof answer[0] === 'string') {
      return (answer as string[]).map((a, i) => `${i + 1}. ${optMap.get(a) || a}`).join('; ');
    }

    // Array of pairs (DD or OB)
    if (Array.isArray(answer[0])) {
      return (answer as string[][]).map(([a, b]) => `${a} -> ${optMap.get(b) || b}`).join('; ');
    }
  }

  return JSON.stringify(answer);
}

function formatCorrectAnswer(question: Question): string {
  const correct = question.correct_answer;
  const optMap = new Map<string, string>();
  question.options.forEach((o) => optMap.set(o.id, o.text));

  if (typeof correct === 'string') {
    return optMap.get(correct) || correct;
  }

  if (Array.isArray(correct)) {
    if (correct.length === 0) return 'N/A';

    if (typeof correct[0] === 'string') {
      return (correct as string[]).map((a, i) => `${i + 1}. ${optMap.get(a) || a}`).join('; ');
    }

    if (Array.isArray(correct[0])) {
      return (correct as string[][]).map(([a, b]) => `${a} -> ${optMap.get(b) || b}`).join('; ');
    }
  }

  return JSON.stringify(correct);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function scoreColor(pct: number): string {
  if (pct >= 90) return '#28a745';
  if (pct >= 80) return '#17a2b8';
  if (pct >= 70) return '#ffc107';
  return '#dc3545';
}

function scoreBgClass(pct: number): string {
  if (pct >= 90) return 'bg-[#28a745]/10 text-[#28a745] border-[#28a745]/20';
  if (pct >= 80) return 'bg-[#17a2b8]/10 text-[#17a2b8] border-[#17a2b8]/20';
  if (pct >= 70) return 'bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/20';
  return 'bg-[#dc3545]/10 text-[#dc3545] border-[#dc3545]/20';
}

function scoreLabel(pct: number): string {
  if (pct >= 90) return 'Excellent';
  if (pct >= 80) return 'Good';
  if (pct >= 70) return 'Needs Improvement';
  return 'Below Passing';
}

/* ================================================================== */
/*  BAR COLOR HELPER                                                   */
/* ================================================================== */

function barFill(pct: number): string {
  if (pct >= 90) return '#28a745';
  if (pct >= 80) return '#17a2b8';
  if (pct >= 70) return '#ffc107';
  return '#dc3545';
}

/* ================================================================== */
/*  CUSTOM TOOLTIP FOR RECHARTS                                        */
/* ================================================================== */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-[#0D2137]">{label}</p>
      <p style={{ color: barFill(entry.value) }}>
        {entry.value}% ({entry.payload.correct}/{entry.payload.total})
      </p>
    </div>
  );
}

/* ================================================================== */
/*  MAIN RESULTS PAGE                                                  */
/* ================================================================== */

export default function PracticeResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const results = (location.state as { results?: SessionResults })?.results;

  /* ---- Guard: no results ---- */
  if (!results) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-4 text-lg font-semibold text-[#0D2137]">No Results Found</h2>
            <p className="mt-2 text-sm text-gray-500">
              It looks like you navigated here directly. Complete a practice session to see results.
            </p>
            <button
              onClick={() => navigate('/practice/start')}
              className="mt-6 rounded-lg bg-[#0D2137] px-5 py-2 text-sm font-medium text-white hover:bg-[#0D2137]/90"
            >
              Start Practice
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    questions,
    answers,
    score,
    totalQuestions,
    correctCount,
    domainBreakdown,
    teiBreakdown,
    cjBreakdown,
    durationSeconds,
  } = results;

  // Reconstruct flagged as a Set if it came through as a plain object from router state
  const flaggedSet = useMemo(() => {
    if (results.flagged instanceof Set) return results.flagged;
    // If serialized/deserialized it may be an array or object
    if (Array.isArray(results.flagged)) return new Set(results.flagged as unknown as string[]);
    return new Set<string>();
  }, [results.flagged]);

  /* ---- Domain chart data (sorted weakest-first) ---- */
  const domainChartData = useMemo(() => {
    return Object.entries(domainBreakdown)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => a.pct - b.pct);
  }, [domainBreakdown]);

  /* ---- TEI breakdown list ---- */
  const teiList = useMemo(() => {
    return Object.entries(teiBreakdown).map(([name, data]) => ({ name, ...data }));
  }, [teiBreakdown]);

  /* ---- CJ breakdown list ---- */
  const cjList = useMemo(() => {
    return Object.entries(cjBreakdown).map(([name, data]) => ({ name, ...data }));
  }, [cjBreakdown]);

  /* ---- Per-question review data ---- */
  const questionReview = useMemo(() => {
    return questions.map((q, idx) => {
      const record = answers[q.id];
      const userAns = record?.answer;
      const correct = userAns != null ? isAnswerCorrect(q, userAns) : false;
      return { question: q, index: idx, userAnswer: userAns, isCorrect: correct, record };
    });
  }, [questions, answers]);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ================================================================ */}
        {/*  SCORE HERO                                                       */}
        {/* ================================================================ */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            style={{
              background: `linear-gradient(135deg, ${scoreColor(score)}15 0%, white 60%)`,
            }}
          >
            <Trophy className="h-12 w-12" style={{ color: scoreColor(score) }} />
            <p className="mt-4 text-6xl font-extrabold" style={{ color: scoreColor(score) }}>
              {score}%
            </p>
            <p className="mt-2 text-lg font-semibold text-[#0D2137]">{scoreLabel(score)}</p>
            <p className="mt-1 text-sm text-gray-500">
              {correctCount} correct out of {totalQuestions} questions
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center py-5">
              <Clock className="h-5 w-5 text-gray-400" />
              <p className="mt-1 text-lg font-bold text-[#0D2137]">{formatTime(durationSeconds)}</p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
            <div className="flex flex-col items-center py-5">
              <Target className="h-5 w-5 text-gray-400" />
              <p className="mt-1 text-lg font-bold text-[#0D2137]">{totalQuestions}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="flex flex-col items-center py-5">
              <CheckCircle2 className="h-5 w-5 text-[#28a745]" />
              <p className="mt-1 text-lg font-bold text-[#28a745]">{correctCount}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="flex flex-col items-center py-5">
              <XCircle className="h-5 w-5 text-[#dc3545]" />
              <p className="mt-1 text-lg font-bold text-[#dc3545]">{totalQuestions - correctCount}</p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  DOMAIN PERFORMANCE BAR CHART                                     */}
        {/* ================================================================ */}
        {domainChartData.length > 0 && (
          <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#0D2137]">
              <BarChart3 className="h-5 w-5 text-[#0D2137]" />
              Domain Performance
              <span className="ml-auto text-xs font-normal text-gray-400">Sorted weakest-first</span>
            </h2>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={domainChartData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={180}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={30}>
                    {domainChartData.map((entry, index) => (
                      <Cell key={index} fill={barFill(entry.pct)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/*  TEI + CJ BREAKDOWN (side by side)                                */}
        {/* ================================================================ */}
        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* TEI Breakdown */}
          {teiList.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0D2137]">
                <Layers className="h-5 w-5 text-[#0D2137]" />
                TEI Type Breakdown
              </h2>
              <div className="space-y-3">
                {teiList.map((t) => (
                  <div key={t.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{t.name}</span>
                      <span className="font-semibold" style={{ color: barFill(t.pct) }}>
                        {t.pct}%
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          ({t.correct}/{t.total})
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${t.pct}%`, backgroundColor: barFill(t.pct) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CJ Step Breakdown */}
          {cjList.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0D2137]">
                <Brain className="h-5 w-5 text-[#0D2137]" />
                Clinical Judgment Steps
              </h2>
              <div className="space-y-3">
                {cjList.map((c) => (
                  <div key={c.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{c.name}</span>
                      <span className="font-semibold" style={{ color: barFill(c.pct) }}>
                        {c.pct}%
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          ({c.correct}/{c.total})
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${c.pct}%`, backgroundColor: barFill(c.pct) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ================================================================ */}
        {/*  QUESTION-BY-QUESTION REVIEW                                      */}
        {/* ================================================================ */}
        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#0D2137]">Question-by-Question Review</h2>

          <Accordion type="multiple" className="w-full">
            {questionReview.map(({ question, index, userAnswer, isCorrect }) => {
              const isFlagged = flaggedSet.has(question.id);

              return (
                <AccordionItem key={question.id} value={question.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center gap-3 pr-4">
                      {/* Status icon */}
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#28a745]" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-[#dc3545]" />
                      )}

                      {/* Question number + snippet */}
                      <div className="min-w-0 flex-1 text-left">
                        <span className="text-sm font-semibold text-[#0D2137]">
                          Q{index + 1}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-clamp-1">
                          {question.stem}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex shrink-0 items-center gap-2">
                        {isFlagged && (
                          <Flag className="h-4 w-4 fill-[#d4a843] text-[#d4a843]" />
                        )}
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {question.item_type}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                            isCorrect
                              ? 'border-[#28a745]/20 bg-[#28a745]/10 text-[#28a745]'
                              : 'border-[#dc3545]/20 bg-[#dc3545]/10 text-[#dc3545]'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-4 pl-8">
                      {/* Scenario */}
                      {question.scenario_context && (
                        <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#0D2137]">
                            Scenario
                          </span>
                          {question.scenario_context}
                        </div>
                      )}

                      {/* Question stem */}
                      <p className="text-sm font-semibold text-[#0D2137]">{question.stem}</p>

                      {/* Image (if Graphics) */}
                      {question.image_url && (
                        <img
                          src={question.image_url}
                          alt="Question graphic"
                          className="max-h-48 rounded-lg border border-gray-200 object-contain"
                        />
                      )}

                      {/* Your Answer */}
                      <div
                        className={`rounded-lg border p-3 ${
                          isCorrect
                            ? 'border-[#28a745]/20 bg-[#28a745]/5'
                            : 'border-[#dc3545]/20 bg-[#dc3545]/5'
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Your Answer
                        </p>
                        <p
                          className={`mt-1 text-sm font-medium ${
                            isCorrect ? 'text-[#28a745]' : 'text-[#dc3545]'
                          }`}
                        >
                          {formatAnswer(question, userAnswer)}
                        </p>
                      </div>

                      {/* Correct Answer (if wrong) */}
                      {!isCorrect && (
                        <div className="rounded-lg border border-[#28a745]/20 bg-[#28a745]/5 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Correct Answer
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#28a745]">
                            {formatCorrectAnswer(question)}
                          </p>
                        </div>
                      )}

                      {/* Rationale for correct answer (show when missed) */}
                      {!isCorrect && question.rationale_correct && (
                        <div className="rounded-lg border border-[#0D2137]/20 bg-[#0D2137]/5 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#0D2137]">
                            Why the correct answer is right
                          </p>
                          <p className="mt-1 text-sm text-gray-700">{question.rationale_correct}</p>
                        </div>
                      )}

                      {/* Rationale for the chosen distractor (if wrong and available) */}
                      {!isCorrect &&
                        userAnswer != null &&
                        typeof userAnswer === 'string' &&
                        question.rationales_distractors &&
                        question.rationales_distractors[userAnswer] && (
                          <div className="rounded-lg border border-[#d4a843]/20 bg-[#d4a843]/5 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#d4a843]">
                              Why your answer is incorrect
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {question.rationales_distractors[userAnswer]}
                            </p>
                          </div>
                        )}

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>Domain: {question.domain}</span>
                        <span>CJ Step: {question.cj_step}</span>
                        <span>Type: {question.item_type}</span>
                        <span>Difficulty: {question.difficulty_level}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>

        {/* ================================================================ */}
        {/*  ACTION BUTTONS                                                   */}
        {/* ================================================================ */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate('/practice/start')}
            className="flex items-center gap-2 rounded-xl bg-[#E03038] px-8 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-[#c72830] hover:shadow-xl"
          >
            <RotateCcw className="h-5 w-5" />
            Practice Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-3 text-base font-semibold text-[#0D2137] transition-all hover:border-gray-300"
          >
            <Home className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
