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
import { Loader2, Calendar, User, FileText } from 'lucide-react';

export function AdminSubmissionList() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch both intake and post-test submissions
      const { data: intakes, error: err1 } = await supabase
        .from('intake_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(20);

      if (err1) throw err1;

      // Combine and sort if needed, for now just showing intakes as they are critical
      setSubmissions(intakes || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Exam Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-300 mb-2" />
                    <p>No submissions found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{sub.student_name}</div>
                    <div className="text-xs text-gray-500">{sub.student_email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sub.exam_id}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      sub.score_percentage >= 80 ? 'text-green-600' :
                      sub.score_percentage >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {sub.score_percentage}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {sub.reviewed ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Reviewed</Badge>
                    ) : (
                      <Badge variant="secondary">Pending Review</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">View Details</Button>
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
