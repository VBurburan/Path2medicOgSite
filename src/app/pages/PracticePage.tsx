import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import {
  BookOpen,
  Layers,
  Target,
  Shuffle,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
  GraduationCap,
  Hash,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Domain {
  id: string;
  name: string;
}

interface StudentProfile {
  id: string;
  certification_level: string;
  preferred_question_count: number;
  total_questions_answered: number;
}

type PracticeMode = 'domain' | 'tei' | 'weak' | 'random' | 'exam';
type TEIType = 'MC' | 'MR' | 'BL' | 'DD' | 'OB' | 'Graphics';
type CertLevel = 'EMT' | 'AEMT' | 'Paramedic';
type QuestionCount = 10 | 25 | 50;

const TEI_OPTIONS: { value: TEIType; label: string; desc: string }[] = [
  { value: 'MC', label: 'Multiple Choice', desc: 'Single best answer' },
  { value: 'MR', label: 'Multiple Response', desc: 'Select all that apply' },
  { value: 'BL', label: 'Build List', desc: 'Order / prioritize items' },
  { value: 'DD', label: 'Drag & Drop', desc: 'Match items to categories' },
  { value: 'OB', label: 'Options Box', desc: 'Matrix grid selections' },
  { value: 'Graphics', label: 'Graphics', desc: 'Image-based questions' },
];

const QUESTION_COUNTS: QuestionCount[] = [10, 25, 50];

const CERT_LEVELS: { value: CertLevel; label: string }[] = [
  { value: 'EMT', label: 'EMT' },
  { value: 'AEMT', label: 'AEMT' },
  { value: 'Paramedic', label: 'Paramedic' },
];

/* ------------------------------------------------------------------ */
/* Mode Card Component                                                 */
/* ------------------------------------------------------------------ */

interface ModeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  accent?: string;
}

function ModeCard({ icon, title, description, selected, onClick, accent = '#1a5f7a' }: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left rounded-xl border-2 p-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        selected
          ? 'border-[#1a5f7a] bg-[#1a5f7a]/5 shadow-md ring-1 ring-[#1a5f7a]/20'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#1a5f7a]" />
      )}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            selected ? 'bg-[#1a5f7a] text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#0D2137]">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page Component                                                 */
/* ------------------------------------------------------------------ */

