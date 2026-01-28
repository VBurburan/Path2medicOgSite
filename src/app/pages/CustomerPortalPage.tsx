import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Download, Calendar, Settings, BookOpen } from 'lucide-react';

export default function CustomerPortalPage() {
  const purchases = [
    {
      title: 'The Proof is in the Pudding',
      date: 'Purchased: Jan 1, 2026',
      type: 'PDF + EPUB'
    },
    {
      title: 'Clinical Judgment & TEI Workbook',
      date: 'Purchased: Jan 5, 2026',
      type: 'PDF'
    }
  ];

  const upcomingSessions = [
    {
      date: 'Jan 15, 2026',
      time: '2:00 PM EST',
      instructor: 'Vincent Burburan, NRP'
    }
  ];

  return (
    <Layout>
      <section className="py-8 bg-[#F8F9FA] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1B4F72] mb-8">Customer Portal</h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="coaching">Coaching</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="grid md:grid-cols-2 gap-6">
                {purchases.map((product, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#E67E22]" />
                        {product.title}
                      </CardTitle>
                      <CardDescription>{product.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Format: {product.type}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-[#E67E22] hover:bg-[#D35400]">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        {product.type.includes('EPUB') && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download EPUB
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="coaching">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Coaching Sessions</CardTitle>
                  <CardDescription>Your scheduled 1-on-1 sessions with Vincent</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="border-l-4 border-[#E67E22] pl-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#1B4F72]">{session.date} at {session.time}</div>
                          <div className="text-sm text-gray-600">with {session.instructor}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm" className="bg-[#5DADE2] hover:bg-[#3498DB]">
                            <Calendar className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Progress</CardTitle>
                  <CardDescription>Track your performance across all domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Airway Management', 'Cardiology', 'Trauma', 'Medical', 'Operations'].map((domain, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{domain}</span>
                          <span className="text-[#1B4F72]">{Math.floor(Math.random() * 30 + 70)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#7FA99B] h-2 rounded-full" 
                            style={{ width: `${Math.floor(Math.random() * 30 + 70)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your profile and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Profile Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Email:</strong> student@example.com</p>
                      <p><strong>Member since:</strong> January 2026</p>
                      <p><strong>Subscription:</strong> Monthly Plan</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
