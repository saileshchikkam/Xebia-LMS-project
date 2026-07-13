import React from 'react';
import { BookOpen, BarChart3, Award, Flame, User, LogOut, CheckSquare, Settings, Sparkles } from 'lucide-react';
import XebiaLogo from './XebiaLogo';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  streakDays: number;
  userProfile: { displayName: string; role: 'Student' | 'Admin'; title: string } | null;
  onLogout: () => void;
  onOpenAuth: (role: 'Student' | 'Admin') => void;
  onShowNotice?: (title: string, message: string) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isAdminMode,
  setIsAdminMode,
  streakDays,
  userProfile,
  onLogout,
  onOpenAuth,
  onShowNotice
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo Group */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
          id="xebia-header-logo-group"
        >
          <XebiaLogo height={26} textColor="#831B84" />
          <span className="bg-slate-100 text-slate-600 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase">
            Academy LMS
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full" id="xebia-header-nav">
          <button
            onClick={() => setCurrentTab('home')}
            className={`relative text-sm font-medium tracking-tight h-16 flex items-center transition-colors cursor-pointer ${
              currentTab === 'home' || currentTab === 'player'
                ? 'text-[#831B84] border-b-2 border-[#831B84]'
                : 'text-gray-500 hover:text-black'
            }`}
            id="nav-tab-home"
          >
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('catalog')}
            className={`relative text-sm font-medium tracking-tight h-16 flex items-center transition-colors cursor-pointer ${
              currentTab === 'catalog'
                ? 'text-[#831B84] border-b-2 border-[#831B84]'
                : 'text-gray-500 hover:text-black'
            }`}
            id="nav-tab-catalog"
          >
            <span>My Courses</span>
          </button>

          <button
            onClick={() => setCurrentTab('assessment')}
            className={`relative text-sm font-medium tracking-tight h-16 flex items-center transition-colors cursor-pointer ${
              currentTab === 'assessment'
                ? 'text-[#831B84] border-b-2 border-[#831B84]'
                : 'text-gray-500 hover:text-black'
            }`}
            id="nav-tab-assessment"
          >
            <span>Certifications</span>
          </button>

          <button
            onClick={() => setCurrentTab('calculator')}
            className={`relative text-sm font-medium tracking-tight h-16 flex items-center transition-colors cursor-pointer ${
              currentTab === 'calculator'
                ? 'text-[#831B84] border-b-2 border-[#831B84]'
                : 'text-gray-500 hover:text-black'
            }`}
            id="nav-tab-calculator"
          >
            <span>Subnet Calculator</span>
          </button>

          <button
            onClick={() => {
              if (isAdminMode) {
                setCurrentTab('admin');
              } else if (onShowNotice) {
                onShowNotice(
                  "Mentorship Portal",
                  "Connect with Marc van Holst or Sophia Henderson for 1-on-1 architecture reviews. (Admin mode unlocks full squad tracking logs)"
                );
              }
            }}
            className={`relative text-sm font-medium tracking-tight h-16 flex items-center transition-colors cursor-pointer ${
              currentTab === 'admin'
                ? 'text-[#831B84] border-b-2 border-[#831B84]'
                : 'text-gray-500 hover:text-black'
            }`}
            id="nav-tab-admin"
          >
            <span>Mentorship</span>
          </button>
        </nav>

        {/* Right Action Bars */}
        <div className="flex items-center gap-4" id="xebia-header-actions">
          
          {/* Active streak info in a super clean, minimal format */}
          <div className="hidden sm:flex items-center space-x-1 rounded-full bg-[#FFF4ED] px-2.5 py-1 text-xebia-orange border border-[#FF5A36]/10" title="Active streak!">
            <Flame className="h-3.5 w-3.5 fill-[#FF5A36] text-[#FF5A36]" />
            <span className="font-mono text-[11px] font-bold text-[#FF5A36]">{streakDays}d Streak</span>
          </div>

          {/* Elegant Role Toggle */}
          <div className="flex items-center rounded-full bg-gray-100 p-0.5 border border-gray-200/50 text-[10px]">
            <button
              onClick={() => {
                setIsAdminMode(false);
                if (currentTab === 'admin') setCurrentTab('home');
              }}
              className={`rounded-full px-2.5 py-0.5 font-bold transition-all cursor-pointer ${
                !isAdminMode 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500'
              }`}
              id="role-switch-learner"
            >
              Learner
            </button>
            <button
              onClick={() => {
                setIsAdminMode(true);
                setCurrentTab('admin');
              }}
              className={`rounded-full px-2.5 py-0.5 font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                isAdminMode 
                  ? 'bg-[#831B84] text-white shadow-xs' 
                  : 'text-slate-500'
              }`}
              id="role-switch-admin"
              title="Switch to Admin Dashboard"
            >
              <span>Admin</span>
            </button>
          </div>

          {/* User Profile details or Guest Portal Action buttons */}
          {userProfile ? (
            <div className="flex items-center gap-3" id="header-profile-menu">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#1A1A1B]">
                  {userProfile.displayName}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                  {userProfile.title || 'Senior Architect'}
                </div>
              </div>
              <div 
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#831B84] to-[#c449c5] border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold select-none cursor-help"
                title={`Logged in as ${userProfile.displayName} (${userProfile.role})`}
              >
                {userProfile.displayName 
                  ? userProfile.displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'SJ'
                }
              </div>
              
              {/* Log Out Action */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                title="Sign Out"
                id="header-logout-btn"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2" id="header-guest-ctas">
              <button
                onClick={() => onOpenAuth('Student')}
                className="text-xs font-bold bg-[#831B84]/10 hover:bg-[#831B84]/20 text-[#831B84] px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-[#831B84]/20"
                id="btn-header-student-login"
                title="Student login and account creation"
              >
                Student Portal
              </button>
              <button
                onClick={() => onOpenAuth('Admin')}
                className="text-xs font-bold bg-[#FF5A36] hover:bg-[#FF5A36]/90 text-white px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                id="btn-header-admin-login"
                title="Admin login and metrics"
              >
                Admin Portal
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
