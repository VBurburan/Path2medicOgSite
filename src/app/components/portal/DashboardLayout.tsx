import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../ui/utils';
import logoDark from '@/assets/logo-dark.jpg';
import logoHorizontal from '@/assets/logo-horizontal.png';

const NAVY = '#0D2137';
const ACCENT = '#E03038';

const navItems = [
  { id: 'dashboard', path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'exams', path: '/exams', label: 'Exams', icon: ClipboardList },
  { id: 'practice', path: '/practice', label: 'Practice', icon: BookOpen },
  { id: 'results', path: '/results', label: 'Results', icon: BarChart3 },
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
    <div className="h-screen flex overflow-hidden bg-[#f8f9fa]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile (bottom tab bar used instead) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto hidden md:flex',
          sidebarOpen ? 'translate-x-0 !flex' : '-translate-x-full'
        )}
        style={{ backgroundColor: NAVY }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <img src={logoDark} alt="Path2Medic" className="h-8 w-auto rounded" />
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
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-r-lg',
                  isActive
                    ? 'bg-white/10 text-white border-l-[3px]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-[3px] border-transparent'
                )}
                style={isActive ? { borderLeftColor: ACCENT } : undefined}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : '')} />
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
            {/* Show logo in header on mobile */}
            <img src={logoHorizontal} alt="Path2Medic" className="h-7 w-auto md:hidden" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {displayName}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0D2137] text-white">
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 flex items-center justify-around px-2 py-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 text-[11px] font-medium transition-colors min-w-0',
                isActive ? 'text-[#E03038]' : 'text-gray-400'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
