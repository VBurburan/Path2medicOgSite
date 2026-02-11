import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export default function InstructorAnalytics() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="py-12">
            <BarChart3 className="h-16 w-16 text-[#1a5f7a] mx-auto mb-4" />
            <Badge className="bg-[#d4a843] text-[#0D2137] mb-4">Coming Soon</Badge>
            <h2 className="text-2xl font-bold text-[#0D2137] mb-2">Analytics Dashboard</h2>
            <p className="text-[#6c757d] mb-6">
              Aggregate performance data, identify trends across your student population, and gain insights into common areas of difficulty.
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
