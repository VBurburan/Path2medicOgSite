import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowUp, 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface DashboardViewProps {
  user: any;
  intakeSubmission: any;
  posttestSubmission: any;
  practiceStats: any;
  onNavigate: (tab: string) => void;
}

export function DashboardView({ 
  user, 
  intakeSubmission, 
  posttestSubmission, 
  practiceStats,
  onNavigate 
}: DashboardViewProps) {
  
  const profile = user?.profile || {};
  const name = profile.full_name || user?.user_metadata?.name || 'Student';
  
  // Helper for score colors
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#28a745'; // Success
    if (score >= 80) return '#17a2b8'; // Good
    if (score >= 70) return '#ffc107'; // Warning
    return '#dc3545'; // Danger
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Adequate';
    return 'Study Needed';
  };

  // Domain Data Preparation
  // Prefer posttest data if available, otherwise intake
  const latestSubmission = posttestSubmission || intakeSubmission;
  
  const domainData = React.useMemo(() => {
    if (!latestSubmission?.domain_breakdown) return [];
    
    return Object.entries(latestSubmission.domain_breakdown).map(([key, value]: [string, any]) => {
      const score = value.percentage !== undefined 
        ? value.percentage 
        : (value.correct / value.total) * 100;
      
      return {
        name: key,
        score: Math.round(score),
        fill: getScoreColor(score)
      };
    }).sort((a, b) => a.score - b.score); // Sort by worst first (lowest score)
  }, [latestSubmission]);

  // Next Steps Logic
  const overallScore = latestSubmission?.score_percentage || 0;
  const weakestDomain = domainData[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#1a5f7a]">Welcome back, {name}</h2>
          <p className="text-gray-500 mt-1">Here's your performance overview and what to focus on today.</p>
        </div>
        <div className="flex gap-2">
          {intakeSubmission && <Badge variant="secondary" className="bg-[#1a5f7a]/10 text-[#1a5f7a]">Coaching Student</Badge>}
          <Badge variant="secondary" className="bg-[#d4a843]/10 text-[#d4a843]">Active Member</Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Intake/Latest Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Latest Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {latestSubmission ? (
              <div className="flex flex-col">
                <div className="text-4xl font-bold" style={{ color: getScoreColor(overallScore) }}>
                  {Math.round(overallScore)}%
                </div>
                <div className="text-xs font-medium mt-1 text-gray-500">
                  {getScoreLabel(overallScore)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(latestSubmission.submitted_at).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No assessments yet</div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Improvement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            {posttestSubmission && intakeSubmission ? (
              <div className="flex flex-col">
                <div className="flex items-center text-4xl font-bold text-[#28a745]">
                  <ArrowUp className="h-8 w-8 mr-1" />
                  {Math.round(posttestSubmission.score_percentage - intakeSubmission.score_percentage)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">vs. Intake Exam</div>
              </div>
            ) : (
              <div className="flex flex-col justify-center h-full">
                <span className="text-gray-400 text-sm">Post-test pending</span>
                {intakeSubmission && (
                   <Button variant="link" className="p-0 h-auto text-xs justify-start mt-1">Take Post-Test</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Practice Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Practice Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-4xl font-bold text-[#1a5f7a]">
                {profile.total_questions_answered || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Questions answered</div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-[#1a5f7a] h-1.5 rounded-full" 
                  style={{ width: `${Math.min(((profile.questions_used_this_period || 0) / (profile.questions_limit || 25)) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                <span>{profile.questions_used_this_period || 0} used</span>
                <span>{profile.questions_limit || 25} limit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Next Session */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Next Coaching</CardTitle>
          </CardHeader>
          <CardContent>
            {intakeSubmission?.coaching_session_scheduled ? (
              <div className="flex flex-col">
                <div className="text-lg font-bold text-[#1a5f7a]">
                  {new Date(intakeSubmission.coaching_session_date).toLocaleDateString()}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {new Date(intakeSubmission.coaching_session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={() => onNavigate('coaching')}>
                  View Details
                </Button>
              </div>
            ) : (
              <div className="text-gray-400 text-sm flex flex-col items-start gap-2">
                <span>No session scheduled</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onNavigate('coaching')}>
                  Book Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Domain Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Domain Performance</CardTitle>
            <CardDescription>Based on your most recent assessment. Prioritize the top items (your weakest areas).</CardDescription>
          </CardHeader>
          <CardContent>
            {domainData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={domainData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={150} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Score']}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                      {domainData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No performance data available yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Next Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1a5f7a] flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recommended Actions
          </h3>
          
          {/* Recommendation 1: Weakest Area */}
          {weakestDomain && (
            <Card className="border-l-4 border-l-[#dc3545]">
              <CardContent className="pt-6">
                <h4 className="font-bold text-gray-900 mb-1">Focus: {weakestDomain.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your score is {weakestDomain.score}%. This is your biggest opportunity for improvement.
                </p>
                <Button className="w-full bg-[#dc3545] hover:bg-[#c82333]" onClick={() => onNavigate('practice')}>
                  <Target className="h-4 w-4 mr-2" />
                  Start Focused Drill
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recommendation 2: TEI or General */}
          <Card className="border-l-4 border-l-[#1a5f7a]">
            <CardContent className="pt-6">
              <h4 className="font-bold text-gray-900 mb-1">Quick Practice</h4>
              <p className="text-sm text-gray-600 mb-3">
                Keep your momentum going with a quick 10-question mixed quiz.
              </p>
              <Button className="w-full bg-[#1a5f7a] hover:bg-[#134b61]" onClick={() => onNavigate('practice')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Quick Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
