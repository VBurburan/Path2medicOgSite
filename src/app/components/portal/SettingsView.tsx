import React from 'react';
import { 
  User, 
  Mail, 
  Award, 
  School, 
  Calendar, 
  CreditCard, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface SettingsViewProps {
  user: any;
  onLogout: () => void;
}

export function SettingsView({ user, onLogout }: SettingsViewProps) {
  const profile = user?.profile || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h2 className="text-2xl font-bold text-[#0D2137]">Profile & Settings</h2>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#0D2137]" />
            Student Information
          </CardTitle>
          <CardDescription>Manage your personal details and certification goals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={profile.full_name || user?.user_metadata?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user?.email} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Certification Level</Label>
              <select 
                id="level" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={profile.certification_level || 'Paramedic'}
              >
                <option value="EMT">EMT</option>
                <option value="AEMT">AEMT</option>
                <option value="Paramedic">Paramedic</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Target Exam Date</Label>
              <Input id="examDate" type="date" defaultValue={profile.target_exam_date} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-end">
          <Button className="bg-[#0D2137] hover:bg-[#162d47]">Save Changes</Button>
        </CardFooter>
      </Card>

      {/* Membership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#d4a843]" />
            Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">Current Plan:</span>
                <Badge className="bg-[#d4a843] hover:bg-[#b8913a]">
                  FULL ACCESS
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                You have full access to all features, including TEI questions and practice exams.
              </p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-gray-500" />
            Study Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Rationales Immediately</Label>
              <p className="text-sm text-gray-500">See the correct answer right after submitting a question (Study Mode).</p>
            </div>
            {/* Simple Toggle Mock */}
            <div className="bg-gray-200 w-12 h-6 rounded-full relative cursor-pointer">
              <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
             <div className="space-y-0.5">
              <Label className="text-base">Default Question Count</Label>
              <p className="text-sm text-gray-500">Number of questions per quick quiz.</p>
            </div>
             <select 
                className="h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                defaultValue="10"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="destructive" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
