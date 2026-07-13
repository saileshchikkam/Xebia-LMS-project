import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, GraduationCap, ShieldCheck, ArrowRight, Activity, Users, Award, Clock, Star, Layers, Settings, ChevronRight, Zap, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import XebiaLogo from './XebiaLogo';
import XebiaLiveBackground from './XebiaLiveBackground';

interface LandingPageProps {
  onOpenAuth: (role: 'Student' | 'Admin') => void;
  publicTab: string;
  setPublicTab: (tab: string) => void;
}

export default function LandingPage({ 
  onOpenAuth, 
  publicTab, 
  setPublicTab
}: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      onOpenAuth('Student');
    }
  };

  // Enforce light mode globally
  const isDarkMode = false;

  // Theme-aware style helpers
  const bgBase = 'bg-[#F8F9FC] text-slate-800';
  const cardBg = 'bg-white border border-slate-200/80 shadow-lg shadow-slate-200/50';
  const textMuted = 'text-slate-500';
  const textTitle = 'text-slate-900';
  const textSubTitle = 'text-slate-700';
  const borderMuted = 'border-slate-200';
  const headerBg = 'bg-white/90 border-b border-slate-200/80 shadow-sm';
  const footerBg = 'bg-white border-t border-slate-200/80 shadow-md';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${bgBase}`} id="landing-page-root">
      {/* Landing Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between transition-colors duration-300 ${headerBg}`}>
        <div className="flex items-center space-x-8">
          {/* Bigger, clearly visible header logo */}
          <XebiaLogo height={42} textColor="#681D5F" className="cursor-pointer" onClick={() => setPublicTab('home')} />
          
          <nav className="hidden md:flex space-x-1.5">
            {['home', 'portals', 'features', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setPublicTab(tab)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-full ${
                  publicTab === tab 
                    ? 'text-[#681D5F] bg-[#681D5F]/10'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab === 'about' ? 'About Us' : tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onOpenAuth('Student')}
            className="bg-[#681D5F] hover:bg-[#A9169A] text-white font-extrabold text-xs px-6 py-3 rounded-full transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-purple-950/20 uppercase tracking-widest"
            id="landing-get-started-btn"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* TAB: HOME */}
        {publicTab === 'home' && (
          <div className="space-y-16 pb-16" id="landing-home-tab">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden py-20 sm:py-28 text-center border-b border-white/5">
              <XebiaLiveBackground variant={isDarkMode ? 'dark' : 'light'} interactive={true} />
              
              <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* PROMINENT BRAND LOGO ANCHOR IN HERO */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="flex justify-center mb-10"
                >
                  <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-[#09080E]/40' : 'bg-white/80'} backdrop-blur-md border ${borderMuted} shadow-2xl`}>
                    <XebiaLogo height={64} textColor={isDarkMode ? '#FFFFFF' : '#681D5F'} />
                  </div>
                </motion.div>

                {/* Enterprise Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6 text-xs font-black font-mono uppercase tracking-widest border ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/15 text-[#681D5F]' 
                      : 'bg-[#681D5F]/10 border-[#681D5F]/20 text-[#681D5F]'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-[#681D5F]" />
                  <span>Xebia Enterprise Learning Ecosystem</span>
                </motion.div>

                {/* Main Hero Title - Extra Bold display typography */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight ${textTitle}`}
                >
                  Welcome to <span className="bg-gradient-to-r from-[#681D5F] via-purple-400 to-[#681D5F] bg-clip-text text-transparent">Xebia LMS</span>
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-base sm:text-lg font-black uppercase tracking-[0.25em] text-[#681D5F] font-mono"
                >
                  Enterprise Learning Management System
                </motion.h2>

                {/* Slogan Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed font-medium ${textSubTitle}`}
                >
                  Empower your workforce with AI-powered learning, intelligent analytics, and a unified platform for training, upskilling, certifications, and employee development.
                </motion.p>

                {/* Action CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 flex justify-center"
                >
                  <button
                    onClick={() => onOpenAuth('Student')}
                    className="bg-gradient-to-r from-[#681D5F] to-[#921484] hover:brightness-110 text-white font-extrabold text-sm px-10 py-4.5 rounded-full transition-all shadow-xl shadow-purple-950/20 cursor-pointer flex items-center space-x-2.5 uppercase tracking-widest"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </motion.div>
              </div>
            </div>

            {/* PORTALS SWITCHER CONTAINER */}
            <div className="max-w-6xl mx-auto px-4" id="landing-portals-section">
              <div className="text-center space-y-3 mb-12">
                <h3 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${textTitle}`}>Explore Our Portals</h3>
                <p className={`${textMuted} text-xs md:text-sm font-sans max-w-lg mx-auto`}>
                  Select the portal that best fits your role and access personalized learning tools or administrative suites.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* STUDENT PORTAL CARD */}
                <div className={`${cardBg} rounded-3xl p-8 text-left space-y-6 hover:border-[#681D5F]/50 transition-all shadow-2xl relative group`}>
                  <div className="h-12 w-12 rounded-2xl bg-[#681D5F]/10 flex items-center justify-center text-[#681D5F]">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className={`text-xl font-black group-hover:text-[#681D5F] transition-colors ${textTitle}`}>Student Portal</h4>
                    <p className={`text-xs leading-relaxed font-sans ${textMuted}`}>
                      Access your courses, track progress, attend assessments, earn credentials, and enhance your skills.
                    </p>
                  </div>
                  <ul className={`space-y-2 text-xs border-t ${borderMuted} pt-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>My Learning Dashboard</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>Courses & Curriculum</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>Assessments & Quizzes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>Certifications</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>Progress & Feedback</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onOpenAuth('Student')}
                    className={`w-full font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                      isDarkMode 
                        ? 'bg-white/10 hover:bg-[#681D5F]/20 text-white border-white/10 hover:border-[#681D5F]/30' 
                        : 'bg-slate-50 hover:bg-[#681D5F] hover:text-white text-slate-800 border-slate-200 hover:border-[#681D5F]'
                    }`}
                  >
                    <span>Student Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* ADMIN PORTAL CARD */}
                <div className={`${cardBg} rounded-3xl p-8 text-left space-y-6 hover:border-[#681D5F]/50 transition-all shadow-2xl relative group`}>
                  <div className="h-12 w-12 rounded-2xl bg-[#681D5F]/10 flex items-center justify-center text-[#681D5F]">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className={`text-xl font-black group-hover:text-[#681D5F] transition-colors ${textTitle}`}>Admin Portal</h4>
                    <p className={`text-xs leading-relaxed font-sans ${textMuted}`}>
                      The central hub for architects and executives. Generate courses via AI, manage complex curriculums, and analyze workforce data.
                    </p>
                  </div>
                  <ul className={`space-y-2 text-xs border-t ${borderMuted} pt-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>AI-Powered Content Generation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>4-Level Curriculum Hierarchy Builder</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>15-Page Predictive Analytics Suite</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>Skill Gap & Recommendation Engine</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#681D5F]" />
                      <span>Enterprise User Management</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onOpenAuth('Admin')}
                    className="w-full font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer border bg-slate-50 hover:bg-[#681D5F] hover:text-white text-slate-800 border-slate-200 hover:border-[#681D5F]"
                  >
                    <span>Admin Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* PERFORMANCE KPI STATS PANEL */}
            <div className={`max-w-6xl mx-auto px-4 border rounded-3xl py-10 ${cardBg}`} id="landing-stats-grid">
              <div className={`grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x ${borderMuted}`}>
                <div className="p-4">
                  <span className={`block text-3xl font-black ${textTitle}`}>12,580+</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mt-1">Students Enrolled</span>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">+18% this month</span>
                </div>
                <div className="p-4 pt-8 md:pt-4">
                  <span className={`block text-3xl font-black ${textTitle}`}>1,248+</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mt-1">Active Courses</span>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">+12.7% this month</span>
                </div>
                <div className="p-4 pt-8 md:pt-4">
                  <span className={`block text-3xl font-black ${textTitle}`}>45,680+</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mt-1">Learning Hours</span>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">+124.5 hrs this week</span>
                </div>
                <div className="p-4 pt-8 md:pt-4">
                  <span className={`block text-3xl font-black ${textTitle}`}>8,945+</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mt-1">Certifications</span>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">+134.5% this month</span>
                </div>
                <div className="p-4 pt-8 md:pt-4">
                  <span className={`block text-3xl font-black ${textTitle}`}>82%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mt-1">AI Readiness Score</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-bold">Global benchmark standard</span>
                </div>
              </div>
            </div>

            {/* PLATFORM HIGHLIGHTS BENTO GRID */}
            <div className="max-w-6xl mx-auto px-4 space-y-8" id="landing-bento-section">
              <div className="text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#681D5F] font-mono block">Platform Highlights</span>
                <h3 className={`text-2xl md:text-3xl font-black max-w-4xl mx-auto leading-tight ${textTitle}`}>We've engineered a robust suite of tools that bridge the gap between content creation and actionable workforce intelligence.</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Zap, title: 'AI-Powered Learning', desc: 'Personalized learning paths and AI-driven course recommendation engines.' },
                  { icon: Layers, title: 'Curriculum Management', desc: 'Create, organize and manage courses, modules, and learning content.' },
                  { icon: Activity, title: 'Assessments & Quizzes', desc: 'Interactive assessments, automated grading, and performance analytics.' },
                  { icon: Award, title: 'Certifications', desc: 'Industry-recognized certifications and digital credential management.' },
                  { icon: Compass, title: 'Advanced Analytics', desc: 'Real-time dashboards and insights to drive learning outcomes.' },
                  { icon: Users, title: 'Employee Development', desc: 'Track skills, learning programs, and career development.' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={`${cardBg} rounded-2xl p-6 text-left space-y-3 hover:scale-[1.02] transition-all`}>
                      <div className="h-10 w-10 rounded-xl bg-[#681D5F]/10 flex items-center justify-center text-[#681D5F]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className={`font-black text-sm ${textTitle}`}>{item.title}</h4>
                      <p className={`text-[11.5px] leading-relaxed font-sans ${textMuted}`}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PORTALS */}
        {publicTab === 'portals' && (
          <div className="py-16 space-y-12" id="landing-portals-tab">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#681D5F] font-mono block">Enterprise Gateways</span>
              <h3 className={`text-3xl font-black ${textTitle}`}>Select Your Secure Portal</h3>
            </div>
            <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`${cardBg} rounded-3xl p-8 text-left space-y-6 hover:border-[#681D5F]/50 transition-all shadow-2xl relative group`}>
                <div className="h-12 w-12 rounded-2xl bg-[#681D5F]/10 flex items-center justify-center text-[#681D5F]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h4 className={`text-xl font-black ${textTitle}`}>Student Portal</h4>
                  <p className={`text-xs leading-relaxed font-sans ${textMuted}`}>
                    Gain direct credentials. Learn cloud, software architecture, DevOps pipelines, and agile frameworks on demand.
                  </p>
                </div>
                <button
                  onClick={() => onOpenAuth('Student')}
                  className="w-full bg-[#681D5F] hover:bg-[#A9169A] text-white font-extrabold text-xs py-4 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-950/10 uppercase tracking-widest"
                >
                  <span>Enter Student Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className={`${cardBg} rounded-3xl p-8 text-left space-y-6 hover:border-[#681D5F]/50 transition-all shadow-2xl relative group`}>
                <div className="h-12 w-12 rounded-2xl bg-[#681D5F]/10 flex items-center justify-center text-[#681D5F]">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h4 className={`text-xl font-black ${textTitle}`}>Admin Portal</h4>
                  <p className={`text-xs leading-relaxed font-sans ${textMuted}`}>
                    Publish curriculums, generate exams automatically, track user study velocity, and configure custom learning badges.
                  </p>
                </div>
                <button
                  onClick={() => onOpenAuth('Admin')}
                  className="w-full bg-[#681D5F] hover:bg-[#A9169A] text-white font-extrabold text-xs py-4 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-950/10 uppercase tracking-widest"
                >
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FEATURES */}
        {publicTab === 'features' && (
          <div className="py-16 max-w-6xl mx-auto px-4 space-y-12 animate-fade-in" id="landing-features-tab">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#681D5F] font-mono block">Robust Capability Stack</span>
              <h3 className={`text-3xl font-black ${textTitle}`}>Advanced Learning Engineering</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`${cardBg} p-6 rounded-2xl text-left space-y-4`}>
                <h4 className={`font-black text-base ${textTitle}`}>Student Interface Features</h4>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Interactive video and reading material player.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Self-evaluation quizzes with instant rationale and explanations.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Batch and classroom cohort tracker with active calendars.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Downloadable credentials vault for verifiable certificates.</span>
                  </li>
                </ul>
              </div>

              <div className={`${cardBg} p-6 rounded-2xl text-left space-y-4`}>
                <h4 className={`font-black text-base ${textTitle}`}>Executive & Admin Tools</h4>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Curriculum generator: dynamic modules and lessons creation.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Enterprise student registry: live status, study hours, and completions tracking.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Time-series study activity charts and topic popularity distributions.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="p-1 text-[#681D5F] text-sm">&bull;</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Custom course category manager with search filters.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ABOUT US */}
        {publicTab === 'about' && (
          <div className="py-16 max-w-6xl mx-auto px-4 space-y-12 text-left" id="landing-about-tab">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#681D5F] font-mono block">Enterprise Overview</span>
              <h3 className={`text-3xl font-black ${textTitle}`}>About Xebia Enterprise LMS</h3>
            </div>
            
            <div className={`${cardBg} rounded-3xl p-8 space-y-6`}>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Engineered for scale and designed for engagement, Xebia Enterprise LMS is a production-grade learning ecosystem. It seamlessly bridges the gap between organizational learning goals and continuous employee development.
              </p>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 border-t ${borderMuted} pt-6`}>
                <div className="space-y-4">
                  <h4 className="font-bold text-[#681D5F] text-sm uppercase tracking-wider font-mono">Student Portal Capabilities</h4>
                  <ul className={`space-y-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>&bull; Personalized Learning Dashboard</li>
                    <li>&bull; Course Catalogue & Full Playback</li>
                    <li>&bull; Interactive Assessments & Feedback</li>
                    <li>&bull; Notifications Centre</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-[#681D5F] text-sm uppercase tracking-wider font-mono">Admin Portal Capabilities</h4>
                  <ul className={`space-y-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>&bull; AI-Powered Course Creation</li>
                    <li>&bull; Advanced 4-Level Curriculum Builder</li>
                    <li>&bull; Category & Content Management</li>
                    <li>&bull; Profile Settings & Analytics</li>
                  </ul>
                </div>
              </div>

              {/* Infrastructure and Tech Stack */}
              <div className={`border-t ${borderMuted} pt-6 space-y-4`}>
                <h4 className={`font-black text-sm ${textTitle}`}>Infrastructure & Tech Stack</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className={`${cardBg} p-3 rounded-lg`}>
                    <span className="text-[#681D5F] font-bold block">Frontend</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>React 18, Vite, Tailwind CSS</span>
                  </div>
                  <div className={`${cardBg} p-3 rounded-lg`}>
                    <span className="text-[#681D5F] font-bold block">State Mgmt</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>React State, Local Cache</span>
                  </div>
                  <div className={`${cardBg} p-3 rounded-lg`}>
                    <span className="text-[#681D5F] font-bold block">Charts Engine</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Recharts Visualization</span>
                  </div>
                  <div className={`${cardBg} p-3 rounded-lg`}>
                    <span className="text-[#681D5F] font-bold block">Database</span>
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Sandbox Persistent Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Replica of the uploaded image */}
      <footer className="py-16 text-xs transition-colors duration-300 bg-slate-900 border-t border-slate-800 text-slate-300" id="enterprise-footer-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12">
            {/* Column 1: Brand Icon & Description */}
            <div className="space-y-4">
              {/* White organic pebble icon representing the brand */}
              <div className="h-8 w-10 bg-white rounded-full flex items-center justify-center shadow-inner" style={{ clipPath: 'path("M 5 15 C 3 7, 10 2, 20 2 C 30 2, 37 7, 35 15 C 33 23, 27 28, 18 27 C 10 26, 7 22, 5 15 Z")' }} id="footer-brand-pebble">
                <span className="h-2 w-2 rounded-full bg-[#681D5F]" />
              </div>
              <p className="text-xs leading-relaxed text-slate-400 max-w-xs font-medium">
                Xebia Academy Enterprise LMS drives professional upskilling, coaching, and certifications at leading global digital agencies.
              </p>
            </div>

            {/* Column 2: PRACTICE STREAMS */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-white text-[11px] uppercase tracking-[0.15em] font-mono">
                PRACTICE STREAMS
              </h5>
              <ul className="space-y-2.5 text-slate-400 font-medium">
                <li><a href="#aws" className="hover:text-white transition-colors">Cloud & AWS Architect</a></li>
                <li><a href="#k8s" className="hover:text-white transition-colors">DevOps & Kubernetes</a></li>
                <li><a href="#agile" className="hover:text-white transition-colors">Agile Leadership & Scrum</a></li>
                <li><a href="#ai" className="hover:text-white transition-colors">Generative AI & LLMs</a></li>
              </ul>
            </div>

            {/* Column 3: CREDENTIALS VAULT */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-white text-[11px] uppercase tracking-[0.15em] font-mono">
                CREDENTIALS VAULT
              </h5>
              <ul className="space-y-2.5 text-slate-400 font-medium">
                <li><a href="#aws-cert" className="hover:text-white transition-colors">AWS Certified Solutions Architect</a></li>
                <li><a href="#cka" className="hover:text-white transition-colors">Certified Kubernetes Administrator</a></li>
                <li><a href="#psm" className="hover:text-white transition-colors">Professional Scrum Master I (PSM I)</a></li>
                <li><a href="#badge" className="hover:text-white transition-colors">Xebia Frontend Architect badge</a></li>
              </ul>
            </div>

            {/* Column 4: COMPLIANCE & STATUS */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-white text-[11px] uppercase tracking-[0.15em] font-mono">
                COMPLIANCE
              </h5>
              <p className="text-xs leading-relaxed text-slate-400">
                Licensed corporate cloud instance. Under corporate security SLA policies.
              </p>
              
              {/* Compliance node operational badge */}
              <div className="bg-[#121824] border border-slate-800 rounded-xl px-4 py-2.5 flex items-center space-x-2.5 max-w-xs shadow-md" id="node-status-badge">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-300 tracking-wide uppercase">
                  All enterprise nodes operational
                </span>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-slate-800/80 my-2" />

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-4 text-[11px] text-slate-500 font-medium">
            <div>
              &copy; 2026 Xebia Academy Solutions. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 md:space-x-6 text-slate-500 font-semibold uppercase tracking-wider">
              <a href="#sla" className="hover:text-white transition-colors">SLA Agreement</a>
              <span>&middot;</span>
              <a href="#security" className="hover:text-white transition-colors">Security Standards</a>
              <span>&middot;</span>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Protocol</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
