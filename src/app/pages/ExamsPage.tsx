import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle, Clock, AlertCircle, Play } from 'lucide-react';

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

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  available: {
    icon: <Play className="h-4 w-4" />,
    label: 'Available — Not Yet Started',
    color: 'text-[#1a5f7a]',
    bgColor: 'bg-blue-50',
  },
  in_progress: {
    icon: <Clock className="h-4 w-4" />,
    label: 'In Progress',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  submitted: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Submitted — Awaiting Review',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  graded: {
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Graded',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
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
        <div className="animate-pulse space-y-6 max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-40" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const allEmpty = assignments.length === 0 && historicalExams.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-[#0D2137]">My Exams</h1>

        {allEmpty && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No exams have been assigned yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                When you purchase a coaching session, your exams will appear here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Assigned exams */}
        {assignments.map((exam) => {
          const config = statusConfig[exam.status] || statusConfig.available;
          return (
            <Card key={exam.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-[#0D2137]">
                      {examTitle(exam)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0`}>
                        <span className="mr-1">{config.icon}</span>
                        {exam.status === 'graded' && exam.score_percentage != null
                          ? `Graded — ${Math.round(exam.score_percentage)}%`
                          : config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {exam.status === 'available' && `Issued: ${formatDate(exam.assigned_at)}`}
                      {exam.status === 'in_progress' && `Started: ${formatDate(exam.started_at)}`}
                      {exam.status === 'submitted' && `Submitted: ${formatDate(exam.submitted_at)}`}
                      {exam.status === 'graded' && `Submitted: ${formatDate(exam.submitted_at)}`}
                    </p>
                    {exam.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">Note: {exam.notes}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {exam.status === 'available' && (
                      <Button
                        onClick={() => handleStartExam(exam)}
                        className="bg-[#1a5f7a] hover:bg-[#134b61]"
                      >
                        Start Exam
                      </Button>
                    )}
                    {exam.status === 'in_progress' && (
                      <Button
                        onClick={() => handleStartExam(exam)}
                        variant="outline"
                        className="border-[#1a5f7a] text-[#1a5f7a]"
                      >
                        Resume Exam
                      </Button>
                    )}
                    {exam.status === 'submitted' && (
                      <span className="text-sm text-gray-400">Awaiting review</span>
                    )}
                    {exam.status === 'graded' && (
                      <Button
                        onClick={() => navigate('/results')}
                        variant="outline"
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
        {historicalExams.map((exam) => {
          const isGraded = exam.status === 'graded';
          const config = statusConfig[exam.status] || statusConfig.submitted;
          const title = `${exam.certification_level} ${exam.type === 'intake' ? 'Intake Exam' : 'Post-Test'}${exam.total_questions ? ` (${exam.total_questions} Questions)` : ''}`;

          return (
            <Card key={exam.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-[#0D2137]">{title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0`}>
                        <span className="mr-1">{config.icon}</span>
                        {isGraded && exam.score_percentage != null
                          ? `Graded — ${Math.round(Number(exam.score_percentage))}%`
                          : config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      Submitted: {formatDate(exam.submitted_at)}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {isGraded && (
                      <Button onClick={() => navigate('/results')} variant="outline">
                        View Results
                      </Button>
                    )}
                    {!isGraded && (
                      <span className="text-sm text-gray-400">Awaiting review</span>
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
