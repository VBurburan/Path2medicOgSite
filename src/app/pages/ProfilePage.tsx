import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Skeleton } from '../components/ui/skeleton';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import {
  User,
  Save,
  LogOut,
  Shield,
  Calendar,
  BookOpen,
  Settings,
  Crown,
} from 'lucide-react';

/* ── brand palette ── */
const NAVY = '#0D2137';
const RED = '#E03038';
const NAVY = '#0D2137';
const GOLD = '#d4a843';
const BG = '#f5f5f5';

const CERT_LEVELS = ['EMT', 'AEMT', 'Paramedic'] as const;
const QUESTION_COUNTS = [10, 25, 50] as const;

function tierLabel(tier: string | null | undefined): string {
  if (!tier) return 'Free';
  const map: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    max: 'Max',
  };
  return map[tier.toLowerCase()] ?? tier;
}

function tierColor(tier: string | null | undefined): string {
  const t = (tier ?? 'free').toLowerCase();
  if (t === 'max') return GOLD;
  if (t === 'pro') return NAVY;
  return '#6b7280';
}

/* ── loading skeleton ── */
function ProfileSkeleton() {
  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-10 w-44 mb-8 rounded-lg" />
          <Skeleton className="h-72 rounded-xl mb-6" />
          <Skeleton className="h-48 rounded-xl mb-6" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </section>
    </Layout>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* editable fields */
  const [fullName, setFullName] = useState('');
  const [certLevel, setCertLevel] = useState<string>('EMT');
  const [targetExamDate, setTargetExamDate] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(25);

  /* study preferences */
  const [showRationalesImmediately, setShowRationalesImmediately] = useState(false);
  const [enableTimer, setEnableTimer] = useState(true);

  /* membership */
  const [membershipTier, setMembershipTier] = useState<string>('free');

  /* student row id for upsert */
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data: student } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (student) {
          setStudentId(student.id);
          setFullName(student.full_name ?? '');
          setCertLevel(student.certification_level ?? 'EMT');
          setTargetExamDate(student.target_exam_date ?? '');
          setQuestionCount(student.preferred_question_count ?? 25);
          setShowRationalesImmediately(student.show_rationales_immediately ?? false);
          setEnableTimer(student.enable_timer ?? true);
          setMembershipTier(student.membership_tier ?? 'free');
        }
      } catch (err) {
        console.error('Profile fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  /* ── save handler ── */
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const payload = {
        user_id: user.id,
        email: user.email,
        full_name: fullName,
        certification_level: certLevel,
        target_exam_date: targetExamDate || null,
        preferred_question_count: questionCount,
        show_rationales_immediately: showRationalesImmediately,
        enable_timer: enableTimer,
      };

      let error: any = null;

      if (studentId) {
        // Update existing
        const res = await supabase
          .from('students')
          .update(payload)
          .eq('id', studentId);
        error = res.error;
      } else {
        // Insert new
        const res = await supabase
          .from('students')
          .insert({ ...payload, membership_tier: 'free', member_status: 'active' });
        error = res.error;
      }

      if (error) {
        console.error('Save error', error);
        toast.error('Failed to save profile. Please try again.');
      } else {
        toast.success('Profile saved successfully!');
      }
    } catch (err) {
      console.error('Save error', err);
      toast.error('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  /* ── logout ── */
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <Layout>
      <section className="py-8 min-h-screen" style={{ backgroundColor: BG }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Page title */}
          <div className="flex items-center gap-3 mb-8">
            <User className="h-7 w-7" style={{ color: NAVY }} />
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>
              Profile &amp; Settings
            </h1>
          </div>

          {/* ── Personal Information ── */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="h-5 w-5" style={{ color: NAVY }} />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                Personal Information
              </h2>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Certification Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Level
                </label>
                <select
                  value={certLevel}
                  onChange={(e) => setCertLevel(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                  style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                >
                  {CERT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Exam Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1 -mt-0.5" />
                  Target Exam Date
                </label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                />
              </div>

              {/* Preferred Question Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="inline h-4 w-4 mr-1 -mt-0.5" />
                  Preferred Question Count
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                  style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                >
                  {QUESTION_COUNTS.map((c) => (
                    <option key={c} value={c}>
                      {c} questions
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Study Preferences ── */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5" style={{ color: GOLD }} />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                Study Preferences
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Show rationales immediately
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    See the answer explanation after each question instead of at the end
                  </p>
                </div>
                <Switch
                  checked={showRationalesImmediately}
                  onCheckedChange={setShowRationalesImmediately}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Enable timer during practice
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Show a countdown timer to simulate real exam conditions
                  </p>
                </div>
                <Switch
                  checked={enableTimer}
                  onCheckedChange={setEnableTimer}
                />
              </div>
            </div>
          </div>

          {/* ── Membership Info ── */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5" style={{ color: tierColor(membershipTier) }} />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                Membership
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p
                  className="text-xl font-bold mt-0.5"
                  style={{ color: tierColor(membershipTier) }}
                >
                  {tierLabel(membershipTier)}
                </p>
              </div>
              {membershipTier === 'free' && (
                <a
                  href="https://path2medic.thinkific.com/enroll/3570436?price_id=4503585"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: GOLD }}
                >
                  Upgrade
                </a>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: NAVY }}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border font-semibold transition hover:bg-red-50"
              style={{ borderColor: RED, color: RED }}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