export default function PracticePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  /* ---- Data state ---- */
  const [domains, setDomains] = useState<Domain[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---- Selection state ---- */
  const [mode, setMode] = useState<PracticeMode | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedTEI, setSelectedTEI] = useState<TEIType | ''>('');
  const [questionCount, setQuestionCount] = useState<QuestionCount>(25);
  const [certLevel, setCertLevel] = useState<CertLevel>('EMT');
  const [timerEnabled, setTimerEnabled] = useState(false);

  /* ---- Fetch data on mount ---- */
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchData() {
      try {
        setLoadingData(true);

        // Fetch domains
        const { data: domainRows, error: domErr } = await supabase
          .from('domains')
          .select('id, name')
          .order('name');

        if (domErr) throw domErr;
        setDomains(domainRows || []);

        // Fetch student profile
        const { data: student, error: stuErr } = await supabase
          .from('students')
          .select('id, certification_level, preferred_question_count, total_questions_answered')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (stuErr) console.warn('Student profile fetch:', stuErr);

        if (student) {
          setStudentProfile(student);
          setCertLevel((student.certification_level as CertLevel) || 'EMT');
          if (QUESTION_COUNTS.includes(student.preferred_question_count as QuestionCount)) {
            setQuestionCount(student.preferred_question_count as QuestionCount);
          }
        }
      } catch (err: any) {
        console.error('Error fetching practice page data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [user, authLoading, navigate]);

  /* ---- Validation ---- */
  const canStart = (): boolean => {
    if (!mode) return false;
    if (mode === 'domain' && !selectedDomain) return false;
    if (mode === 'tei' && !selectedTEI) return false;
    return true;
  };

  /* ---- Start session ---- */
  const handleStart = () => {
    if (!canStart()) return;

    const params = new URLSearchParams();
    params.set('mode', mode!);
    params.set('count', String(questionCount));
    params.set('level', certLevel);
    if (mode === 'domain') params.set('domain', selectedDomain);
    if (mode === 'tei') params.set('teiType', selectedTEI);
    if (mode === 'exam' || timerEnabled) params.set('timed', 'true');

    navigate(`/practice/session?${params.toString()}`);
  };

  /* ---- Loading / Error states ---- */
  if (authLoading || loadingData) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1a5f7a]" />
            <p className="mt-4 text-gray-500">Loading practice options...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-[#E03038]" />
            <h2 className="mt-4 text-lg font-semibold text-[#0D2137]">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-[#0D2137] px-5 py-2 text-sm font-medium text-white hover:bg-[#0D2137]/90"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ---- Header ---- */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#0D2137]">Practice Exam</h1>
          <p className="mt-2 text-gray-500">
            Choose a study mode and customize your session to focus on what matters most.
          </p>
        </div>

        {/* ---- Mode Selection ---- */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#0D2137]">
            <Zap className="h-5 w-5 text-[#d4a843]" />
            Select Study Mode
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ModeCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Study by Domain"
              description="Focus on a specific NREMT content domain"
              selected={mode === 'domain'}
              onClick={() => setMode('domain')}
            />
            <ModeCard
              icon={<Layers className="h-6 w-6" />}
              title="Study by TEI Type"
              description="Practice a specific question format"
              selected={mode === 'tei'}
              onClick={() => setMode('tei')}
            />
            <ModeCard
              icon={<Target className="h-6 w-6" />}
              title="Weak Area Drill"
              description="Auto-targets your lowest scoring domains"
              selected={mode === 'weak'}
              onClick={() => setMode('weak')}
            />
            <ModeCard
              icon={<Shuffle className="h-6 w-6" />}
              title="Random Mix"
              description="Randomized questions across all areas"
              selected={mode === 'random'}
              onClick={() => setMode('random')}
            />
            <ModeCard
              icon={<Clock className="h-6 w-6" />}
              title="Full Exam Simulation"
              description="Timed, exam-length practice under real conditions"
              selected={mode === 'exam'}
              onClick={() => {
                setMode('exam');
                setTimerEnabled(true);
              }}
            />
          </div>
        </section>

        {/* ---- Domain Picker (conditional) ---- */}
        {mode === 'domain' && (
          <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#0D2137]">
              <BookOpen className="h-5 w-5 text-[#1a5f7a]" />
              Choose Domain
            </h2>
            {domains.length === 0 ? (
              <p className="text-sm text-gray-400">No domains found.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {domains.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDomain(d.id)}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all ${
                      selectedDomain === d.id
                        ? 'border-[#1a5f7a] bg-[#1a5f7a]/5 text-[#1a5f7a]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ---- TEI Type Picker (conditional) ---- */}
        {mode === 'tei' && (
          <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#0D2137]">
              <Layers className="h-5 w-5 text-[#1a5f7a]" />
              Choose Question Format
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TEI_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedTEI(t.value)}
                  className={`rounded-lg border px-4 py-3 text-left transition-all ${
                    selectedTEI === t.value
                      ? 'border-[#1a5f7a] bg-[#1a5f7a]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-sm font-semibold text-[#0D2137]">{t.label}</span>
                  <span className="block text-xs text-gray-500">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ---- Options Row ---- */}
        <section className="mb-10 grid gap-6 sm:grid-cols-3">
          {/* Question Count */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0D2137]">
              <Hash className="h-4 w-4 text-[#d4a843]" />
              Question Count
            </h3>
            <div className="flex gap-2">
              {QUESTION_COUNTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setQuestionCount(c)}
                  className={`flex-1 rounded-lg border py-2 text-center text-sm font-medium transition-all ${
                    questionCount === c
                      ? 'border-[#1a5f7a] bg-[#1a5f7a] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Certification Level */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0D2137]">
              <GraduationCap className="h-4 w-4 text-[#d4a843]" />
              Certification Level
            </h3>
            <div className="flex gap-2">
              {CERT_LEVELS.map((cl) => (
                <button
                  key={cl.value}
                  type="button"
                  onClick={() => setCertLevel(cl.value)}
                  className={`flex-1 rounded-lg border py-2 text-center text-sm font-medium transition-all ${
                    certLevel === cl.value
                      ? 'border-[#1a5f7a] bg-[#1a5f7a] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Toggle */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0D2137]">
              <Clock className="h-4 w-4 text-[#d4a843]" />
              Timer
            </h3>
            <button
              type="button"
              onClick={() => {
                if (mode !== 'exam') setTimerEnabled(!timerEnabled);
              }}
              className={`w-full rounded-lg border py-2 text-center text-sm font-medium transition-all ${
                timerEnabled || mode === 'exam'
                  ? 'border-[#1a5f7a] bg-[#1a5f7a] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {timerEnabled || mode === 'exam' ? 'Timer ON' : 'Timer OFF'}
            </button>
            {mode === 'exam' && (
              <p className="mt-2 text-xs text-gray-400">Timer is always on in exam mode</p>
            )}
          </div>
        </section>

        {/* ---- Start Button ---- */}
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!canStart()}
            onClick={handleStart}
            className={`group flex items-center gap-3 rounded-xl px-10 py-4 text-lg font-bold transition-all ${
              canStart()
                ? 'bg-[#E03038] text-white shadow-lg hover:bg-[#c72830] hover:shadow-xl active:scale-[0.98]'
                : 'cursor-not-allowed bg-gray-200 text-gray-400'
            }`}
          >
            Start Practice
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {!mode && (
          <p className="mt-4 text-center text-sm text-gray-400">Select a study mode above to begin</p>
        )}
      </div>
    </Layout>
  );
}
