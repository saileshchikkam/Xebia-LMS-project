import React, { useState } from 'react';
import { Course, UserProgress } from '../types';
import { COURSES, SKILL_ASSESSMENTS } from '../data';
import CourseCatalog from './CourseCatalog';
import CoursePlayer from './CoursePlayer';
import AssessmentEngine from './AssessmentEngine';
import { 
  LayoutDashboard, BookOpen, Users, ClipboardList, BarChart3, Bell, MessageSquare, 
  LogOut, PlayCircle, Star, Award, Settings, Search, CheckCircle, ArrowRight, User, ShieldAlert,
  Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import XebiaLogo from './XebiaLogo';

// Mock learning activity data for student
const STUDY_TREND_DATA = [
  { name: 'Mon', hours: 1.5 },
  { name: 'Tue', hours: 2.0 },
  { name: 'Wed', hours: 3.5 },
  { name: 'Thu', hours: 1.0 },
  { name: 'Fri', hours: 4.0 },
  { name: 'Sat', hours: 0.5 },
  { name: 'Sun', hours: 0.0 }
];

const SUBJECT_PERFORMANCE_DATA = [
  { subject: 'Architecture', score: 85 },
  { subject: 'DevOps', score: 92 },
  { subject: 'Agile', score: 78 },
  { subject: 'Front-End', score: 88 }
];

interface StudentPortalProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  onLogout: () => void;
}

