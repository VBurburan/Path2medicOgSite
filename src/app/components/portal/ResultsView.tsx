import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface ResultsViewProps {
  results: any;
  onRetake: () => void;
  onExit: () => void;
}

export function ResultsView({ results, onRetake, onExit }: ResultsViewProps) {
  const { score, totalQuestions, correctCount, details, timeSpent } = results;

  const getScoreColor = (s: number) => {
    if (s >= 90) return '#28a745';
    if (s >= 80) return '#17a2b8';
    if (s >= 70) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 80) return 'Good';
    if (s >= 70) return 'Adequate';
    return 'Study Needed';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0D2137]">Exam Results</h2>
        <Button variant="outline" onClick={onExit}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Score Card */}
      <Card className="text-center py-8 border-t-8" style={{ borderTopColor: getScoreColor(score) }}>
        <CardContent>
          <div className="text-6xl font-bold mb-2" style={{ color: getScoreColor(score) }}>
            {Math.round(score)}%
          </div>
          <div className="text-xl font-medium text-gray-600 mb-6">
            {getScoreLabel(score)}
          </div>
          
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <div>
              <span className="block font-bold text-gray-900 text-lg">{correctCount}/{totalQuestions}</span>
              Correct
            </div>
            <div>
              <span className="block font-bold text-gray-900 text-lg">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </span>
              Time Taken
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={onRetake} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
            </Button>
            <Button className="bg-[#0D2137] hover:bg-[#162d47]">
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0D2137]">Question Review</h3>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {details.map((item: any, index: number) => (
            <AccordionItem key={item.questionId} value={item.questionId} className="border rounded-lg bg-white px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 w-full text-left">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500 mr-2">Q{index + 1}</span>
                    <span className="font-medium text-gray-900 line-clamp-1">{item.question.stem}</span>
                  </div>
                  <Badge variant="secondary" className="mr-2">{item.question.item_type}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4 border-t mt-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{item.question.stem}</p>
                  
                  {/* Your Answer */}
                  <div className={`p-3 rounded border mb-2 ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-xs font-bold uppercase tracking-wide block mb-1">Your Answer</span>
                    {/* Simplified display - logic needs to map keys to option values */}
                    {JSON.stringify(item.userAnswer)} 
                  </div>
                  
                  {/* Correct Answer (if wrong) */}
                  {!item.isCorrect && (
                    <div className="p-3 rounded border bg-green-50 border-green-200 mb-2">
                       <span className="text-xs font-bold uppercase tracking-wide block mb-1 text-green-700">Correct Answer</span>
                       {JSON.stringify(item.question.correct_answer)}
                    </div>
                  )}
                </div>

                {/* Rationale */}
                <div className="prose prose-sm max-w-none text-gray-600">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Rationale</h4>
                  <p>{item.question.rationale_correct || 'No rationale available.'}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
