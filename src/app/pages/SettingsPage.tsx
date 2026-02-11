import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { User, CreditCard, Settings as SettingsIcon } from 'lucide-react';

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
        <div className="animate-pulse space-y-8 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-48 bg-gray-100 rounded-xl" />
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="h-28 bg-gray-100 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  const membershipTier = student?.membership_tier || 'free';

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold text-[#0D2137]">Settings</h1>

        {/* Profile Info */}
        <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D2137]/10">
                <User className="h-5 w-5 text-[#0D2137]" />
              </span>
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-lg border-gray-300 focus:ring-[#0D2137] focus:border-[#0D2137]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="rounded-lg bg-gray-50 text-gray-500 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certLevel" className="text-sm font-medium text-gray-700">Certification Level</Label>
                <select
                  id="certLevel"
                  value={certLevel}
                  onChange={(e) => setCertLevel(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:border-[#0D2137]"
                >
                  <option value="EMT">EMT</option>
                  <option value="AEMT">AEMT</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate" className="text-sm font-medium text-gray-700">Target Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="rounded-lg border-gray-300 focus:ring-[#0D2137] focus:border-[#0D2137]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <SettingsIcon className="h-5 w-5 text-gray-600" />
              </span>
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <Label className="text-sm font-medium text-gray-800">Default Question Count</Label>
                <p className="text-xs text-gray-500 mt-0.5">Questions per practice session</p>
              </div>
              <select
                value={preferredCount}
                onChange={(e) => setPreferredCount(Number(e.target.value))}
                className="h-9 w-20 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:border-[#0D2137]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <Label className="text-sm font-medium text-gray-800">Show Rationales Immediately</Label>
                <p className="text-xs text-gray-500 mt-0.5">See correct answers after each question vs. after exam</p>
              </div>
              <button
                onClick={() => setShowRationales(!showRationales)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showRationales ? 'bg-[#0D2137]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    showRationales ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Membership */}
        <Card className={`rounded-xl shadow-sm overflow-hidden ${
          membershipTier === 'free'
            ? 'border border-gray-200'
            : 'border border-[#d4a843]'
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                membershipTier === 'free' ? 'bg-gray-100' : 'bg-[#d4a843]/10'
              }`}>
                <CreditCard className={`h-5 w-5 ${
                  membershipTier === 'free' ? 'text-gray-500' : 'text-[#d4a843]'
                }`} />
              </span>
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              membershipTier === 'free'
                ? 'bg-gray-50 border border-gray-200'
                : 'bg-[#d4a843]/5 border border-[#d4a843]/30'
            }`}>
              <div>
                <p className="font-semibold text-[#0D2137]">
                  {membershipTier === 'free' ? 'Free' : membershipTier === 'pro' ? 'Pro ($19/mo)' : membershipTier === 'max' ? 'Max ($39/mo)' : membershipTier}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {membershipTier === 'free'
                    ? 'Upgrade to access the practice question bank'
                    : 'Full access to practice questions and features'}
                </p>
              </div>
              {membershipTier === 'free' ? (
                <Button
                  size="sm"
                  className="bg-[#E03038] hover:bg-[#c72a31] text-white rounded-lg shadow-sm"
                >
                  Upgrade
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#d4a843] text-[#d4a843] hover:bg-[#d4a843]/10 rounded-lg"
                >
                  Manage
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save / Logout */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0D2137] hover:bg-[#162d47] text-white rounded-lg px-6 shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            className="text-[#E03038] border-[#E03038]/20 hover:bg-[#E03038]/5 rounded-lg"
            onClick={signOut}
          >
            Log Out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
