import React, { useState } from 'react';
import { Course } from '../types';
import { COURSES } from '../data';
import AdminAnalytics from './AdminAnalytics';
import { 
  BarChart3, Layers, BookOpen, PlusCircle, Trash, RefreshCw, Send, CheckCircle, 
  Trash2, FolderPlus, FilePlus, ChevronRight, ListCollapse, LogOut, Search, Settings,
  Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import XebiaLogo from './XebiaLogo';

interface AdminPortalProps {
  onLogout: () => void;
}

export default function AdminPortal({ onLogout }: AdminPortalProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Local state for dynamically managed Courses (to simulate persistent creation)
  const [adminCourses, setAdminCourses] = useState<Course[]>(() => {
    const cached = localStorage.getItem('xebia_admin_courses');
    return cached ? JSON.parse(cached) : COURSES;
  });

  // Local state for categories
  const [categories, setCategories] = useState<string[]>([
    'Software Architecture', 'DevOps', 'Data & AI', 'Agile & Scrum', 'Software Engineering'
  ]);

  // Form states
  const [newCatName, setNewCatName] = useState<string>('');
  
  // Course creation states
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseCategory, setNewCourseCategory] = useState<string>('Software Architecture');
  const [newCourseLevel, setNewCourseLevel] = useState<string>('Advanced');
  const [newCourseDuration, setNewCourseDuration] = useState<string>('16 hours');
  const [newCourseDesc, setNewCourseDesc] = useState<string>('');
  const [newCourseInstructor, setNewCourseInstructor] = useState<string>('Principal Consultant');
  
  // Curriculum hierarchy builder state
  const [selectedCurriculumCourseId, setSelectedCurriculumCourseId] = useState<string>(adminCourses[0]?.id || '');
  const [newModuleName, setNewModuleName] = useState<string>('');
  const [newLessonName, setNewLessonName] = useState<string>('');
  const [newLessonType, setNewLessonType] = useState<'video' | 'reading' | 'quiz'>('video');
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);

  // Dialog/Alert Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const syncCoursesState = (updatedCourses: Course[]) => {
    setAdminCourses(updatedCourses);
    localStorage.setItem('xebia_admin_courses', JSON.stringify(updatedCourses));
  };

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim() === '') return;
    if (categories.includes(newCatName.trim())) {
      showToast('Category already exists!');
      return;
    }
    setCategories([...categories, newCatName.trim()]);
    setNewCatName('');
    showToast(`Category "${newCatName}" created successfully!`);
  };

  // Add Course Handler
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourseTitle.trim() === '') return;

    const newCourse: Course = {
      id: `course-custom-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newCourseTitle,
      category: newCourseCategory,
      level: newCourseLevel,
      duration: newCourseDuration,
      lessonsCount: 1,
      rating: 5.0,
      reviewsCount: 1,
      instructor: newCourseInstructor,
      instructorTitle: 'Authorized Academy Instructor',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
      description: newCourseDesc || 'Master specialized digital practices with certified hands-on exercises.',
      skillsAcquired: ['Technology Core', 'Upskilling Framework'],
      syllabus: [
        {
          title: 'Module 1: Introductory Sandbox Foundations',
          duration: '4 hours',
          lessons: [
            { id: `lesson-id-${Math.random()}`, title: 'Syllabus roadmap & sandbox environment boot-up', duration: '15 min', type: 'video', content: 'Hands-on instructions on system configurations.' }
          ]
        }
      ]
    };

    const updated = [...adminCourses, newCourse];
    syncCoursesState(updated);
    
    // Reset inputs
    setNewCourseTitle('');
    setNewCourseDesc('');
    showToast(`Course "${newCourseTitle}" created and synchronized in directory catalog!`);
    setActiveTab('courses');
  };

  // Delete Course
  const handleDeleteCourse = (courseId: string) => {
    const updated = adminCourses.filter(c => c.id !== courseId);
    syncCoursesState(updated);
    showToast('Course removed from catalogue.');
  };

  // Add Syllabus Module
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newModuleName.trim() === '') return;

    const updated = adminCourses.map(course => {
      if (course.id === selectedCurriculumCourseId) {
        return {
          ...course,
          syllabus: [
            ...course.syllabus,
            {
              title: newModuleName,
              duration: '4 hours',
              lessons: []
            }
          ]
        };
      }
      return course;
    });

    syncCoursesState(updated);
    setNewModuleName('');
    showToast(`New curriculum module "${newModuleName}" successfully appended!`);
  };

  // Add Syllabus Lesson to Module
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLessonName.trim() === '') return;

    const updated = adminCourses.map(course => {
      if (course.id === selectedCurriculumCourseId) {
        const updatedSyllabus = course.syllabus.map((module, mIdx) => {
          if (mIdx === selectedModuleIndex) {
            return {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  id: `lesson-custom-${Math.floor(1000 + Math.random() * 9000)}`,
                  title: newLessonName,
                  duration: '20 min',
                  type: newLessonType,
                  content: 'Comprehensive reading and compliance materials generated by Academy.'
                }
              ]
            };
          }
          return module;
        });

        // Compute total lessons
        const totalLessons = updatedSyllabus.reduce((acc, m) => acc + m.lessons.length, 0);

        return {
          ...course,
          syllabus: updatedSyllabus,
          lessonsCount: totalLessons
        };
      }
      return course;
    });

    syncCoursesState(updated);
    setNewLessonName('');
    showToast(`Lesson "${newLessonName}" added in module!`);
  };

  const selectedCourse = adminCourses.find(c => c.id === selectedCurriculumCourseId);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: ListCollapse }
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
    <div className={`min-h-screen flex ${bgBase} font-sans text-left overflow-hidden`} id="admin-portal-container">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[1000] bg-white border border-slate-200 text-slate-900 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
                    ADMIN PORTAL
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
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className={`p-4 border-t ${borderMuted} bg-slate-50 flex flex-col space-y-3`}>
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-purple-500/10 text-[#681D5F] border border-purple-500/20 flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
                    AD
                  </div>
                  <div className="overflow-hidden">
                    <span className={`block text-xs font-bold ${textTitle} truncate`}>Admin User</span>
                    <span className="block text-[10px] text-slate-500 truncate">admin@xebia.com</span>
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
            ADMIN PORTAL
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
                onClick={() => setActiveTab(item.id)}
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
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${borderMuted} bg-slate-50 flex flex-col space-y-3`}>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-purple-500/10 text-[#681D5F] border border-purple-500/20 flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <span className={`block text-xs font-bold ${textTitle} truncate`}>Admin User</span>
              <span className="block text-[10px] text-slate-500 truncate">admin@xebia.com</span>
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
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FC]" id="admin-portal-viewport">
        {/* TOP BAR PANEL */}
        <header className={`h-16 ${headerBg} backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0`}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-[#681D5F] hover:bg-slate-100 rounded-lg cursor-pointer mr-1 shrink-0"
              title="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono hidden xs:inline">Admin Suite</span>
            <span className="text-slate-400 hidden xs:inline">/</span>
            <span className="text-xs font-bold text-[#681D5F] uppercase tracking-wider font-mono">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative w-48 xl:w-64 hidden md:block">
              <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search courses, batches, analytics..."
                className={`w-full ${inputBg} text-xs rounded-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-1 focus:ring-[#681D5F]/40`}
              />
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-[10px] font-mono font-bold bg-[#681D5F]/15 text-[#681D5F] border border-[#681D5F]/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                SLA STATUS: SECURE & ON-LINE
              </span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PANEL AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in" id="admin-dashboard-view">
              {/* Top Banner and stats */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1226] via-[#0F0D15] to-[#120D1A] border border-white/5 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left space-y-3 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#681D5F] font-mono">
                    Academy Operations
                  </span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Xebia LMS Executive Controls
                  </h2>
                  <p className="text-xs text-slate-400 font-sans max-w-lg leading-relaxed">
                    Monitor enterprise-wide skill progression rates, structure multi-level dynamic curriculums, and manage employee upskilling profiles.
                  </p>
                </div>
                <div className="flex shrink-0 space-x-3 z-10">
                  <button onClick={() => setActiveTab('courses')} className="bg-[#681D5F] hover:brightness-110 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-lg">
                    <PlusCircle className="h-4.5 w-4.5" />
                    <span>Create New Course</span>
                  </button>
                </div>
              </div>

              {/* Embedding AdminAnalytics stats and charts directly here */}
              <div className="bg-[#0F0D15] p-6 rounded-3xl border border-white/5 shadow-2xl">
                <AdminAnalytics />
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-8 animate-fade-in text-left" id="admin-categories-view">
              <div>
                <h3 className="text-lg font-bold text-white">Course Categories Manager</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage and append high-level subject categories to structure dynamic learning branches.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add category card */}
                <div className="bg-[#0F0D15] p-6 rounded-2xl border border-white/5 space-y-4 h-fit">
                  <h4 className="font-bold text-white text-sm">Add New Category</h4>
                  <form onSubmit={handleAddCategory} className="space-y-4 text-xs font-medium">
                    <div className="space-y-1.5">
                      <label className="text-slate-400">Category Title Name</label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Cybersecurity Practice, Product Management"
                        className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#681D5F] hover:brightness-110 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <FolderPlus className="h-4.5 w-4.5" />
                      <span>Add Category</span>
                    </button>
                  </form>
                </div>

                {/* Categories list grid */}
                <div className="md:col-span-2 bg-[#0F0D15] p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-bold text-white text-sm">Synchronized Subject Categories</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat, index) => {
                      const count = adminCourses.filter(c => c.category === cat).length;
                      return (
                        <div key={index} className="bg-[#13111A] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                            <span className="block font-bold text-white text-sm">{cat}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">{count} courses published</span>
                          </div>
                          <button 
                            onClick={() => {
                              setCategories(categories.filter(c => c !== cat));
                              showToast(`Category "${cat}" removed.`);
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-8 animate-fade-in text-left" id="admin-courses-view">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">LMS Course Catalog Repository</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Edit, delete, or structure comprehensive course paths dynamically.</p>
                </div>
                <button
                  onClick={() => setActiveTab('create-course')}
                  className="bg-[#681D5F] hover:brightness-110 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Create Course</span>
                </button>
              </div>

              {/* Grid of existing courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminCourses.map((course) => (
                  <div key={course.id} className="bg-[#0F0D15] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between h-full group hover:border-purple-500/25 transition-all">
                    <div>
                      <div className="h-36 w-full relative bg-slate-800">
                        <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover group-hover:scale-102 transition-transform" />
                        <span className="absolute top-3 left-3 bg-[#0B090F]/90 text-[#681D5F] font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-white/10">
                          {course.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block font-mono">{course.level} &bull; {course.duration}</span>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{course.title}</h4>
                        <p className="text-[11.5px] text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
                      </div>
                    </div>
                    <div className="p-5 border-t border-white/5 flex items-center justify-between bg-white/1">
                      <span className="text-[10px] font-mono text-slate-500">{course.lessonsCount} chapters</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCurriculumCourseId(course.id);
                            setActiveTab('curriculum');
                          }}
                          className="text-xs text-[#681D5F] hover:underline font-bold cursor-pointer"
                        >
                          Syllabus
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC TAB: CREATE COURSE FORM */}
          {activeTab === 'create-course' && (
            <div className="space-y-8 animate-fade-in text-left max-w-xl" id="admin-create-course-view">
              <div>
                <button onClick={() => setActiveTab('courses')} className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer mb-2">&larr; Back to Catalog</button>
                <h3 className="text-lg font-bold text-white">Create New Upskilling Pathway</h3>
                <p className="text-xs text-slate-500 mt-0.5">Set course title, description, and initial learning modules.</p>
              </div>

              <form onSubmit={handleAddCourse} className="bg-[#0F0D15] p-6 rounded-2xl border border-white/5 space-y-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Course title name</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="e.g. AWS Security Engineering, Professional Scrum Facilitator"
                    className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400">Practice category</label>
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400">Expertise level</label>
                    <select
                      value={newCourseLevel}
                      onChange={(e) => setNewCourseLevel(e.target.value)}
                      className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400">Estimate study duration</label>
                    <input
                      type="text"
                      required
                      value={newCourseDuration}
                      onChange={(e) => setNewCourseDuration(e.target.value)}
                      className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400">Assigned Expert Instructor</label>
                    <input
                      type="text"
                      required
                      value={newCourseInstructor}
                      onChange={(e) => setNewCourseInstructor(e.target.value)}
                      className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400">Course executive summary</label>
                  <textarea
                    rows={4}
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    placeholder="Short summary highlighting course metrics, lab targets, and certificate outcomes..."
                    className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#681D5F] hover:brightness-110 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                >
                  <FilePlus className="h-4.5 w-4.5" />
                  <span>Synchronize Course Pathway</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: CURRICULUM SYLLABUS BUILDER */}
          {activeTab === 'curriculum' && (
            <div className="space-y-8 animate-fade-in text-left font-sans" id="admin-curriculum-view">
              <div>
                <h3 className="text-lg font-bold text-white">4-Level Curriculum Hierarchy Builder</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Manage dynamic modules, chapters, interactive lessons, and compliance exams.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selector column */}
                <div className="bg-[#0F0D15] p-5 rounded-2xl border border-white/5 space-y-4 h-fit">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-bold font-mono">Select Course Pathway</label>
                    <select
                      value={selectedCurriculumCourseId}
                      onChange={(e) => {
                        setSelectedCurriculumCourseId(e.target.value);
                        setSelectedModuleIndex(0);
                      }}
                      className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                    >
                      {adminCourses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Add module form */}
                  <form onSubmit={handleAddModule} className="border-t border-white/5 pt-4 space-y-3">
                    <h4 className="font-bold text-white text-xs">Append New Syllabus Module</h4>
                    <input
                      type="text"
                      required
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                      placeholder="e.g. Module 4: Live Cluster diagnostics"
                      className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-3 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                    />
                    <button type="submit" className="w-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer">
                      Append Module
                    </button>
                  </form>

                  {/* Add lesson form */}
                  {selectedCourse && selectedCourse.syllabus.length > 0 && (
                    <form onSubmit={handleAddLesson} className="border-t border-white/5 pt-4 space-y-3">
                      <h4 className="font-bold text-white text-xs">Append Lesson to Module</h4>
                      
                      <div className="space-y-1">
                        <label className="text-slate-500 text-[10px] font-bold uppercase">Target Module</label>
                        <select
                          value={selectedModuleIndex}
                          onChange={(e) => setSelectedModuleIndex(Number(e.target.value))}
                          className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-2 rounded-lg text-xs focus:outline-none"
                        >
                          {selectedCourse.syllabus.map((m, idx) => (
                            <option key={idx} value={idx}>{m.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 text-[10px] font-bold uppercase">Lesson title</label>
                        <input
                          type="text"
                          required
                          value={newLessonName}
                          onChange={(e) => setNewLessonName(e.target.value)}
                          placeholder="e.g. Hands-on NAT construction"
                          className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-2 rounded-lg text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 text-[10px] font-bold uppercase">Lesson medium</label>
                        <select
                          value={newLessonType}
                          onChange={(e) => setNewLessonType(e.target.value as any)}
                          className="w-full bg-[#13111A] text-slate-100 border border-white/5 p-2 rounded-lg text-xs focus:outline-none"
                        >
                          <option value="video">Video Lecture</option>
                          <option value="reading">Reading Documentation</option>
                          <option value="quiz">Interactive Quiz Check</option>
                        </select>
                      </div>

                      <button type="submit" className="w-full bg-[#681D5F] hover:brightness-110 text-white font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer">
                        Append Lesson
                      </button>
                    </form>
                  )}
                </div>

                {/* Display syllabus breakdown tree */}
                <div className="lg:col-span-2 bg-[#0F0D15] p-6 rounded-2xl border border-white/5 space-y-4">
                  {selectedCourse ? (
                    <div className="space-y-6">
                      <div className="border-b border-white/5 pb-3">
                        <span className="block text-[10px] text-[#681D5F] font-mono font-bold uppercase">Course Selected</span>
                        <h4 className="text-base font-extrabold text-white mt-1">{selectedCourse.title}</h4>
                      </div>

                      {selectedCourse.syllabus.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-12">
                          No modules appended inside syllabus yet. Use the left append panel.
                        </p>
                      ) : (
                        <div className="space-y-4 text-xs">
                          {selectedCourse.syllabus.map((mod, modIdx) => (
                            <div key={modIdx} className="bg-[#13111A] p-4 rounded-xl border border-white/5 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-sm">{mod.title}</span>
                                <span className="text-[10px] text-slate-500 font-mono uppercase">{mod.lessons.length} lessons</span>
                              </div>

                              {mod.lessons.length === 0 ? (
                                <p className="text-[11px] text-slate-600 italic">No lessons in module yet.</p>
                              ) : (
                                <div className="space-y-1.5 pl-4 border-l border-white/10 mt-2">
                                  {mod.lessons.map((lesson, lIdx) => (
                                    <div key={lesson.id} className="flex items-center justify-between text-slate-400 py-1 hover:text-white transition-colors">
                                      <div className="flex items-center space-x-2">
                                        <span className="h-1 w-1 rounded-full bg-[#681D5F]" />
                                        <span>{lesson.title}</span>
                                      </div>
                                      <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">
                                        {lesson.type}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-12">Please select a course to build curriculum hierarchy.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
