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
  ChevronRight,
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
  const membershipTier = student?.membership_tier || 'free';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const activeNav = navItems.find((item) => location.pathname.startsWith(item.path))?.id || 'dashboard';
  const pageTitle = navItems.find((item) => item.id === activeNav)?.label || 'Dashboard';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#f5f6f8]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto hidden md:flex',
          sidebarOpen ? 'translate-x-0 !flex' : '-translate-x-full'
        )}
        style={{ backgroundColor: NAVY }}
      >
        {/* Logo area */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/8">
          <img src={logoDark} alt="Path2Medic" className="h-10 w-auto rounded" />
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ backgroundColor: ACCENT }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{displayName}</p>
              <p className="text-white/40 text-xs">{certLevel} &middot; {membershipTier === 'free' ? 'Free' : membershipTier === 'pro' ? 'Pro' : 'Max'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                )}
              >
                <div className="relative flex items-center">
                  {isActive && (
                    <div className="absolute -left-4 w-[3px] h-5 rounded-r" style={{ backgroundColor: ACCENT }} />
                  )}
                  <item.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-white' : '')} />
                </div>
                <span>{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-white/30" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 pb-4 pt-2 border-t border-white/8 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white/70 transition-all"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200/80 h-16 px-4 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <img src={logoHorizontal} alt="Path2Medic" className="h-9 w-auto md:hidden" />
            <h1 className="text-lg font-semibold text-[#0D2137] hidden md:block">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {displayName}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#0D2137] text-white tracking-wide">
                {certLevel}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200/80 flex items-center justify-around px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2.5 px-3 text-[10px] font-semibold transition-colors min-w-0 relative',
                isActive ? 'text-[#E03038]' : 'text-gray-400'
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b bg-[#E03038]" />
              )}
              <item.icon className={cn('h-5 w-5', isActive ? 'stroke-[2.5]' : '')} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
