import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Lock } from 'lucide-react';

const QUESTION_COUNTS = [10, 25, 50];
const FOCUS_OPTIONS = ['All Domains', 'Weak Areas'];
const TYPE_OPTIONS = ['All Types', 'MC Only', 'TEI Only'];

export default function PracticePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<any[]>([]);

  // Config state
  const [questionCount, setQuestionCount] = useState(25);
  const [focus, setFocus] = useState('All Domains');
  const [questionType, setQuestionType] = useState('All Types');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [studentRes, domainsRes] = await Promise.all([
          supabase
            .from('students')
            .select('membership_tier, certification_level')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('domains')
            .select('id, name')
            .order('display_order', { ascending: true }),
        ]);

        if (studentRes.data) setStudent(studentRes.data);
        if (domainsRes.data) setDomains(domainsRes.data);
      } catch (err) {
        console.error('Practice fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const isSubscribed = student?.membership_tier === 'pro' || student?.membership_tier === 'max';
  const certLevel = student?.certification_level || 'EMT';

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set('count', String(questionCount));
    params.set('level', certLevel);

    if (focus === 'Weak Areas') {
      params.set('mode', 'weak_area');
    } else if (focus !== 'All Domains') {
      // It's a specific domain
      const domain = domains.find((d) => d.name === focus);
      if (domain) {
        params.set('mode', 'domain');
        params.set('domainId', domain.id);
      }
    } else {
      params.set('mode', 'random');
    }

    if (questionType === 'MC Only') {
      params.set('typeFilter', 'MC');
    } else if (questionType === 'TEI Only') {
      params.set('typeFilter', 'TEI');
    }

    navigate(`/practice/session?${params.toString()}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  // Upsell for non-subscribers
  if (!isSubscribed) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold text-[#0D2137]">Practice</h1>
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Lock className="h-12 w-12 text-gray-300 mx-auto" />
              <h2 className="text-xl font-semibold text-[#0D2137]">
                Practice Questions Require a Subscription
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Access our full question bank with detailed rationales and performance tracking.
                Choose a plan that works for you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
                <div className="border rounded-xl p-6 text-center">
                  <p className="text-sm font-medium text-gray-500">Pro</p>
                  <p className="text-3xl font-bold text-[#0D2137] mt-1">$19<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  <p className="text-sm text-gray-500 mt-2">Access to practice question bank</p>
                  <Button className="w-full mt-4 bg-[#1a5f7a] hover:bg-[#134b61]">
                    Subscribe
                  </Button>
                </div>
                <div className="border-2 border-[#d4a843] rounded-xl p-6 text-center">
                  <p className="text-sm font-medium text-[#d4a843]">Max</p>
                  <p className="text-3xl font-bold text-[#0D2137] mt-1">$39<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  <p className="text-sm text-gray-500 mt-2">Unlimited questions + priority support</p>
                  <Button className="w-full mt-4 bg-[#d4a843] hover:bg-[#b8913a] text-[#0D2137]">
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Focus options including domains
  const focusOptions = [
    ...FOCUS_OPTIONS,
    ...domains.map((d) => d.name),
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-[#0D2137]">Practice</h1>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 text-[#1a5f7a]" />
              <p className="text-gray-600 text-sm">Configure your practice session and start.</p>
            </div>

            {/* 3 Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Questions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
                >
                  {QUESTION_COUNTS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Focus */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Focus</label>
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
                >
                  {focusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-[#0D2137] hover:bg-[#1a3a5c] h-12 text-base font-semibold"
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
