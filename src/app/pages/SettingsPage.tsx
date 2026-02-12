import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { User, Settings as SettingsIcon, Crown, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState<any>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [certLevel, setCertLevel] = useState('EMT');
  const [targetExamDate, setTargetExamDate] = useState('');
  const [preferredCount, setPreferredCount] = useState(25);
  const [showRationales, setShowRationales] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setStudent(data);
          setFullName(data.full_name || '');
          setCertLevel(data.certification_level || 'EMT');
          setTargetExamDate(data.target_exam_date || '');
          setPreferredCount(data.preferred_question_count || 25);
          setShowRationales(data.show_rationales_immediately || false);
        }
      } catch (err) {
        console.error('Settings fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !student) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          full_name: fullName,
          certification_level: certLevel,
          target_exam_date: targetExamDate || null,
          preferred_question_count: preferredCount,
          show_rationales_immediately: showRationales,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Settings saved');
    } catch (err) {
      console.error('Save error', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-2xl">
          <div className="h-8 bg-gray-200/60 rounded-lg w-32 animate-pulse" />
          <div className="h-56 bg-gray-200/40 rounded-2xl animate-pulse" />
          <div className="h-36 bg-gray-200/40 rounded-2xl animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="h-32 bg-gray-200/40 rounded-2xl animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
      </DashboardLayout>
    );
  }

  const membershipTier = student?.membership_tier || 'free';

  const tierConfig = {
    free: {
      label: 'Free',
      price: null,
      icon: <SettingsIcon className="h-5 w-5 text-gray-500" />,
      iconBg: 'bg-gray-100',
      borderClass: 'border-gray-200/80',
      badgeBg: 'bg-gray-100 text-gray-600',
      innerBg: 'bg-gray-50 border-gray-200',
    },
    pro: {
      label: 'Pro',
      price: '$19/mo',
      icon: <Zap className="h-5 w-5 text-[#E03038]" />,
      iconBg: 'bg-[#E03038]/8',
      borderClass: 'border-[#E03038]/20',
      badgeBg: 'bg-[#E03038]/8 text-[#E03038]',
      innerBg: 'bg-[#E03038]/[0.03] border-[#E03038]/15',
    },
    max: {
      label: 'Max',
      price: '$39/mo',
      icon: <Crown className="h-5 w-5 text-[#d4a843]" />,
      iconBg: 'bg-[#d4a843]/10',
      borderClass: 'border-[#d4a843]/30',
      badgeBg: 'bg-[#d4a843]/10 text-[#d4a843]',
      innerBg: 'bg-[#d4a843]/[0.03] border-[#d4a843]/15',
    },
  };

  const tier = tierConfig[membershipTier as keyof typeof tierConfig] || tierConfig.free;

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0D2137] tracking-tight"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          Settings
        </h1>

        {/* Profile Info */}
        <Card
          className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
          style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.1s' }}
        >
          <CardHeader className="pb-4 px-6 md:px-8 pt-6 md:pt-8">
            <CardTitle className="text-lg flex items-center gap-3 tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D2137]/8">
                <User className="h-5 w-5 text-[#0D2137]" />
              </span>
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 md:px-8 pb-6 md:pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 tracking-tight">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl h-11 border-gray-200 focus:ring-2 focus:ring-[#0D2137]/15 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 tracking-tight">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="rounded-xl h-11 bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certLevel" className="text-sm font-semibold text-gray-700 tracking-tight">Certification Level</Label>
                <select
                  id="certLevel"
                  value={certLevel}
                  onChange={(e) => setCertLevel(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2137]/15 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
                >
                  <option value="EMT">EMT</option>
                  <option value="AEMT">AEMT</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate" className="text-sm font-semibold text-gray-700 tracking-tight">Target Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="rounded-xl h-11 border-gray-200 focus:ring-2 focus:ring-[#0D2137]/15 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card
          className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
          style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.15s' }}
        >
          <CardHeader className="pb-4 px-6 md:px-8 pt-6 md:pt-8">
            <CardTitle className="text-lg flex items-center gap-3 tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <SettingsIcon className="h-5 w-5 text-gray-600" />
              </span>
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 px-6 md:px-8 pb-6 md:pb-8">
            <div className="flex items-center justify-between py-4 border-b border-gray-100/80">
              <div>
                <Label className="text-sm font-semibold text-gray-800 tracking-tight">Default Question Count</Label>
                <p className="text-xs text-gray-500 mt-0.5">Questions per practice session</p>
              </div>
              <select
                value={preferredCount}
                onChange={(e) => setPreferredCount(Number(e.target.value))}
                className="h-10 w-20 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2137]/15 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <Label className="text-sm font-semibold text-gray-800 tracking-tight">Show Rationales Immediately</Label>
                <p className="text-xs text-gray-500 mt-0.5">See correct answers after each question vs. after exam</p>
              </div>
              <button
                role="switch"
                aria-checked={showRationales}
                aria-label="Show rationales immediately"
                onClick={() => setShowRationales(!showRationales)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setShowRationales(!showRationales);
                  }
                }}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:ring-offset-2 ${
                  showRationales
                    ? 'bg-[#0D2137] shadow-sm shadow-[#0D2137]/20'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    showRationales ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Membership */}
        <Card
          className={`rounded-2xl shadow-sm overflow-hidden border ${tier.borderClass} transition-all duration-300`}
          style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.2s' }}
        >
          <CardHeader className="pb-4 px-6 md:px-8 pt-6 md:pt-8">
            <CardTitle className="text-lg flex items-center gap-3 tracking-tight">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.iconBg}`}>
                {tier.icon}
              </span>
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
            <div className={`flex items-center justify-between p-5 rounded-xl border ${tier.innerBg} transition-all duration-300`}>
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="font-semibold text-[#0D2137] tracking-tight">
                    {tier.label}
                    {tier.price && (
                      <span className="text-gray-500 font-normal text-sm ml-1.5">({tier.price})</span>
                    )}
                  </p>
                  {membershipTier !== 'free' && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.badgeBg}`}>
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {membershipTier === 'free'
                    ? 'Upgrade to access the practice question bank'
                    : 'Full access to practice questions and features'}
                </p>
              </div>
              {membershipTier === 'free' ? (
                <Button
                  size="sm"
                  className="bg-[#E03038] hover:bg-[#c72a31] text-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-[#E03038]/15 hover:translate-y-[-1px]"
                >
                  Upgrade
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-xl transition-all duration-300 hover:translate-y-[-1px] ${
                    membershipTier === 'max'
                      ? 'border-[#d4a843] text-[#d4a843] hover:bg-[#d4a843]/8'
                      : 'border-[#E03038] text-[#E03038] hover:bg-[#E03038]/5'
                  }`}
                >
                  Manage
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save / Logout */}
        <div
          className="flex items-center justify-between pt-4 pb-2"
          style={{ animation: 'fadeInUp 0.5s ease-out backwards', animationDelay: '0.25s' }}
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0D2137] hover:bg-[#162d47] text-white rounded-xl px-8 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-[#0D2137]/10 hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            className="text-[#E03038] border-[#E03038]/20 hover:bg-[#E03038]/5 rounded-xl transition-all duration-300 hover:border-[#E03038]/40"
            onClick={signOut}
          >
            Log Out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
