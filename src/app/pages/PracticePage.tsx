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
          <div className="h-8 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-100 rounded w-64" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  // Upsell for non-subscribers
  if (!isSubscribed) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0D2137]">Practice</h1>
            <p className="text-gray-500 text-sm mt-1">
              Build confidence with targeted practice sessions.
            </p>
          </div>

          <Card className="rounded-xl border-gray-200/60 shadow-sm overflow-hidden">
            <CardContent className="py-14 px-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#f5f6f8] flex items-center justify-center mx-auto">
                <Lock className="h-7 w-7 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#0D2137]">
                Practice Questions Require a Subscription
              </h2>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Access our full question bank with detailed rationales and performance tracking.
                Choose a plan that works for you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto pt-4">
                {/* Pro Card */}
                <div className="relative border border-gray-200 rounded-xl p-6 text-center bg-white transition-shadow hover:shadow-md">
                  <p className="text-xs font-semibold tracking-wider uppercase text-gray-500">Pro</p>
                  <p className="text-3xl font-bold text-[#0D2137] mt-2">
                    $19<span className="text-sm font-normal text-gray-400">/mo</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    Access to practice question bank with rationales
                  </p>
                  <Button className="w-full mt-5 bg-[#0D2137] hover:bg-[#162d47] text-white font-medium h-10">
                    Subscribe
                  </Button>
                </div>

                {/* Max Card */}
                <div className="relative border-2 border-[#d4a843] rounded-xl p-6 text-center bg-white transition-shadow hover:shadow-md">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4a843] text-[#0D2137] text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full">
                    Best Value
                  </span>
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#d4a843] mt-1">Max</p>
                  <p className="text-3xl font-bold text-[#0D2137] mt-2">
                    $39<span className="text-sm font-normal text-gray-400">/mo</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    Unlimited questions + priority support
                  </p>
                  <Button className="w-full mt-5 bg-[#d4a843] hover:bg-[#b8913a] text-[#0D2137] font-medium h-10">
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
        <div>
          <h1 className="text-2xl font-bold text-[#0D2137]">Practice</h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure your session below and start practicing.
          </p>
        </div>

        <Card className="rounded-xl border-gray-200/60 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E03038]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-[18px] w-[18px] text-[#E03038]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0D2137]">Session Configuration</p>
                <p className="text-xs text-gray-500">
                  Choose how many questions, your focus area, and question type.
                </p>
              </div>
            </div>

            {/* 3 Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Questions */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:border-transparent transition-shadow"
                >
                  {QUESTION_COUNTS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Focus */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Focus</label>
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:border-transparent transition-shadow"
                >
                  {focusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:border-transparent transition-shadow"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-[#0D2137] hover:bg-[#162d47] h-12 text-base font-semibold rounded-lg transition-colors"
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
