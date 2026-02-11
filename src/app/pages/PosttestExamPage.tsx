import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2 } from 'lucide-react';

interface ExamQuestion {
  question_number: number;
  question_text: string;
  options: string[];
  domain?: string;
  cj_step?: string;
}

export default function PosttestExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const [studentEmail, setStudentEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [startTime] = useState(Date.now());
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const questionsPerPage = 10;

  useEffect(() => {
    if (started) {
      loadQuestions();
    }
  }, [started]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      // Try to load custom post-test questions linked to this exam ID
      const { data, error: fetchError } = await supabase
        .from('exam_answer_keys')
        .select('question_number, question_text, options, domain, cj_step')
        .eq('exam_id', examId)
        .order('question_number', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setQuestions(data as ExamQuestion[]);
      } else {
        // Generate placeholder questions for the post-test
        const placeholders: ExamQuestion[] = [];
        for (let i = 1; i <= 30; i++) {
          placeholders.push({
            question_number: i,
            question_text: `Post-test Question ${i}`,
            options: ['A', 'B', 'C', 'D'],
          });
        }
        setQuestions(placeholders);
      }
    } catch {
      setError('Failed to load exam. Please check your link and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    if (!studentEmail || !studentName) {
      setError('Please enter your name and email to begin.');
      return;
    }
    setError('');
    setStarted(true);
  };

  const handleAnswer = (questionNum: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionNum.toString()]: answer }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.question_number.toString()]);
    if (unanswered.length > 0) {
      const confirm = window.confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`);
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      const submission = {
        student_email: studentEmail,
        student_name: studentName,
        exam_id: examId,
        intake_submission_id: intakeId,
        answers: answers,
        total_questions: questions.length,
        submitted_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
      };

      const { error: submitError } = await supabase
        .from('posttest_submissions')
        .insert(submission);

      if (submitError) throw submitError;

      setSubmitted(true);
    } catch {
      setError('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const paginatedQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle2 className="h-16 w-16 text-[#28a745] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#0D2137] mb-2">Post-Test Submitted</h2>
              <p className="text-[#6c757d] mb-4">
                Thank you, {studentName}. Your post-test has been submitted for grading and comparison with your intake results.
              </p>
              <p className="text-sm text-[#6c757d]">
                You answered {answeredCount} of {questions.length} questions. Your coach will review the results and follow up with you.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!started) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-[#0D2137]" />
                <Badge className="bg-[#d4a843] text-white">Post-Coaching</Badge>
              </div>
              <CardTitle className="text-2xl text-[#0D2137]">Post-Test Assessment</CardTitle>
              <p className="text-[#6c757d] mt-2">
                This post-test measures your improvement after your coaching session. The questions target the specific areas identified in your intake assessment.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dee2e6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2137]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">Email Address</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dee2e6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2137]"
                  placeholder="your.email@example.com"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-[#dc3545] text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button onClick={handleStartExam} className="w-full bg-[#0D2137] hover:bg-[#0D2137]">
                Begin Post-Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0D2137]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="sticky top-20 z-40 bg-white border-b border-[#dee2e6] shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-[#d4a843] text-white">Post-Test</Badge>
              <span className="text-sm text-[#6c757d]">{answeredCount} / {questions.length} answered</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#6c757d]" />
              <span className="text-sm text-[#6c757d]">{Math.round((Date.now() - startTime) / 60000)} min</span>
            </div>
          </div>
          <div className="h-1 bg-gray-200">
            <div className="h-1 bg-[#d4a843] transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {paginatedQuestions.map((q) => (
            <Card key={q.question_number}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0D2137] text-white flex items-center justify-center text-sm font-medium">{q.question_number}</span>
                  <p className="text-[#333] leading-relaxed">{q.question_text}</p>
                </div>
                <div className="ml-11 space-y-2">
                  {q.options.map((option, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    const selected = answers[q.question_number.toString()] === label;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(q.question_number, label)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                          selected ? 'border-[#d4a843] bg-[#d4a843]/10 text-[#0D2137]' : 'border-[#dee2e6] hover:border-[#d4a843]/50 text-[#333]'
                        }`}
                      >
                        <span className="font-medium mr-2">{label}.</span>{option}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>Previous</Button>
            <span className="text-sm text-[#6c757d]">Page {currentPage + 1} of {totalPages}</span>
            {currentPage < totalPages - 1 ? (
              <Button onClick={() => setCurrentPage(p => p + 1)} className="bg-[#0D2137] hover:bg-[#0D2137]">Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="bg-[#E03038] hover:bg-[#c52830]">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</> : 'Submit Post-Test'}
              </Button>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-[#dc3545] text-sm justify-center">
              <AlertCircle className="h-4 w-4" />{error}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
