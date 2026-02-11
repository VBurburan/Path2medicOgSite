import React from 'react';
import { Menu, Bell, User, Flame, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PortalHeaderProps {
  user: any;
  toggleSidebar: () => void;
  title: string;
  onLogout: () => void;
}

export function PortalHeader({ user, toggleSidebar, title, onLogout }: PortalHeaderProps) {
  const profile = user?.profile || {};
  const meta = user?.user_metadata || {};
  const name = profile.full_name || meta.name || 'Student';
  const level = profile.certification_level || 'EMT';
  const streak = profile.current_streak_days || 0;

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-4"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </Button>
        <h1 className="text-xl font-bold text-[#0D2137] hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Streak Badge */}
        <div className="hidden sm:flex items-center bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium border border-orange-100">
          <Flame className="h-4 w-4 mr-1 fill-orange-500" />
          <span>{streak} day streak</span>
        </div>

        {/* Level Badge */}
        <Badge className="bg-[#0D2137] hover:bg-[#162d47]">
          {level}
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0D2137] font-bold border border-blue-200">
                {name.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
