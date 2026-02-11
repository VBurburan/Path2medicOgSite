import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Lock, Check, Crown, Zap } from 'lucide-react';

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
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200/60 rounded-lg w-40 animate-pulse" />
            <div className="h-4 bg-gray-100/80 rounded w-64 animate-pulse" />
          </div>
          <div className="h-72 bg-gray-200/40 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  // Upsell for non-subscribers
  if (!isSubscribed) {
    const proFeatures = [
      'Full question bank access',
      'Detailed answer rationales',
      'Domain performance tracking',
      'Practice session history',
    ];

    const maxFeatures = [
      'Everything in Pro',
      'Unlimited practice sessions',
      'Priority email support',
      'Early access to new content',
    ];

    return (
      <DashboardLayout>
        <div className="max-w-2xl space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137] tracking-tight">Practice</h1>
            <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
              Build confidence with targeted practice sessions.
            </p>
          </div>

          <Card
            className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
            style={{ animation: 'fadeInUp 0.6s ease-out backwards', animationDelay: '0.1s' }}
          >
            <CardContent className="py-16 px-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#f5f6f8] flex items-center justify-center mx-auto">
                <Lock className="h-7 w-7 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0D2137] tracking-tight">
                  Practice Questions Require a Subscription
                </h2>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed mt-2">
                  Access our full question bank with detailed rationales and performance tracking.
                  Choose a plan that works for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto pt-4">
                {/* Pro Card */}
                <div className="relative border border-gray-200/80 rounded-2xl p-6 text-center bg-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] hover:border-gray-300/80 group">
                  <div className="w-10 h-10 rounded-xl bg-[#0D2137]/8 flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-5 w-5 text-[#0D2137]" />
                  </div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-gray-500">Pro</p>
                  <p className="text-3xl font-bold text-[#0D2137] mt-2 tracking-tight">
                    $19<span className="text-sm font-normal text-gray-400">/mo</span>
                  </p>
                  <ul className="text-left mt-5 space-y-2.5">
                    {proFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-[#0D2137] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-[#0D2137] hover:bg-[#162d47] text-white font-medium h-11 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-[#0D2137]/10">
                    Subscribe
                  </Button>
                </div>

                {/* Max Card */}
                <div className="relative border-2 border-[#d4a843]/60 rounded-2xl p-6 text-center bg-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] hover:border-[#d4a843] group overflow-hidden">
                  {/* Best Value badge */}
                  <span className="absolute -top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4a843] to-[#c49a3a] text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1 rounded-b-lg shadow-sm">
                    Best Value
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#d4a843]/10 flex items-center justify-center mx-auto mb-3 mt-3">
                    <Crown className="h-5 w-5 text-[#d4a843]" />
                  </div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#d4a843]">Max</p>
                  <p className="text-3xl font-bold text-[#0D2137] mt-2 tracking-tight">
                    $39<span className="text-sm font-normal text-gray-400">/mo</span>
                  </p>
                  <ul className="text-left mt-5 space-y-2.5">
                    {maxFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-[#d4a843] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-[#d4a843] hover:bg-[#b8913a] text-white font-medium h-11 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-[#d4a843]/15">
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
      <div className="max-w-2xl space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137] tracking-tight">Practice</h1>
          <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
            Configure your session below and start practicing.
          </p>
        </div>

        <Card
          className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
          style={{ animation: 'fadeInUp 0.6s ease-out backwards', animationDelay: '0.1s' }}
        >
          {/* Subtle top accent */}
          <div className="h-1 bg-gradient-to-r from-[#E03038] via-[#E03038]/60 to-transparent" />

          <CardContent className="p-6 md:p-8 space-y-7">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E03038]/8 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-[18px] w-[18px] text-[#E03038]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D2137] tracking-tight">Session Configuration</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose how many questions, your focus area, and question type.
                </p>
              </div>
            </div>

            {/* 3 Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Questions */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-tight">Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2137]/20 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
                >
                  {QUESTION_COUNTS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Focus */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-tight">Focus</label>
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2137]/20 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
                >
                  {focusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-tight">Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D2137]/20 focus:border-[#0D2137] transition-all duration-300 hover:border-gray-300"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-[#0D2137] hover:bg-[#162d47] h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#0D2137]/10 hover:translate-y-[-1px] active:translate-y-0"
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
