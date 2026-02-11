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
        <div className="animate-pulse space-y-6 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  const membershipTier = student?.membership_tier || 'free';

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-[#0D2137]">Settings</h1>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-[#1a5f7a]" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certLevel">Certification Level</Label>
                <select
                  id="certLevel"
                  value={certLevel}
                  onChange={(e) => setCertLevel(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
                >
                  <option value="EMT">EMT</option>
                  <option value="AEMT">AEMT</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate">Target Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-gray-500" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Default Question Count</Label>
                <p className="text-xs text-gray-500">Questions per practice session</p>
              </div>
              <select
                value={preferredCount}
                onChange={(e) => setPreferredCount(Number(e.target.value))}
                className="h-9 w-20 rounded-md border border-gray-300 bg-white px-3 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Rationales Immediately</Label>
                <p className="text-xs text-gray-500">See correct answers after each question vs. after exam</p>
              </div>
              <button
                onClick={() => setShowRationales(!showRationales)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showRationales ? 'bg-[#1a5f7a]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    showRationales ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Membership */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#d4a843]" />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-medium text-[#0D2137]">
                  {membershipTier === 'free' ? 'Free' : membershipTier === 'pro' ? 'Pro ($19/mo)' : membershipTier === 'max' ? 'Max ($39/mo)' : membershipTier}
                </p>
                <p className="text-sm text-gray-500">
                  {membershipTier === 'free'
                    ? 'Upgrade to access the practice question bank'
                    : 'Full access to practice questions and features'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {membershipTier === 'free' ? 'Upgrade' : 'Manage'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save / Logout */}
        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0D2137] hover:bg-[#1a3a5c]"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={signOut}
          >
            Log Out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
