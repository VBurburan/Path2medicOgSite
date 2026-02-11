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
    navigate('/');
  };

  const tierLabel = membershipTier === 'free' ? 'Free' : membershipTier === 'pro' ? 'Pro' : 'Max';
  const tierBadgeClass =
    membershipTier === 'pro'
      ? 'bg-[#E03038]/15 text-[#E03038] border border-[#E03038]/20'
      : membershipTier === 'max'
        ? 'bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/20'
        : 'bg-white/10 text-white/50 border border-white/10';

  return (
    <div className="h-screen flex overflow-hidden bg-[#f5f6f8]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — premium gradient */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto hidden md:flex',
          sidebarOpen ? 'translate-x-0 !flex' : '-translate-x-full'
        )}
        style={{
          background: 'linear-gradient(180deg, #0F2640 0%, #0D2137 40%, #091A2D 100%)',
        }}
      >
        {/* Logo area */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.06]">
          <img src={logoDark} alt="Path2Medic" className="h-10 w-auto rounded" />
          <button
            className="md:hidden text-white/60 hover:text-white transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info — premium avatar */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ring-2 ring-white/10 ring-offset-2 ring-offset-[#0D2137] transition-all duration-300"
                style={{ backgroundColor: ACCENT }}
              >
                {initials}
              </div>
              {/* Online indicator dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0D2137]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{displayName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/40 text-xs">{certLevel}</span>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', tierBadgeClass)}>
                  {tierLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group relative',
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm shadow-black/10'
                    : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80'
                )}
              >
                <div className="relative flex items-center">
                  {isActive && (
                    <div
                      className="absolute -left-4 w-[3px] h-5 rounded-r transition-all duration-300"
                      style={{ backgroundColor: ACCENT, boxShadow: '0 0 8px rgba(224, 48, 56, 0.3)' }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] transition-all duration-300',
                      isActive ? 'text-white' : 'group-hover:text-white/70'
                    )}
                  />
                </div>
                <span className="transition-all duration-300">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-white/25" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 pb-4 pt-2 border-t border-white/[0.06] mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/35 hover:bg-white/[0.04] hover:text-white/60 transition-all duration-300 group"
          >
            <LogOut className="h-[18px] w-[18px] transition-all duration-300 group-hover:text-[#E03038]/70" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header — premium with subtle bottom highlight */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 h-16 px-4 md:px-8 flex items-center justify-between flex-shrink-0 relative">
          {/* Subtle top accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200/80 to-transparent" />

          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-400 hover:text-gray-700 transition-all duration-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <img src={logoHorizontal} alt="Path2Medic" className="h-9 w-auto md:hidden" />
            <h1 className="text-lg font-semibold text-[#0D2137] hidden md:block tracking-tight">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block font-medium">
              {displayName}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#0D2137] text-white tracking-wide shadow-sm">
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

      {/* Mobile bottom tab bar — premium styling */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/60 flex items-center justify-around px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2.5 px-3 text-[10px] font-semibold transition-all duration-300 min-w-0 relative',
                isActive ? 'text-[#E03038]' : 'text-gray-400 hover:text-gray-500'
              )}
            >
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b"
                  style={{ backgroundColor: ACCENT, boxShadow: '0 1px 4px rgba(224, 48, 56, 0.3)' }}
                />
              )}
              <item.icon className={cn('h-5 w-5 transition-all duration-300', isActive ? 'stroke-[2.5]' : '')} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
