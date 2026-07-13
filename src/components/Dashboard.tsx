import React from 'react';
import { Course, UserProgress } from '../types';
import { COURSES } from '../data';
import { Calendar, PlayCircle, Sparkles, Trophy, Search, ArrowRight, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import XebiaLogo from './XebiaLogo';
import XebiaLiveBackground from './XebiaLiveBackground';

interface DashboardProps {
  userProgress: UserProgress;
  onSelectCourse: (course: Course) => void;
  onNavigateToCatalog: () => void;
  userProfile: { displayName: string; role: 'Student' | 'Admin'; title: string } | null;
  onOpenAuth?: (role: 'Student' | 'Admin') => void;
  onShowNotice?: (title: string, message: string) => void;
}

export default function Dashboard({
  userProgress,
  onSelectCourse,
  onNavigateToCatalog,
  userProfile,
  onOpenAuth,
  onShowNotice
}: DashboardProps) {
  
  // Handlers to link Dashboard actions with real app features!
  const handleResumeActive = () => {
    if (!userProfile) {
      onOpenAuth?.('Student');
      return;
    }
    const activeCourse = COURSES.find(c => c.id === 'course-aws-arch');
    if (activeCourse) onSelectCourse(activeCourse);
  };

  const handleStartDDD = () => {
    if (!userProfile) {
      onOpenAuth?.('Student');
      return;
    }
    const dddCourse = COURSES.find(c => c.id === 'course-product-roadmap');
    if (dddCourse) onSelectCourse(dddCourse);
  };

  const handleStartGenAI = () => {
    if (!userProfile) {
      onOpenAuth?.('Student');
      return;
    }
    const aiCourse = COURSES.find(c => c.id === 'course-genai-prompt');
    if (aiCourse) onSelectCourse(aiCourse);
  };

  // Dynamically count completed courses from user progress
  const activeCertificatesCount = String(userProgress.completedCourseIds.length).padStart(2, '0');
  
  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-8" id="learner-dashboard">
      
      {/* Immersive Corporate Slogan & Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B090F] text-white p-8 md:p-12 shadow-2xl border border-[#831B84]/20" id="dashboard-hero-banner">
        {/* Animated Background of Logo and Live Animations */}
        <XebiaLiveBackground variant="dark" interactive={true} />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          
          <div className="text-left space-y-4 max-w-2xl">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full bg-[#831B84]/20 border border-[#831B84]/40 px-3.5 py-1 text-xs font-semibold text-purple-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Xebia Academy Enterprise Partner</span>
            </div>

            {/* Slogan */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-purple-300 block font-semibold">
                Slogan Focus
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-purple-100 to-[#FF5A36] bg-clip-text text-transparent">
                Shaping Tomorrow with AI Today
              </h2>
            </div>

            {/* Greeting */}
            <div className="pt-2">
              <h1 className="text-xl md:text-2xl font-light text-slate-300">
                {userProfile ? (
                  <>Welcome back, <span className="font-bold text-white">{userProfile.displayName}</span></>
                ) : (
                  <>Welcome to <span className="font-bold text-white">Xebia Academy Portal</span></>
                )}
              </h1>
              <p className="text-xs text-slate-400 font-serif italic mt-1">
                {userProfile ? (
                  <>{userProfile.title || 'Senior Frontend Architect'} &bull; Cohort Track 82% Completed</>
                ) : (
                  <>Guest Mode &bull; Click "Student Portal" or "Admin Portal" to access full learning pathways</>
                )}
              </p>
            </div>
          </div>

          {/* Premium Glassmorphism Stats Cards */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto shrink-0 justify-start lg:justify-end">
            
            {/* Hours Learned Stats Card */}
            <div className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-4 text-left min-w-[150px] shadow-lg">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#831B84] to-purple-600 flex items-center justify-center text-white shadow-md">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-white font-sans">12</div>
                <div className="text-[9px] leading-tight uppercase font-extrabold text-slate-400 tracking-wider font-mono">
                  Hours<br />Learned
                </div>
              </div>
            </div>

            {/* Certificates Stats Card */}
            <div className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-4 text-left min-w-[150px] shadow-lg">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF5A36] to-orange-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-white font-sans">
                  {activeCertificatesCount === '00' ? '04' : activeCertificatesCount}
                </div>
                <div className="text-[9px] leading-tight uppercase font-extrabold text-slate-400 tracking-wider font-mono">
                  Active<br />Certificates
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Ambient watermark logo glow at bottom right */}
        <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none">
          <XebiaLogo height={45} textColor="#FFFFFF" iconOnly={true} />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Current & Recommended Courses */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Active Course Card */}
          <div className="relative group overflow-hidden rounded-3xl bg-[#1A1A1B] text-white p-10 text-left min-h-72 flex flex-col justify-between">
            <div className="relative z-10">
              <span className="px-3 py-1 bg-[#831B84] text-[10px] font-bold tracking-widest uppercase rounded-full font-mono">
                Current Course
              </span>
              <h2 className="text-4xl font-bold mt-4 max-w-lg leading-tight font-sans">
                Advanced Enterprise Architecture with Microservices
              </h2>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 mt-6">
              <div className="flex-grow w-full md:w-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-mono text-gray-300">Active Progress</span>
                  <span className="text-sm font-mono font-bold text-[#831B84]">65% Complete</span>
                </div>
                <div className="bg-white/10 h-1 w-full rounded-full overflow-hidden">
                  <div className="bg-[#831B84] h-full w-[65%] transition-all duration-500"></div>
                </div>
              </div>
              <button 
                onClick={handleResumeActive}
                className="bg-white text-black hover:bg-[#831B84] hover:text-white px-8 py-3 rounded-full font-bold text-sm transition-all shrink-0 cursor-pointer shadow-xs font-sans"
              >
                Resume Learning
              </button>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -bottom-20 w-80 h-80 bg-[#831B84] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          </div>

          {/* Recommendations Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Domain Driven Design */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow text-left">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase text-gray-400 rounded-md font-mono">
                  Recommended
                </span>
                <span className="text-xs font-semibold text-[#831B84] font-sans">14.5 Hours</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-1 font-sans">Domain Driven Design</h3>
                <p className="text-xs text-gray-500 font-serif italic">
                  Master the strategic patterns used by top-tier architectural consultants.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 font-mono">Advanced</span>
                <button 
                  onClick={handleStartDDD}
                  className="text-xs font-bold text-[#831B84] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Start Pathway →
                </button>
              </div>
            </div>

            {/* Generative AI for Devs */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow text-left">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase text-gray-400 rounded-md font-mono">
                  Trending
                </span>
                <span className="text-xs font-semibold text-[#831B84] font-sans">4 Modules</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-1 font-sans">Generative AI for Devs</h3>
                <p className="text-xs text-gray-500 font-serif italic">
                  Harness the power of LLMs to accelerate your enterprise development cycle.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 font-mono">Beginner Friendly</span>
                <button 
                  onClick={handleStartGenAI}
                  className="text-xs font-bold text-[#831B84] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Start Pathway →
                </button>
              </div>
            </div>

          </div>

        </section>

        {/* Right Column: Upcoming Workshops & Xebia Points */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Upcoming Workshops */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs flex-1 text-left">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-sans text-black">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Upcoming Workshops
            </h3>
            
            <div className="flex flex-col gap-4">
              
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100/50 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-black font-sans">Cloud Native Strategies</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-serif italic">Led by Marc van Holst</p>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">OCT 14</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100/50 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-black font-sans">Data Science at Scale</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-serif italic">Led by Dr. Elena Rossi</p>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">OCT 19</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100/50 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-black font-sans">Security Best Practices</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-serif italic">Internal Certification</p>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">NOV 03</span>
              </div>

            </div>
          </div>

          {/* Enterprise Sandbox Status Card */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs text-left flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2 font-sans text-black">
                  <HardDrive className="h-4.5 w-4.5 text-emerald-500" /> Enterprise Sandbox
                </h3>
                <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed">
                You are currently running in Sandbox mode. Your enrolled courses, certifications, and learning progress are saved securely inside your browser's persistent storage.
              </p>
            </div>
            
            <div className="w-full bg-gray-50 text-gray-500 font-semibold text-xs py-2.5 rounded-xl border border-gray-100 text-center select-none">
              ⚡ Local Database Sync Connected
            </div>
          </div>

          {/* Xebia Points */}
          <div className="bg-gradient-to-br from-[#1A1A1B] to-black text-white p-6 rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden text-left">
            <div className="relative z-10">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">
                Xebia Points
              </span>
              <div className="text-5xl font-black mt-2 font-sans tracking-tight">2,450</div>
              <p className="text-[10px] text-gray-400 mt-1 font-serif italic">
                Top 5% of active cohort learners.
              </p>
            </div>
            
            <button 
              onClick={() => {
                if (!userProfile) {
                  onOpenAuth?.('Student');
                  return;
                }
                if (onShowNotice) {
                  onShowNotice(
                    "Cohort Leaderboard",
                    `Leaderboard: ${userProfile.displayName || 'Sarah Jenkins'} is currently ranked #3 in the enterprise cohort with 2,450 points! Keep completing pathways to reach #1.`
                  );
                }
              }}
              className="relative z-10 w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer font-sans"
            >
              View Leaderboard
            </button>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#FF5A36] rounded-full blur-2xl opacity-20 pointer-events-none"></div>
          </div>

        </aside>

      </div>

    </div>
  );
}
