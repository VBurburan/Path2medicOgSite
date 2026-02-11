import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Zap, 
  Book, 
  LayoutList, 
  Brain, 
  Activity, 
  Clock,
  CheckCircle,
  Play,
  Target as TargetIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { supabase } from '@/utils/supabaseClient';

interface PracticeViewProps {
  user: any;
  onStartModule: (config: any) => void;
}

export function PracticeView({ user, onStartModule }: PracticeViewProps) {
  const [selectedLevel, setSelectedLevel] = useState(user?.profile?.certification_level || 'EMT');
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // No free tier - everyone has access
  const isFreeTier = false;

  useEffect(() => {
    fetchDomains();
  }, [selectedLevel]);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('domains')
        .select('*')
        .eq('level', selectedLevel)
        .order('display_order', { ascending: true });
      
      if (data) setDomains(data);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const questionTypes = [
    { code: 'MC', name: 'Multiple Choice', desc: 'Traditional 4-option questions', locked: false },
    { code: 'MR', name: 'Multiple Response', desc: 'Select all that apply', locked: false },
    { code: 'BL', name: 'Build-a-List', desc: 'Sequence items in order', locked: false },
    { code: 'DD', name: 'Drag-and-Drop', desc: 'Match or categorize items', locked: false },
    { code: 'OB', name: 'Options Box', desc: 'Fill in the blanks', locked: false },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Level Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a5f7a]">Practice Modules</h2>
          <p className="text-gray-500">Select a module to start your training session.</p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-gray-200 flex">
          {['EMT', 'AEMT', 'Paramedic'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedLevel === level 
                  ? 'bg-[#1a5f7a] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-[#1a5f7a]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Quiz */}
        <Card className="bg-gradient-to-br from-[#1a5f7a] to-[#0D2137] text-white border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-[#d4a843]" />
              </div>
              <Badge variant="outline" className="text-white border-white/20 bg-white/5">Popular</Badge>
            </div>
            <h3 className="text-lg font-bold mb-1">Quick Quiz</h3>
            <p className="text-white/80 text-sm mb-4">10 random questions mixed from all domains.</p>
            <Button 
              className="w-full bg-[#d4a843] hover:bg-[#b8913a] text-[#0D2137] font-semibold border-none"
              onClick={() => onStartModule({ mode: 'random', count: 10, level: selectedLevel })}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Weak Area Drill */}
        <Card className="border-l-4 border-l-[#dc3545]">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <TargetIcon className="h-6 w-6 text-[#dc3545]" />
              </div>
              <Badge variant="secondary" className="bg-[#dc3545]/10 text-[#dc3545]">Smart</Badge>
            </div>
            <h3 className="text-lg font-bold mb-1 text-gray-900">Weak Area Drill</h3>
            <p className="text-gray-500 text-sm mb-4">Target your lowest scoring domains automatically.</p>
            <Button 
              variant="outline"
              className="w-full border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545]/5"
              onClick={() => onStartModule({ mode: 'weak_area', count: 15, level: selectedLevel })}
            >
              Start Drill
            </Button>
          </CardContent>
        </Card>

        {/* Full Exam */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-[#1a5f7a]" />
              </div>
              <Badge variant="secondary">Simulation</Badge>
            </div>
            <h3 className="text-lg font-bold mb-1 text-gray-900">Full Practice Exam</h3>
            <p className="text-gray-500 text-sm mb-4">
              {selectedLevel === 'EMT' ? '85' : selectedLevel === 'AEMT' ? '100' : '100'} questions, timed, NREMT weighted.
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => onStartModule({ mode: 'full_exam', count: selectedLevel === 'EMT' ? 85 : 100, level: selectedLevel })}
            >
              Start Simulation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Domain Modules */}
      <div>
        <h3 className="text-xl font-bold text-[#1a5f7a] mb-4 flex items-center">
          <Book className="h-5 w-5 mr-2" />
          Study by Domain
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-[#1a5f7a]">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant="secondary">{domain.percentage_min}-{domain.percentage_max}% of Exam</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{domain.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mastery</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-1.5" />
                  <Button 
                    className="w-full mt-2" 
                    variant="secondary"
                    onClick={() => onStartModule({ mode: 'domain', domainId: domain.id, count: 10, level: selectedLevel })}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {loading && (
            <div className="col-span-full py-8 text-center text-gray-500">Loading domains...</div>
          )}
        </div>
      </div>

      {/* TEI Modules */}
      <div>
        <h3 className="text-xl font-bold text-[#1a5f7a] mb-4 flex items-center">
          <LayoutList className="h-5 w-5 mr-2" />
          Study by Question Type (TEI)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {questionTypes.map((type) => (
            <Card key={type.code} className={`relative ${type.locked ? 'opacity-75 bg-gray-50' : ''}`}>
              {type.locked && (
                <div className="absolute top-2 right-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              )}
              <CardContent className="pt-6">
                <div className="mb-2 font-bold text-[#1a5f7a] text-xl">{type.code}</div>
                <h4 className="font-semibold text-sm mb-1">{type.name}</h4>
                <p className="text-xs text-gray-500 mb-4 h-8">{type.desc}</p>
                <Button 
                  size="sm" 
                  className="w-full" 
                  disabled={type.locked}
                  variant={type.locked ? "outline" : "default"}
                  onClick={() => onStartModule({ mode: 'type', typeCode: type.code, count: 10, level: selectedLevel })}
                >
                  {type.locked ? 'Locked' : 'Practice'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
