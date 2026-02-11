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

export default function IntakeExamPage() {
  const { level } = useParams<{ level: string }>();
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
  const questionsPerPage = 10;

  const certLevel = level?.toLowerCase() === 'paramedic' ? 'Paramedic' : level?.toLowerCase() === 'aemt' ? 'AEMT' : 'EMT';
  const totalQuestions = certLevel === 'Paramedic' ? 100 : certLevel === 'AEMT' ? 100 : 85;

  useEffect(() => {
    if (started) {
      loadQuestions();
    }
  }, [started]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('exam_answer_keys')
        .select('question_number, question_text, options, domain, cj_step')
        .eq('certification_level', certLevel)
        .eq('exam_type', 'intake')
        .order('question_number', { ascending: true })
        .limit(totalQuestions);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setQuestions(data as ExamQuestion[]);
      } else {
        // Fallback: generate numbered placeholder questions
        const placeholders: ExamQuestion[] = [];
        for (let i = 1; i <= totalQuestions; i++) {
          placeholders.push({
            question_number: i,
            question_text: `Question ${i}`,
            options: ['A', 'B', 'C', 'D'],
          });
        }
        setQuestions(placeholders);
      }
    } catch (err) {
      setError('Failed to load exam questions. Please try again.');
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
        certification_level: certLevel,
        answers: answers,
        total_questions: questions.length,
        submitted_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
      };

      const { error: submitError } = await supabase
        .from('intake_submissions')
        .insert(submission);

      if (submitError) throw submitError;

      setSubmitted(true);
    } catch (err) {
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
              <h2 className="text-2xl font-bold text-[#0D2137] mb-2">Exam Submitted</h2>
              <p className="text-[#6c757d] mb-4">
                Thank you, {studentName}. Your {certLevel} intake exam has been submitted for grading.
              </p>
              <p className="text-sm text-[#6c757d]">
                You answered {answeredCount} of {questions.length} questions. You will receive your results and analysis via email within 24-48 hours.
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
                <Badge className="bg-[#1a5f7a] text-white">{certLevel}</Badge>
              </div>
              <CardTitle className="text-2xl text-[#0D2137]">Intake Assessment</CardTitle>
              <p className="text-[#6c757d] mt-2">
                This diagnostic exam contains {totalQuestions} questions and is designed to identify your strengths and areas for improvement. There is no time limit, but most students complete it in 60-90 minutes.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dee2e6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-1">Email Address</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dee2e6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
                  placeholder="your.email@example.com"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-[#dc3545] text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button onClick={handleStartExam} className="w-full bg-[#0D2137] hover:bg-[#1a5f7a]">
                Begin Assessment
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
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#0D2137] mx-auto mb-4" />
            <p className="text-[#6c757d]">Loading exam questions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Sticky Progress Header */}
        <div className="sticky top-20 z-40 bg-white border-b border-[#dee2e6] shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-[#1a5f7a] text-white">{certLevel} Intake</Badge>
              <span className="text-sm text-[#6c757d]">
                {answeredCount} / {questions.length} answered
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-4 w-4 text-[#6c757d]" />
              <span className="text-sm text-[#6c757d]">
                {Math.round((Date.now() - startTime) / 60000)} min
              </span>
            </div>
          </div>
          <div className="h-1 bg-gray-200">
            <div
              className="h-1 bg-[#1a5f7a] transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {paginatedQuestions.map((q) => (
              <Card key={q.question_number}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0D2137] text-white flex items-center justify-center text-sm font-medium">
                      {q.question_number}
                    </span>
                    <p className="text-[#333] leading-relaxed">{q.question_text}</p>
                  </div>
                  <div className="ml-11 space-y-2">
                    {q.options.map((option, idx) => {
                      const optionLabel = String.fromCharCode(65 + idx);
                      const isSelected = answers[q.question_number.toString()] === optionLabel;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(q.question_number, optionLabel)}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-[#1a5f7a] bg-[#1a5f7a]/10 text-[#0D2137]'
                              : 'border-[#dee2e6] hover:border-[#1a5f7a]/50 text-[#333]'
                          }`}
                        >
                          <span className="font-medium mr-2">{optionLabel}.</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-[#6c757d]">
              Page {currentPage + 1} of {totalPages}
            </span>
            {currentPage < totalPages - 1 ? (
              <Button
                onClick={() => setCurrentPage(p => p + 1)}
                className="bg-[#0D2137] hover:bg-[#1a5f7a]"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#E03038] hover:bg-[#c52830]"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</>
                ) : (
                  'Submit Exam'
                )}
              </Button>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-[#dc3545] text-sm justify-center">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