export default function StudentPortal({
  userProgress,
  setUserProgress,
  userProfile,
  setUserProfile,
  onLogout
}: StudentPortalProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  
  // Settings edit modal or form inputs
  const [fullName, setFullName] = useState<string>(userProfile?.displayName || 'Student');
  const [emailAddress, setEmailAddress] = useState<string>(userProfile?.email || 'student@xebia.com');
  const [university, setUniversity] = useState<string>('Xebia Academy');
  
  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'New Course Assigned: "Advanced React 19 & Architecture Patterns"', time: '2 hours ago', read: false },
    { id: 'n-2', text: 'Assessment Reminder: Your "React Final Exam" is due in 2 days.', time: '5 hours ago', read: false },
    { id: 'n-3', text: 'Trainer Replied: Sarah Dresner replied to your comment in "State Management".', time: '1 day ago', read: false },
    { id: 'n-4', text: 'Result Published: Your "Design Systems Assignment" results are out.', time: '2 days ago', read: false }
  ]);

  // Feedback Form State
  const [feedbackCourse, setFeedbackCourse] = useState<string>('course-aws-arch');
  const [feedbackTrainer, setFeedbackTrainer] = useState<string>('John Smith');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Dialog/Alert Toasts
  const [toast, setToast] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  const triggerToast = (msg: string) => {
    setToast({ isOpen: true, message: msg });
    setTimeout(() => setToast({ isOpen: false, message: '' }), 4000);
  };

  // Mark single completion
  const handleMarkLessonComplete = (lessonId: string, complete: boolean) => {
    const course = COURSES.find(c => 
      c.syllabus.some(m => m.lessons.some(l => l.id === lessonId))
    );
    if (!course) return;

    let updatedCompleted = [...userProgress.completedLessons];
    if (complete) {
      if (!updatedCompleted.includes(lessonId)) updatedCompleted.push(lessonId);
    } else {
      updatedCompleted = updatedCompleted.filter(id => id !== lessonId);
    }

    const allCourseLessonIds = course.syllabus.flatMap(m => m.lessons.map(l => l.id));
    const completedInCourse = allCourseLessonIds.filter(id => updatedCompleted.includes(id)).length;
    const completionPercentage = Math.round((completedInCourse / allCourseLessonIds.length) * 100);

    let updatedCompletedCourses = [...userProgress.completedCourseIds];
    let updatedCertificates = [...userProgress.certificates];
    let updatedSkills = [...userProgress.skillsMastered];

    if (completionPercentage === 100 && !updatedCompletedCourses.includes(course.id)) {
      updatedCompletedCourses.push(course.id);
      
      const certId = `XEB-${course.category.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
      updatedCertificates.push({
        courseId: course.id,
        issuedAt: new Date().toISOString().split('T')[0],
        certificateId: certId
      });

      course.skillsAcquired.forEach(skill => {
        if (!updatedSkills.includes(skill)) updatedSkills.push(skill);
      });
      triggerToast(`Congratulations! You have completed "${course.title}" and unlocked a verifiable credential!`);
    } else if (completionPercentage < 100 && updatedCompletedCourses.includes(course.id)) {
      updatedCompletedCourses = updatedCompletedCourses.filter(id => id !== course.id);
      updatedCertificates = updatedCertificates.filter(cert => cert.courseId !== course.id);
    }

    setUserProgress({
      ...userProgress,
      completedLessons: updatedCompleted,
      courseCompletion: {
        ...userProgress.courseCompletion,
        [course.id]: completionPercentage
      },
      completedCourseIds: updatedCompletedCourses,
      certificates: updatedCertificates,
      skillsMastered: updatedSkills
    });
  };

  const handleEnroll = (courseId: string) => {
    if (!userProgress.enrolledCourseIds.includes(courseId)) {
      setUserProgress({
        ...userProgress,
        enrolledCourseIds: [...userProgress.enrolledCourseIds, courseId],
        courseCompletion: {
          ...userProgress.courseCompletion,
          [courseId]: 0
        }
      });
      triggerToast('Enrolled in course successfully!');
    }
    const course = COURSES.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleAssessmentCompleted = (category: string) => {
    const mockSkillTag = `${category} Mastered`;
    if (!userProgress.skillsMastered.includes(mockSkillTag)) {
      setUserProgress({
        ...userProgress,
        streakDays: userProgress.streakDays + 1,
        skillsMastered: [...userProgress.skillsMastered, mockSkillTag]
      });
    }
    triggerToast(`Congratulations! You completed the ${category} quiz and boosted your daily learning streak!`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      displayName: fullName,
      email: emailAddress
    });
    triggerToast('Profile parameters updated securely!');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    triggerToast('All unread alerts marked as read.');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Thank you! Your survey feedback for trainer ${feedbackTrainer} has been submitted.`);
    setFeedbackText('');
  };

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'batches', label: 'My Batches', icon: Users },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: notifications.filter(n => !n.read).length },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  const bgBase = 'bg-[#F8F9FC] text-slate-800';
  const sidebarBg = 'bg-white border-r border-slate-200/80 shadow-lg';
  const sidebarHeaderBg = 'border-b border-slate-200';
  const cardBg = 'bg-white border border-slate-200/80 shadow-sm shadow-slate-100';
  const textTitle = 'text-slate-900';
  const textSub = 'text-slate-600';
  const borderMuted = 'border-slate-200';
  const headerBg = 'bg-white/90 border-b border-slate-200/80 shadow-sm';
  const inputBg = 'bg-slate-50 text-slate-800 border border-slate-300 placeholder-slate-400';

  return (
    <div className={`min-h-screen flex ${bgBase} font-sans text-left overflow-hidden`} id="student-portal-container">
      {/* Toast Banner Alert */}
      <AnimatePresence>
        {toast.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[1000] bg-white border border-slate-200 text-slate-900 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-bounce"
          >
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE OVERLAY SIDEBAR */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Sidebar drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 left-0 w-64 ${sidebarBg} z-50 flex flex-col shadow-2xl lg:hidden`}
            >
              {/* Brand Block */}
              <div className={`p-6 ${sidebarHeaderBg} flex items-center justify-between`}>
                <div className="space-y-1">
                  <XebiaLogo height={38} className="cursor-pointer" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#681D5F] block font-mono">
                    STUDENT PORTAL
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSelectedCourse(null);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                        isActive 
                          ? 'bg-purple-50/10 text-[#681D5F] border-l-2 border-[#681D5F]' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#681D5F]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badgeCount && item.badgeCount > 0 ? (
                        <span className="bg-[#681D5F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badgeCount}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer Account info */}
              <div className={`p-4 border-t ${borderMuted} bg-slate-50 flex flex-col space-y-3`}>
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
                    {fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="overflow-hidden">
                    <span className={`block text-xs font-bold ${textTitle} truncate`}>{fullName}</span>
                    <span className="block text-[10px] text-slate-500 truncate">{emailAddress}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full bg-slate-200/80 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Portal</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR NAVIGATION (DESKTOP) */}
      <aside className={`hidden lg:flex w-64 ${sidebarBg} flex-col shrink-0`} id="student-portal-sidebar">
        {/* Brand Block */}
        <div className={`p-6 ${sidebarHeaderBg} space-y-2`}>
          <XebiaLogo height={38} className="cursor-pointer" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#681D5F] block font-mono">
            STUDENT PORTAL
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedCourse(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                  isActive 
                    ? 'bg-purple-500/10 text-[#681D5F] border-l-2 border-[#681D5F]' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#681D5F]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className="bg-[#681D5F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badgeCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Account info */}
        <div className={`p-4 border-t ${borderMuted} bg-slate-50 flex flex-col space-y-3`}>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
              {fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <span className={`block text-xs font-bold ${textTitle} truncate`}>{fullName}</span>
              <span className="block text-[10px] text-slate-500 truncate">{emailAddress}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-slate-200/80 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FC]" id="student-portal-viewport">
        {/* TOP BAR PANEL */}
        <header className={`h-16 ${headerBg} backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0`}>
          {/* Breadcrumb path */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-[#681D5F] hover:bg-slate-100 rounded-lg cursor-pointer mr-1 shrink-0"
              title="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono hidden xs:inline">Student Portal</span>
            <span className="text-slate-400 hidden xs:inline">/</span>
            <span className="text-xs font-bold text-[#681D5F] uppercase tracking-wider font-mono">
              {activeTab}
            </span>
          </div>

          {/* Search bar placeholder & notifications indicators */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative w-48 xl:w-64 hidden md:block">
              <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search courses, assessments..."
                className={`w-full ${inputBg} text-xs rounded-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-1 focus:ring-[#681D5F]/40`}
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 text-slate-400">
              <button onClick={() => setActiveTab('notifications')} className="relative p-1.5 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer rounded-lg">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#681D5F] animate-ping" />
                )}
              </button>
              <button onClick={() => setActiveTab('notifications')} className="p-1.5 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-6 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-mono font-bold bg-[#681D5F]/15 text-[#681D5F] border border-[#681D5F]/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                STREAK: {userProgress.streakDays} DAYS
              </span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PANEL AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in" id="student-dashboard-pane">
              {/* Profile welcome hero banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#681D5F]/10 via-purple-50 to-indigo-50/50 border border-purple-100 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#681D5F]/5 blur-[100px] pointer-events-none" />
                <div className="text-left space-y-2 z-10 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#681D5F] font-mono">
                    Online Environment
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back, {fullName}!
                  </h2>
                  <p className="text-xs text-slate-600 font-sans max-w-lg leading-relaxed">
                    Continue your specialized upskilling path. Keep up your active study routines to score certification credentials and expand your architectural intelligence.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row shrink-0 gap-3 w-full lg:w-auto z-10">
                  {/* Play circle resume button */}
                  <button
                    onClick={() => {
                      const course = COURSES.find(c => c.id === 'course-aws-arch');
                      if (course) {
                        setSelectedCourse(course);
                        setActiveTab('courses');
                      }
                    }}
                    className="bg-[#681D5F] hover:brightness-110 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <PlayCircle className="h-4.5 w-4.5" />
                    <span>Resume Last Course</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('assessments')}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="h-4.5 w-4.5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* 4 KPIs grid row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-left space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Enrolled Courses</span>
                  <span className="text-2xl font-black text-slate-900 block">{userProgress.enrolledCourseIds.length} Active</span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">Study log active</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-left space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Pending Exams</span>
                  <span className="text-2xl font-black text-slate-900 block">1 Active</span>
                  <span className="text-[10px] text-rose-600 block font-semibold">Action Required</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-left space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Completed Paths</span>
                  <span className="text-2xl font-black text-slate-900 block">{userProgress.completedCourseIds.length} Finished</span>
                  <span className="text-[10px] text-slate-500 block font-semibold">Certificates issued</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-left space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Unread Alerts</span>
                  <span className="text-2xl font-black text-slate-900 block">{notifications.filter(n => !n.read).length} Unread</span>
                  <span className="text-[10px] text-purple-600 block font-semibold">New comments</span>
                </div>
              </div>

              {/* Charts row container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recharts study trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-900">Learning Activity</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Hours spent study learning on specialized chapters by weekday.</p>
                  </div>
                  <div className="h-56 w-full pt-2 text-slate-700">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={STUDY_TREND_DATA} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                        <defs>
                          <linearGradient id="purpleG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#681D5F" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#681D5F" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                        <Area type="monotone" dataKey="hours" stroke="#681D5F" fillOpacity={1} fill="url(#purpleG)" strokeWidth={2} name="Hours Spent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recharts subject scores */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-900">Subject Performance</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Average compliance grade score achieved per practice stream.</p>
                  </div>
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SUBJECT_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                        <XAxis dataKey="subject" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                        <Bar dataKey="score" fill="#681D5F" radius={[4, 4, 0, 0]} maxBarSize={28} name="Score Percentage" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-8 animate-fade-in" id="student-courses-pane">
              {!selectedCourse ? (
                /* Embed Catalog */
                <div className="bg-slate-50 p-2 sm:p-4 rounded-3xl border border-slate-200/50">
                  <CourseCatalog
                    onEnroll={handleEnroll}
                    enrolledCourseIds={userProgress.enrolledCourseIds}
                    courseCompletion={userProgress.courseCompletion}
                    onSelectCourse={(course) => setSelectedCourse(course)}
                    searchQuery={catalogSearch}
                  />
                </div>
              ) : (
                /* Course Player inside Portal layout */
                <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 space-y-4 text-left shadow-sm">
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold inline-flex items-center space-x-2 mb-4 cursor-pointer"
                  >
                    <span>&larr; Back to Catalog</span>
                  </button>
                  <CoursePlayer
                    course={selectedCourse}
                    userProgress={userProgress}
                    onMarkLessonComplete={handleMarkLessonComplete}
                    onBackToCatalog={() => setSelectedCourse(null)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB: BATCHES */}
          {activeTab === 'batches' && (
            <div className="space-y-8 animate-fade-in text-left" id="student-batches-pane">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Active Training Cohorts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Explore your assigned classroom timelines, schedules, and classmates list.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-bold uppercase">
                      ACTIVE BOOTCAMP
                    </span>
                    <span className="text-[10px] text-slate-500">24 Classmates</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">XEBIA-2026-A1 Frontend Engineering Bootcamp</h4>
                  <div className="space-y-2 text-xs text-slate-400 font-mono">
                    <p><strong>Duration:</strong> Jan 10, 2026 - Jun 30, 2026</p>
                    <p><strong>Schedule:</strong> Mon, Wed, Fri 11:00 AM - 1:00 PM</p>
                    <p><strong>Location:</strong> Hybrid (Online & Gurugram Campus)</p>
                    <p><strong>Instructor:</strong> John Smith (Global Principal)</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10.5px] text-[#681D5F] font-bold">82% Attendance Rating</span>
                    <button onClick={() => triggerToast('Launching digital classroom node...')} className="text-xs bg-[#681D5F] hover:brightness-110 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                      Enter Class
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 opacity-75 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">
                      COMPLETED COHORT
                    </span>
                    <span className="text-[10px] text-slate-500">30 Classmates</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">XEBIA-2025-B2 Cloud Native Essentials</h4>
                  <div className="space-y-2 text-xs text-slate-600 font-mono">
                     <p><strong>Duration:</strong> Jul 1, 2025 - Dec 15, 2025</p>
                    <p><strong>Schedule:</strong> Tue, Thu 2:00 PM - 4:00 PM</p>
                    <p><strong>Location:</strong> Online Sandbox Nodes</p>
                    <p><strong>Instructor:</strong> Michael Doe (Consultant)</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10.5px] text-emerald-600 font-bold">100% Path Approved</span>
                    <span className="text-xs text-slate-500 italic">Cohort Closed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div className="space-y-8 animate-fade-in" id="student-assessments-pane">
              <AssessmentEngine
                onAssessmentCompleted={handleAssessmentCompleted}
                isAuthenticated={true}
              />
            </div>
          )}

          {/* TAB: RESULTS */}
          {activeTab === 'results' && (
            <div className="space-y-8 animate-fade-in text-left" id="student-results-pane">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Credentials & Certificates Vault</h3>
                <p className="text-xs text-slate-500 mt-0.5">Explore your finalized courses, diagnostic scores, and verifiable badges.</p>
              </div>

              {/* Grid of earned certificates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProgress.certificates.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center md:col-span-2 space-y-4 shadow-sm">
                    <Award className="h-12 w-12 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">No certificates earned yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Complete any catalog path (100% lessons marked as done) to generate and unlock your digital certified credentials.
                    </p>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="bg-[#681D5F] hover:brightness-110 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Start Studying
                    </button>
                  </div>
                ) : (
                  userProgress.certificates.map((cert) => {
                    const course = COURSES.find(c => c.id === cert.courseId);
                    return (
                      <div key={cert.certificateId} className="bg-gradient-to-br from-[#681D5F]/5 to-white rounded-2xl border border-[#681D5F]/20 p-6 space-y-4 flex flex-col justify-between shadow-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Award className="h-7 w-7 text-amber-500" />
                            <span className="font-mono text-[9px] bg-purple-500/10 text-[#681D5F] px-2 py-1 rounded-md border border-purple-500/20 uppercase font-bold">
                              ID: {cert.certificateId}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-950 text-base mt-2">{course?.title}</h4>
                          <p className="text-[10px] text-slate-500">Xebia Academy Certification Pathways</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-mono">Issued: {cert.issuedAt}</span>
                          <button
                            onClick={() => triggerToast(`Certificate PDF printed to local spooler. ID: ${cert.certificateId}`)}
                            className="bg-[#681D5F] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer hover:brightness-110"
                          >
                            Print Certificate
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Recent Results breakdown table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">Recent Evaluation Scores</h4>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                        <th className="p-4">Practice Domain</th>
                        <th className="p-4">Quiz title</th>
                        <th className="p-4">Evaluation Score</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-4 font-bold text-slate-900">Cloud Architecture</td>
                        <td className="p-4">AWS Architect Proficiency</td>
                        <td className="p-4 font-mono text-[#681D5F] font-bold">100% Correct</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-700 px-2.5 py-1 rounded-full text-[9px] uppercase font-bold border border-emerald-500/20">
                            Distinguished
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-900">DevOps & K8s</td>
                        <td className="p-4">Kubernetes diagnostics CKA</td>
                        <td className="p-4 font-mono text-[#681D5F] font-bold">80% Correct</td>
                        <td className="p-4">
                          <span className="bg-purple-500/10 text-purple-700 px-2.5 py-1 rounded-full text-[9px] uppercase font-bold border border-purple-500/20">
                            Competency Approved
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in text-left" id="student-notifications-pane">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Real-Time Activity Logs</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Track system dispatches, trainer comments, and study logs.</p>
                </div>
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-xs font-bold text-[#681D5F] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {/* Alert Items */}
              <div className="space-y-3">
                {notifications.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
                    }}
                    className={`p-4 rounded-xl border transition-all text-xs flex items-start space-x-3 cursor-pointer ${
                      item.read 
                        ? 'bg-slate-50 border-slate-200 text-slate-500' 
                        : 'bg-purple-50/20 border-purple-100 text-slate-900 font-semibold shadow-sm shadow-purple-50'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${item.read ? 'bg-slate-300' : 'bg-[#681D5F] animate-pulse'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="leading-relaxed">{item.text}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Account Profile Setup Edit Form inside Notifications view or standalone */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 mt-8 shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Profile & Account settings</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Configure your displayed enterprise parameters.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-2">
                    <label className="block text-slate-600">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#681D5F]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-slate-600">Email Address</label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#681D5F]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-slate-600">Assigned University / Branch</label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#681D5F]"
                    />
                  </div>
                  <div className="md:col-span-2 pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#681D5F] hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-8 animate-fade-in text-left" id="student-feedback-pane">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Course & Trainer Feedback</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submit secure evaluation surveys on syllabus, material clarity, and trainer skills.</p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 max-w-xl text-xs font-medium shadow-sm">
                <div className="space-y-1.5">
                  <label className="block text-slate-600">Select Rated Syllabus</label>
                  <select
                    value={feedbackCourse}
                    onChange={(e) => setFeedbackCourse(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#681D5F]"
                  >
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-600">Assigned Trainer Name</label>
                  <input
                    type="text"
                    value={feedbackTrainer}
                    onChange={(e) => setFeedbackTrainer(e.target.value)}
                    placeholder="Trainer name..."
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#681D5F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-600">Overall Course Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star className={`h-6 w-6 ${star <= feedbackRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-600">Detailed Feedback Review Comments</label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    placeholder="Write your comments regarding course modules, exercise labs, slides etc..."
                    className="w-full bg-slate-50 text-slate-800 border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#681D5F]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#681D5F] hover:brightness-110 text-white font-bold py-3 rounded-lg transition-all cursor-pointer"
                  >
                    Submit Feedback Survey
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
