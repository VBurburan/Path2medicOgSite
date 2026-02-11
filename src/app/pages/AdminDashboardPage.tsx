import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { projectId } from '../../../utils/supabase/info';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, 
  Settings, 
  LogOut, 
  Loader2, 
  Search,
  LayoutDashboard,
  FileQuestion,
  FileText,
  Database,
  ImageIcon,
  ExternalLink
} from 'lucide-react';
import { AdminQuestionList } from '../components/admin/AdminQuestionList';
import { AdminSubmissionList } from '../components/admin/AdminSubmissionList';
import { AdminDatabaseTools } from '../components/admin/AdminDatabaseTools';
import logoDark from '@/assets/logo-dark.jpg';

// User List Component
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MoreVertical, Shield, Mail, UserPlus, FileEdit, ClipboardList, Plus } from 'lucide-react';

// Exam Assignment Component
function ExamAssignments() {
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formExamType, setFormExamType] = useState('intake');
  const [formCertLevel, setFormCertLevel] = useState('EMT');
  const [formExamId, setFormExamId] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data } = await supabase
        .from('exam_assignments')
        .select('*')
        .order('assigned_at', { ascending: false })
        .limit(50);
      if (data) setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!formEmail) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('exam_assignments').insert({
        student_email: formEmail.trim().toLowerCase(),
        exam_type: formExamType,
        certification_level: formCertLevel,
        exam_id: formExamId || null,
        status: 'available',
        notes: formNotes || null,
      });
      if (error) throw error;
      setShowForm(false);
      setFormEmail('');
      setFormExamId('');
      setFormNotes('');
      fetchAssignments();
    } catch (err) {
      console.error('Error assigning exam', err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('exam_assignments').update({ status }).eq('id', id);
    fetchAssignments();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Assign and manage student exams</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Assign Exam
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Student Email</label>
                <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="student@email.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Exam Type</label>
                <select value={formExamType} onChange={(e) => setFormExamType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="intake">Intake</option>
                  <option value="posttest">Post-Test</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Certification Level</label>
                <select value={formCertLevel} onChange={(e) => setFormCertLevel(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="EMT">EMT</option>
                  <option value="AEMT">AEMT</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Exam ID (optional)</label>
                <Input value={formExamId} onChange={(e) => setFormExamId(e.target.value)} placeholder="e.g. posttest-emt-v2" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Notes (visible to student)</label>
              <Input value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Optional notes..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAssign} disabled={submitting} size="sm">
                {submitting ? 'Assigning...' : 'Assign'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
            ) : assignments.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No exam assignments yet</TableCell></TableRow>
            ) : (
              assignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-sm">{a.student_email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {a.certification_level} {a.exam_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${
                      a.status === 'graded' ? 'bg-green-50 text-green-700' :
                      a.status === 'submitted' ? 'bg-amber-50 text-amber-700' :
                      a.status === 'available' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(a.assigned_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {a.score_percentage != null ? `${Math.round(a.score_percentage)}%` : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {a.status === 'submitted' && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(a.id, 'graded')}>
                        Mark Graded
                      </Button>
                    )}
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

function UserManagement({ users, loading }: { users: any[], loading: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search students..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} students
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined / Active</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No students found</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.user_metadata?.name || user.name || 'Unknown Name'}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.user_metadata?.role === 'admin' ? (
                      <Badge className="bg-purple-600">Admin</Badge>
                    ) : user.source === 'submission' ? (
                      <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">Exam Student</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Registered</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(user.created_at || user.last_active).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.source === 'auth' ? (
                      <span className="text-xs text-gray-500">Account</span>
                    ) : (
                      <span className="text-xs text-orange-600">Submission</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View History</Button>
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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions'); 

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      if (session.user?.user_metadata?.role !== 'admin') {
        navigate('/dashboard');
        return;
      }

      setCurrentUser(session.user);
      
      // 1. Fetch Registered Users
      let registeredUsers: any[] = [];
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ae44dd2/list-users`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (response.ok) {
          const data = await response.json();
          registeredUsers = (data.users || []).map((u: any) => ({ ...u, source: 'auth' }));
        }
      } catch (e) {
        console.error("Failed to fetch registered users", e);
      }

      // 2. Fetch Students from Submissions (Intake)
      let submissionStudents: any[] = [];
      try {
        const { data: intakes } = await supabase
          .from('intake_submissions')
          .select('student_email, student_name, submitted_at')
          .order('submitted_at', { ascending: false });
        
        if (intakes) {
          // Deduplicate by email
          const uniqueIntakes = new Map();
          intakes.forEach(sub => {
            if (!uniqueIntakes.has(sub.student_email)) {
              uniqueIntakes.set(sub.student_email, {
                id: `sub_${sub.student_email}`, // Synthetic ID
                email: sub.student_email,
                name: sub.student_name,
                created_at: sub.submitted_at,
                last_active: sub.submitted_at,
                user_metadata: { name: sub.student_name },
                source: 'submission'
              });
            }
          });
          submissionStudents = Array.from(uniqueIntakes.values());
        }
      } catch (e) {
        console.error("Failed to fetch submissions", e);
      }

      // 3. Merge: Prioritize Registered Users, but include Submission-only students
      const registeredEmails = new Set(registeredUsers.map(u => u.email?.toLowerCase()));
      const newStudents = submissionStudents.filter(s => !registeredEmails.has(s.email?.toLowerCase()));
      
      const allStudents = [...registeredUsers, ...newStudents];

      setUsers(allStudents);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assignments', label: 'Exam Assignments', icon: ClipboardList },
    { id: 'questions', label: 'Questions Bank', icon: FileQuestion },
    { id: 'submissions', label: 'Submissions', icon: FileText },
    { id: 'users', label: 'Students', icon: Users },
    { id: 'assets', label: 'Media Assets', icon: ImageIcon },
    { id: 'tools', label: 'Database Tools', icon: Database },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D2137] text-white hidden md:flex flex-col shadow-lg">
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <img src={logoDark} alt="Path2Medic" className="h-14 w-auto rounded" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'assets' ? navigate('/admin/assets') : setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                activeTab === item.id 
                  ? "bg-white/10 text-white border-l-4 border-[#d4a843]" 
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? "text-[#d4a843]" : ""}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            className="w-full mb-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 justify-start"
            onClick={() => navigate('/portal')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Student Portal View
          </Button>

          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs border border-white/20">
              {currentUser.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-gray-200">{currentUser.user_metadata?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10 justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0D2137]">
                {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-500">Manage your NREMT preparation platform.</p>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0D2137]">{users.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Registered + Exam Submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-bold text-[#d4a843]">
                     <span className="text-xs font-normal text-gray-400 block mb-1">Check Questions Tab</span>
                     Active
                   </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Platform Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-green-600 font-bold">
                    <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                    Operational
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'assignments' && <ExamAssignments />}

          {activeTab === 'users' && <UserManagement users={users} loading={loading} />}

          {activeTab === 'questions' && <AdminQuestionList />}
          
          {activeTab === 'submissions' && <AdminSubmissionList />}
          
          {activeTab === 'tools' && <AdminDatabaseTools />}

        </div>
      </main>
    </div>
  );
}
