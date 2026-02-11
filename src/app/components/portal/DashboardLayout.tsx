import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  BarChart3,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../ui/utils';
import logo from '@/assets/logo.png';

const NAVY = '#0D2137';

const navItems = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'exams', path: '/exams', label: 'My Exams', icon: ClipboardList },
  { id: 'practice', path: '/practice', label: 'Practice', icon: BookOpen },
  { id: 'results', path: '/results', label: 'Results', icon: BarChart3 },
  { id: 'resources', path: '/resources', label: 'Resources', icon: Download },
  { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('students')
      .select('full_name, certification_level, membership_tier')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setStudent(data);
      });
  }, [user]);

  const displayName = student?.full_name || user?.user_metadata?.full_name || 'Student';
  const certLevel = student?.certification_level || 'EMT';

  const activeNav = navItems.find((item) => location.pathname.startsWith(item.path))?.id || 'dashboard';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#f5f5f5]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: NAVY }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <img src={logo} alt="Path2Medic" className="h-8 w-auto rounded" />
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-[#d4a843]' : '')} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 h-16 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {displayName}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1a5f7a] text-white">
              {certLevel}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 hidden sm:block"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
