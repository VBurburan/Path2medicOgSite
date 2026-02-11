import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  History, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../components/ui/utils';
import logoDark from '@/assets/logo-dark.jpg';

interface PortalSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hasCoaching: boolean;
  onLogout: () => void;
}

export function PortalSidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  hasCoaching,
  onLogout 
}: PortalSidebarProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'practice', label: 'Practice Modules', icon: BookOpen },
    ...(hasCoaching ? [{ id: 'coaching', label: 'My Coaching', icon: Target }] : []),
    { id: 'history', label: 'Exam History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0D2137] text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <img src={logoDark} alt="Path2Medic" className="h-14 w-auto rounded" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                activeTab === item.id 
                  ? "bg-[#0D2137] text-white border-l-4 border-[#d4a843]" 
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 mr-3", activeTab === item.id ? "text-[#d4a843]" : "")} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
