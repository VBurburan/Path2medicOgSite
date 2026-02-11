import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  Clock, 
  Save, 
  AlertCircle,
  XCircle,
  CheckCircle,
  Menu
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { supabase } from '@/utils/supabaseClient';

interface ExamViewProps {
  user: any;
  moduleConfig: any;
  onComplete: (results: any) => void;
  onExit: () => void;
}

export function ExamView({ user, moduleConfig, onComplete, onExit }: ExamViewProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [showRationale, setShowRationale] = useState(false);
  
  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .eq('level', moduleConfig.level);

      if (moduleConfig.mode === 'domain') {
        query = query.eq('domain_id', moduleConfig.domainId);
      } else if (moduleConfig.mode === 'type') {
        query = query.eq('item_type', moduleConfig.typeCode);
      }

      // Randomize and limit
      // Supabase doesn't support random() easily via JS client without RPC
      // So we fetch a bit more and shuffle client side for now, or use existing IDs if available
      const { data, error } = await query.limit(50); // Fetch pool
      
      if (data) {
        // Shuffle
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, moduleConfig.count || 10));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: value
    }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({
      ...prev,
      [questions[currentIndex].id]: !prev[questions[currentIndex].id]
    }));
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    const results = questions.map(q => {
      const userAnswer = answers[q.id];
      // Basic check - needs robust matching for JSONB/Arrays
      // Assuming simple match for now for MVP
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correct_answer);
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        userAnswer,
        isCorrect,
        question: q
      };
    });

    onComplete({
      score: (correctCount / questions.length) * 100,
      totalQuestions: questions.length,
      correctCount,
      details: results,
      timeSpent: elapsedSeconds
    });
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading Exam...</div>;
  if (questions.length === 0) return <div className="flex items-center justify-center h-full">No questions found for this configuration.</div>;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5]">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="sm" onClick={onExit}>
            <XCircle className="h-5 w-5 mr-1" />
            Exit
          </Button>
          <div className="flex-1 max-w-md hidden md:block">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded">
            <Clock className="h-4 w-4 mr-2" />
            {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFlag}
            className={flagged[currentQuestion.id] ? "text-orange-500 border-orange-200 bg-orange-50" : ""}
          >
            <Flag className="h-4 w-4 mr-2" />
            {flagged[currentQuestion.id] ? "Flagged" : "Flag"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          
          {/* Scenario Context */}
          {currentQuestion.scenario_context && (
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-[#1a5f7a] font-bold mb-2">
                  <Badge variant="outline" className="bg-white text-[#1a5f7a] border-[#1a5f7a]">Clinical Scenario</Badge>
                </div>
                <p className="text-gray-800 leading-relaxed">{currentQuestion.scenario_context}</p>
              </CardContent>
            </Card>
          )}

          {/* Question Stem */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
            {currentQuestion.instructions && (
              <p className="text-sm italic text-gray-500 mb-4 font-medium">{currentQuestion.instructions}</p>
            )}
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-snug">
              {currentQuestion.stem}
            </h2>

            {/* Answer Options Render */}
            <div className="space-y-4">
              {currentQuestion.item_type === 'MC' && (
                <RadioGroup 
                  value={answers[currentQuestion.id] || ''} 
                  onValueChange={handleAnswer}
                >
                  {currentQuestion.options && Object.entries(currentQuestion.options).map(([key, value]: [string, any]) => (
                    <div key={key} className={`flex items-start space-x-3 border p-4 rounded-lg transition-colors ${answers[currentQuestion.id] === key ? 'border-[#1a5f7a] bg-[#1a5f7a]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <RadioGroupItem value={key} id={key} className="mt-1" />
                      <Label htmlFor={key} className="text-base font-normal cursor-pointer flex-1 leading-relaxed">
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {(currentQuestion.item_type === 'MR' || currentQuestion.item_type === 'SATA') && (
                <div className="space-y-3">
                  {currentQuestion.options && Object.entries(currentQuestion.options).map(([key, value]: [string, any]) => {
                     const currentAnswers = Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id] : [];
                     const isChecked = currentAnswers.includes(key);
                     return (
                      <div key={key} className={`flex items-start space-x-3 border p-4 rounded-lg transition-colors ${isChecked ? 'border-[#1a5f7a] bg-[#1a5f7a]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <Checkbox 
                          id={key} 
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newAnswers = checked 
                              ? [...currentAnswers, key]
                              : currentAnswers.filter((k: any) => k !== key);
                            handleAnswer(newAnswers);
                          }}
                          className="mt-1" 
                        />
                        <Label htmlFor={key} className="text-base font-normal cursor-pointer flex-1 leading-relaxed">
                          {value}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Fallback for other types for now */}
              {!['MC', 'MR', 'SATA'].includes(currentQuestion.item_type) && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
                  Interactive {currentQuestion.item_type} component under construction. 
                  (Logic implemented for MC only in this preview).
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center py-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentIndex === questions.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                className="bg-[#28a745] hover:bg-[#218838] px-8"
              >
                Submit Exam
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="bg-[#1a5f7a] hover:bg-[#134b61] px-8"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
