import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export default function InstructorExams() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="py-12">
            <FileText className="h-16 w-16 text-[#1a5f7a] mx-auto mb-4" />
            <Badge className="bg-[#d4a843] text-[#0D2137] mb-4">Coming Soon</Badge>
            <h2 className="text-2xl font-bold text-[#0D2137] mb-2">Exam Builder</h2>
            <p className="text-[#6c757d] mb-6">
              Create custom assessments, generate shareable exam links, and manage your question bank.
            </p>
            <Link to="/instructor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
