import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Award, ArrowRight, X, Info } from 'lucide-react';
import XebiaLogo from './XebiaLogo';
import XebiaLiveBackground from './XebiaLiveBackground';

interface AuthProps {
  onAuthSuccess: (user: any, profile: any) => void;
  initialRole?: 'Student' | 'Admin';
  onClose?: () => void;
}

export default function Auth({ onAuthSuccess, onClose }: AuthProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDemoSignIn = (selectedRole: 'Student' | 'Admin') => {
    setIsLoading(true);
    
    const demoUid = `demo-${selectedRole.toLowerCase()}-user`;
    const demoUser = {
      uid: demoUid,
      email: `${selectedRole.toLowerCase()}@xebia.com`,
      emailVerified: true,
      displayName: `Demo ${selectedRole}`
    };
    
    const demoProfile = {
      uid: demoUid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      role: selectedRole,
      title: selectedRole === 'Admin' ? 'Enterprise Principal LMS Admin' : 'Senior Frontend Architect',
      createdAt: new Date().toISOString()
    };
    
    // Save in localStorage as standard session
    localStorage.setItem('xebia_demo_user', JSON.stringify({ user: demoUser, profile: demoProfile }));
    
    // Call success!
    onAuthSuccess(demoUser, demoProfile);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#0B090F] px-4 py-12 sm:px-6 lg:px-8 animate-fade-in" id="auth-screen">
      
      {/* Background Animated Waves */}
      <XebiaLiveBackground variant="dark" interactive={true} />

      <div className="relative z-10 w-full max-w-md space-y-8 bg-[#0F0D15]/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        {onClose && (
          <button 
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
            title="Close Portal"
            id="auth-close-btn"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
        
        {/* Branding - Bigger logo as requested by user */}
        <div className="text-center space-y-3 text-white">
          <XebiaLogo height={42} textColor="#FFFFFF" className="mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#681D5F] font-mono font-black pt-1">
            Academy Enterprise LMS
          </p>
        </div>

        {/* Simplified Direct Sandbox Entrance Option */}
        <div className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center space-y-4 shadow-lg shadow-emerald-950/10" id="fast-access-container">
            <div className="flex items-center justify-center space-x-2 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest font-mono">⚡ 1-Click Fast Sandbox Access</span>
            </div>
            
            <p className="text-[12px] text-slate-300 leading-relaxed font-sans">
              Welcome to the corporate training workspace. Select your sandbox access credentials below to enter immediately with persistent local storage.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              {/* Student Entry */}
              <button
                type="button"
                onClick={() => handleDemoSignIn('Student')}
                disabled={isLoading}
                className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs p-4 rounded-xl transition-all cursor-pointer shadow-md active:scale-98 disabled:opacity-50 text-left group"
                id="fast-student-btn"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-white/10 rounded-lg text-emerald-100">
                    <User className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-extrabold text-xs uppercase tracking-wider">Enter as Student</div>
                    <div className="text-[10px] text-emerald-100/70 font-normal mt-0.5 normal-case">Study, practice subnets, & get certified</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-100 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Admin Entry - Replaced Orange with 681D5F brand gradient */}
              <button
                type="button"
                onClick={() => handleDemoSignIn('Admin')}
                disabled={isLoading}
                className="w-full flex items-center justify-between bg-gradient-to-r from-[#681D5F] to-purple-600 hover:brightness-110 text-white font-extrabold text-xs p-4 rounded-xl transition-all cursor-pointer shadow-md active:scale-98 disabled:opacity-50 text-left group"
                id="fast-admin-btn"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 bg-white/10 rounded-lg text-purple-100">
                    <Award className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-extrabold text-xs uppercase tracking-wider">Enter as Admin</div>
                    <div className="text-[10px] text-purple-100/70 font-normal mt-0.5 normal-case">Track team analytics & oversee credentials</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-100 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bottom Security Info */}
          <div className="flex items-start space-x-2.5 p-3 bg-white/5 rounded-xl border border-white/5 text-[10.5px] text-slate-400 leading-normal text-left">
            <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Your security and credentials are fully isolated inside this Sandbox session. Clear your browser cache at any time to reset your student pathways.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
