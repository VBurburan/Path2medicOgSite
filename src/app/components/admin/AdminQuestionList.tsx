import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Search, Plus, Edit, Trash2, Loader2, FileQuestion } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "../ui/dialog";
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function AdminQuestionList() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New Question State
  const [newQuestion, setNewQuestion] = useState({
    stem: '',
    level: 'EMT',
    item_type: 'MC',
    domain_id: '', // Would need to fetch domains to populate this select
    difficulty: 'medium',
    correct_answer: '',
    options: {} // Simplified for MVP
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      // Basic validation
      if (!newQuestion.stem) return toast.error('Question stem is required');

      const { data, error } = await supabase
        .from('questions')
        .insert([{
          ...newQuestion,
          is_active: true,
          // Mocking complex JSON fields for MVP creation
          options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
          correct_answer: { value: "A" }
        }])
        .select();

      if (error) throw error;

      toast.success('Question created successfully');
      setIsDialogOpen(false);
      fetchQuestions(); // Refresh
    } catch (error: any) {
      toast.error('Error creating question: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Question deleted');
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (error: any) {
      toast.error('Error deleting question');
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.stem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.item_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search questions..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0D2137] hover:bg-[#162d47]">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>Create a new question for the question bank.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certification Level</Label>
                  <Select 
                    value={newQuestion.level} 
                    onValueChange={(val) => setNewQuestion({...newQuestion, level: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMT">EMT</SelectItem>
                      <SelectItem value="AEMT">AEMT</SelectItem>
                      <SelectItem value="Paramedic">Paramedic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select 
                    value={newQuestion.item_type} 
                    onValueChange={(val) => setNewQuestion({...newQuestion, item_type: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MC">Multiple Choice</SelectItem>
                      <SelectItem value="MR">Multiple Response</SelectItem>
                      <SelectItem value="TEI">Other TEI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Question Stem</Label>
                <Textarea 
                  placeholder="Enter the question text here..."
                  value={newQuestion.stem}
                  onChange={(e) => setNewQuestion({...newQuestion, stem: e.target.value})}
                  className="h-24"
                />
              </div>
              {/* Simplified for MVP - Options would be a complex dynamic form */}
              <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                Note: Answer options and correct answer configuration will be set to defaults. Edit later to customize.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateQuestion}>Create Question</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[50%]">Stem</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FileQuestion className="h-12 w-12 text-gray-300 mb-2" />
                    <p>No questions found.</p>
                    <Button variant="link" onClick={() => setIsDialogOpen(true)}>Create your first question</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {q.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{q.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{q.item_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2" title={q.stem}>{q.stem}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      q.difficulty === 'hard' ? 'text-red-600' : 
                      q.difficulty === 'medium' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {q.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(q.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
