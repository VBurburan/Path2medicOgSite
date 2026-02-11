import React, { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Database, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDatabaseTools() {
  const [seeding, setSeeding] = useState(false);

  const seedQuestions = async () => {
    if (!confirm('This will insert sample questions into your database. Continue?')) return;
    
    setSeeding(true);
    try {
      const dummyQuestions = [
        {
          stem: "A 56-year-old male complains of tearing tearing chest pain radiating to his back. BP is 190/110 in the right arm and 160/90 in the left arm. What is the most likely diagnosis?",
          level: "Paramedic",
          item_type: "MC",
          difficulty: "hard",
          is_active: true,
          options: {
             A: "Acute Myocardial Infarction",
             B: "Aortic Dissection",
             C: "Pulmonary Embolism",
             D: "Pericardial Tamponade"
          },
          correct_answer: { value: "B" },
          rationale_correct: "Tearing pain radiating to the back and unequal blood pressures are classic signs of aortic dissection."
        },
        {
          stem: "Which of the following is a contraindication for the use of Nitroglycerin?",
          level: "EMT",
          item_type: "MC",
          difficulty: "easy",
          is_active: true,
          options: {
             A: "Systolic BP > 100 mmHg",
             B: "History of MI",
             C: "Use of ED medications (e.g., Viagra) in last 24-48 hours",
             D: "Chest pain duration > 30 minutes"
          },
          correct_answer: { value: "C" },
          rationale_correct: "Phosphodiesterase inhibitors combined with nitrates can cause severe, refractory hypotension."
        },
        {
           stem: "Select all the signs of Cushing's Triad.",
           level: "AEMT",
           item_type: "MR",
           difficulty: "medium",
           is_active: true,
           options: {
              A: "Hypertension",
              B: "Tachycardia",
              C: "Bradycardia",
              D: "Irregular Respirations",
              E: "Hypotension"
           },
           correct_answer: { values: ["A", "C", "D"] },
           rationale_correct: "Cushing's Triad consists of hypertension (widening pulse pressure), bradycardia, and irregular respirations, indicating increased ICP."
        }
      ];

      const { error } = await supabase.from('questions').insert(dummyQuestions);
      
      if (error) throw error;
      toast.success('Sample questions inserted successfully!');
    } catch (error: any) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed data: ' + error.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Developer Tools
          </CardTitle>
          <CardDescription className="text-orange-700">
            Use these tools to populate your database with initial data if it is empty.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-orange-100">
            <div>
              <h4 className="font-semibold">Seed Sample Questions</h4>
              <p className="text-sm text-gray-500">Inserts 3 dummy questions (MC, MR) to test the platform.</p>
            </div>
            <Button onClick={seedQuestions} disabled={seeding} className="bg-orange-600 hover:bg-orange-700">
              {seeding ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Database className="h-4 w-4 mr-2" />}
              Seed Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
