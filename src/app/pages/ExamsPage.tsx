import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle, Clock, AlertCircle, Play, FileText } from 'lucide-react';

interface ExamAssignment {
  id: string;
  exam_type: string;
  certification_level: string;
  exam_file_url: string | null;
  exam_id: string | null;
  exam_version: string;
  status: 'available' | 'in_progress' | 'submitted' | 'graded';
  assigned_at: string;
  started_at: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  score_percentage: number | null;
  notes: string | null;
  total_questions: number | null;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string; borderColor: string; iconBg: string; glowColor: string }> = {
  available: {
    icon: <Play className="h-3.5 w-3.5" />,
    label: 'Available — Not Yet Started',
    color: 'text-[#0D2137]',
    bgColor: 'bg-blue-50',
    borderColor: 'border-l-[#0D2137]',
    iconBg: 'bg-[#0D2137]/10 text-[#0D2137]',
    glowColor: 'rgba(13, 33, 55, 0.06)',
  },
  in_progress: {
    icon: <Clock className="h-3.5 w-3.5" />,
    label: 'In Progress',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-l-amber-500',
    iconBg: 'bg-amber-100 text-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.06)',
  },
  submitted: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    label: 'Submitted — Awaiting Review',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-l-gray-400',
    iconBg: 'bg-gray-100 text-gray-500',
    glowColor: 'rgba(107, 114, 128, 0.04)',
  },
  graded: {
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: 'Graded',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-l-green-500',
    iconBg: 'bg-green-100 text-green-600',
    glowColor: 'rgba(22, 163, 74, 0.06)',
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function examTitle(exam: ExamAssignment) {
  const type = exam.exam_type === 'intake' ? 'Intake Exam' : 'Post-Test';
  const version = exam.exam_version && exam.exam_version !== 'v1' ? ` ${exam.exam_version}` : '';
  const qCount = exam.total_questions ? ` (${exam.total_questions} Questions)` : '';
  return `${exam.certification_level} ${type}${version}${qCount}`;
}

function scoreColor(score: number): string {
  if (score >= 90) return 'text-[#28a745]';
  if (score >= 80) return 'text-[#17a2b8]';
  if (score >= 70) return 'text-[#ffc107]';
  return 'text-[#dc3545]';
}

function scoreBgColor(score: number): string {
  if (score >= 90) return 'bg-[#28a745]/8';
  if (score >= 80) return 'bg-[#17a2b8]/8';
  if (score >= 70) return 'bg-[#ffc107]/8';
  return 'bg-[#dc3545]/8';
}

export default function ExamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);

  // Also pull from intake_submissions / posttest_submissions for historical exams
  const [historicalExams, setHistoricalExams] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchExams = async () => {
      try {
        const [assignRes, intakeRes, posttestRes] = await Promise.all([
          supabase
            .from('exam_assignments')
            .select('*')
            .eq('student_email', user.email!)
            .order('assigned_at', { ascending: false }),
          supabase
            .from('intake_submissions')
            .select('*')
            .eq('student_email', user.email!)
            .order('submitted_at', { ascending: false }),
          supabase
            .from('posttest_submissions')
            .select('*')
            .eq('student_email', user.email!)
            .order('submitted_at', { ascending: false }),
        ]);

        if (assignRes.data) setAssignments(assignRes.data);

        // Build historical list from submissions not linked to assignments
        const historical: any[] = [];
        const assignedSubmissionIds = new Set(
          (assignRes.data || []).filter(a => a.submission_id).map(a => a.submission_id)
        );

        (intakeRes.data || []).forEach((sub) => {
          if (!assignedSubmissionIds.has(sub.id)) {
            historical.push({
              id: sub.id,
              type: 'intake',
              certification_level: sub.certification_level || 'EMT',
              status: sub.score_percentage != null || sub.score_percent != null ? 'graded' : 'submitted',
              submitted_at: sub.submitted_at,
              score_percentage: sub.score_percentage ?? sub.score_percent ?? sub.score,
              total_questions: sub.total_questions,
            });
          }
        });

        (posttestRes.data || []).forEach((sub) => {
          if (!assignedSubmissionIds.has(sub.id)) {
            historical.push({
              id: sub.id,
              type: 'posttest',
              certification_level: sub.certification_level || 'EMT',
              status: sub.score_percentage != null || sub.score_percent != null ? 'graded' : 'submitted',
              submitted_at: sub.submitted_at,
              score_percentage: sub.score_percentage ?? sub.score_percent ?? sub.score,
              total_questions: sub.total_questions,
              exam_id: sub.exam_id,
            });
          }
        });

        setHistoricalExams(historical);
      } catch (err) {
        console.error('Error fetching exams', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user]);

  const handleStartExam = (exam: ExamAssignment) => {
    // If there's a direct exam file URL, open it
    if (exam.exam_file_url) {
      window.open(exam.exam_file_url, '_blank');
      return;
    }

    // Route to the appropriate exam page
    if (exam.exam_type === 'intake') {
      navigate(`/exam/intake/${exam.certification_level.toLowerCase()}`);
    } else if (exam.exam_id) {
      navigate(`/exam/posttest/${exam.exam_id}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-5 max-w-3xl">
          <div className="h-8 bg-gray-200/60 rounded-lg w-40 animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200/40 rounded-2xl animate-pulse"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const allEmpty = assignments.length === 0 && historicalExams.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-3xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <h1
          className="text-2xl md:text-3xl font-bold text-[#0D2137] tracking-tight"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          My Exams
        </h1>

        {allEmpty && (
          <Card
            className="rounded-2xl border-gray-200/50 shadow-sm overflow-hidden"
            style={{ animation: 'fadeInUp 0.6s ease-out backwards', animationDelay: '0.1s' }}
          >
            <CardContent className="py-20 text-center">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#f5f6f8] flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-300" />
                </div>
              </div>
              <p className="text-gray-700 font-semibold text-lg tracking-tight">No exams assigned yet</p>
              <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
                When you purchase a coaching session, your exams will appear here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Assigned exams */}
        {assignments.map((exam, idx) => {
          const config = statusConfig[exam.status] || statusConfig.available;
          return (
            <Card
              key={exam.id}
              className={`overflow-hidden rounded-2xl border-gray-200/50 shadow-sm border-l-4 ${config.borderColor} transition-all duration-300 hover:shadow-md hover:translate-y-[-1px] group`}
              style={{
                animation: 'fadeInUp 0.5s ease-out backwards',
                animationDelay: `${0.1 + idx * 0.06}s`,
              }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#0D2137] tracking-tight group-hover:text-[#0D2137]/90 transition-colors duration-300">
                      {examTitle(exam)}
                    </h3>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.iconBg} transition-all duration-300`}>
                        {config.icon}
                      </div>
                      <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0 text-xs font-medium px-2.5 py-0.5`}>
                        {exam.status === 'graded' && exam.score_percentage != null
                          ? `Graded — ${Math.round(exam.score_percentage)}%`
                          : config.label}
                      </Badge>
                      {exam.status === 'graded' && exam.score_percentage != null && (
                        <span className={`text-lg font-bold ${scoreColor(exam.score_percentage)} px-2 py-0.5 rounded-lg ${scoreBgColor(exam.score_percentage)}`}>
                          {Math.round(exam.score_percentage)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                      {exam.status === 'available' && `Issued: ${formatDate(exam.assigned_at)}`}
                      {exam.status === 'in_progress' && `Started: ${formatDate(exam.started_at)}`}
                      {exam.status === 'submitted' && `Submitted: ${formatDate(exam.submitted_at)}`}
                      {exam.status === 'graded' && `Submitted: ${formatDate(exam.submitted_at)}`}
                    </p>
                    {exam.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic leading-relaxed">Note: {exam.notes}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {exam.status === 'available' && (
                      <Button
                        onClick={() => handleStartExam(exam)}
                        className="bg-[#E03038] hover:bg-[#c52830] text-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-[#E03038]/15 hover:translate-y-[-1px]"
                      >
                        Start Exam
                      </Button>
                    )}
                    {exam.status === 'in_progress' && (
                      <Button
                        onClick={() => handleStartExam(exam)}
                        variant="outline"
                        className="border-[#E03038] text-[#E03038] hover:bg-[#E03038]/5 transition-all duration-300 hover:translate-y-[-1px]"
                      >
                        Resume Exam
                      </Button>
                    )}
                    {exam.status === 'submitted' && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 italic font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        Awaiting review
                      </span>
                    )}
                    {exam.status === 'graded' && (
                      <Button
                        onClick={() => navigate('/results')}
                        variant="outline"
                        className="border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137]/5 transition-all duration-300 hover:translate-y-[-1px]"
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Historical exams from submissions */}
        {historicalExams.map((exam, idx) => {
          const isGraded = exam.status === 'graded';
          const config = statusConfig[exam.status] || statusConfig.submitted;
          const title = `${exam.certification_level} ${exam.type === 'intake' ? 'Intake Exam' : 'Post-Test'}${exam.total_questions ? ` (${exam.total_questions} Questions)` : ''}`;

          return (
            <Card
              key={exam.id}
              className={`overflow-hidden rounded-2xl border-gray-200/50 shadow-sm border-l-4 ${config.borderColor} transition-all duration-300 hover:shadow-md hover:translate-y-[-1px] group`}
              style={{
                animation: 'fadeInUp 0.5s ease-out backwards',
                animationDelay: `${0.1 + (assignments.length + idx) * 0.06}s`,
              }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#0D2137] tracking-tight group-hover:text-[#0D2137]/90 transition-colors duration-300">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.iconBg} transition-all duration-300`}>
                        {config.icon}
                      </div>
                      <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0 text-xs font-medium px-2.5 py-0.5`}>
                        {isGraded && exam.score_percentage != null
                          ? `Graded — ${Math.round(Number(exam.score_percentage))}%`
                          : config.label}
                      </Badge>
                      {isGraded && exam.score_percentage != null && (
                        <span className={`text-lg font-bold ${scoreColor(Number(exam.score_percentage))} px-2 py-0.5 rounded-lg ${scoreBgColor(Number(exam.score_percentage))}`}>
                          {Math.round(Number(exam.score_percentage))}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                      Submitted: {formatDate(exam.submitted_at)}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {isGraded && (
                      <Button
                        onClick={() => navigate('/results')}
                        variant="outline"
                        className="border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137]/5 transition-all duration-300 hover:translate-y-[-1px]"
                      >
                        View Results
                      </Button>
                    )}
                    {!isGraded && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 italic font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        Awaiting review
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
