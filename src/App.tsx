import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CourseCatalog from './components/CourseCatalog';
import CoursePlayer from './components/CoursePlayer';
import Dashboard from './components/Dashboard';
import AdminAnalytics from './components/AdminAnalytics';
import AssessmentEngine from './components/AssessmentEngine';
import { Course, UserProgress } from './types';
import { COURSES } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';
import XebiaLogo from './components/XebiaLogo';
import XebiaLiveBackground from './components/XebiaLiveBackground';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserProfile, getUserProgressFromDB, saveUserProgressToDB, createUserProfile } from './lib/firebase';
import Auth from './components/Auth';

// Seeding standard progress for excellent starting UX
const INITIAL_PROGRESS: UserProgress = {
  enrolledCourseIds: ['course-aws-arch', 'course-scrum-master'],
  completedLessons: ['aws-l1', 'aws-l2', 'scrum-l1'],
  courseCompletion: {
    'course-aws-arch': 65, // 65% complete to match Vercel dashboard current course
    'course-scrum-master': 13 // 1 out of 8 lessons
  },
  completedCourseIds: [],
  streakDays: 5,
  lastActiveDate: '2026-07-12',
  skillsMastered: ['VPC Networking', 'Scrum Values'],
  certificates: [],
  activeTab: 'home'
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);

  const [showAuthOverlay, setShowAuthOverlay] = useState<boolean>(false);
  const [authOverlayRole, setAuthOverlayRole] = useState<'Student' | 'Admin'>('Student');

  const handleOpenAuth = (role: 'Student' | 'Admin') => {
    setAuthOverlayRole(role);
    setShowAuthOverlay(true);
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Check if we have a demo session active
      const savedDemo = localStorage.getItem('xebia_demo_user');
      if (savedDemo) {
        try {
          const { user, profile } = JSON.parse(savedDemo);
          setCurrentUser(user);
          setUserProfile(profile);
          setIsAdminMode(profile.role === 'Admin');
          
          const localProgress = localStorage.getItem(`xebia_progress_${user.uid}`);
          if (localProgress) {
            setUserProgress(JSON.parse(localProgress));
          } else {
            setUserProgress(INITIAL_PROGRESS);
          }
          setIsAuthLoading(false);
          return;
        } catch (e) {
          console.error("Failed to restore demo user session:", e);
        }
      }

      if (firebaseUser && firebaseUser.emailVerified) {
        setCurrentUser(firebaseUser);
        
        // Fetch user custom profile details
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Enterprise Learner',
            role: 'Student',
            title: 'Senior Cloud Architect',
            createdAt: new Date().toISOString()
          };
          try {
            await createUserProfile(firebaseUser.uid, {
              email: profile.email,
              displayName: profile.displayName,
              role: profile.role,
              title: profile.title
            });
          } catch (e) {
            console.error("Failed to auto-create user profile in auth listener:", e);
          }
        }
        setUserProfile(profile);

        // Fetch progress from database
        const progress = await getUserProgressFromDB(firebaseUser.uid);
        if (progress) {
          setUserProgress(progress);
        } else {
          await saveUserProgressToDB(firebaseUser.uid, INITIAL_PROGRESS);
          setUserProgress(INITIAL_PROGRESS);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setUserProgress(INITIAL_PROGRESS);
        setIsAdminMode(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Synchronize progress to Firestore on changes
  useEffect(() => {
    if (currentUser && !isAuthLoading && userProgress) {
      if (currentUser.uid.startsWith('demo-')) {
        localStorage.setItem(`xebia_progress_${currentUser.uid}`, JSON.stringify(userProgress));
      } else if (currentUser.emailVerified) {
        const syncProgress = async () => {
          try {
            await saveUserProgressToDB(currentUser.uid, userProgress);
          } catch (e) {
            console.error("Error syncing progress to Firestore:", e);
          }
        };

        const timeoutId = setTimeout(syncProgress, 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [userProgress, currentUser, isAuthLoading]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      localStorage.removeItem('xebia_demo_user');
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setUserProgress(INITIAL_PROGRESS);
      setCurrentTab('home');
      setIsAdminMode(false);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Enrollment
  const handleEnroll = (courseId: string) => {
    if (!userProgress.enrolledCourseIds.includes(courseId)) {
      const updatedProgress = {
        ...userProgress,
        enrolledCourseIds: [...userProgress.enrolledCourseIds, courseId],
        courseCompletion: {
          ...userProgress.courseCompletion,
          [courseId]: 0
        }
      };
      setUserProgress(updatedProgress);
    }
    // Launch the course player right away for awesome immediate engagement
    const course = COURSES.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCurrentTab('player');
    }
  };

  // Handle Lesson Mark Completion
  const handleMarkLessonComplete = (lessonId: string, complete: boolean) => {
    // Find which course contains this lesson
    const course = COURSES.find(c => 
      c.syllabus.some(m => m.lessons.some(l => l.id === lessonId))
    );
    if (!course) return;

    let updatedCompleted = [...userProgress.completedLessons];
    if (complete) {
      if (!updatedCompleted.includes(lessonId)) {
        updatedCompleted.push(lessonId);
      }
    } else {
      updatedCompleted = updatedCompleted.filter(id => id !== lessonId);
    }

    // Calculate percentage completion for this specific course
    const allCourseLessonIds = course.syllabus.flatMap(m => m.lessons.map(l => l.id));
    const completedInCourse = allCourseLessonIds.filter(id => updatedCompleted.includes(id)).length;
    const completionPercentage = Math.round((completedInCourse / allCourseLessonIds.length) * 100);

    // Track course completions
    let updatedCompletedCourses = [...userProgress.completedCourseIds];
    let updatedCertificates = [...userProgress.certificates];
    let updatedSkills = [...userProgress.skillsMastered];

    if (completionPercentage === 100 && !updatedCompletedCourses.includes(course.id)) {
      updatedCompletedCourses.push(course.id);
      
      // Seed a certified badge/credentials item
      const certId = `XEB-${course.category.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
      updatedCertificates.push({
        courseId: course.id,
        issuedAt: new Date().toISOString().split('T')[0],
        certificateId: certId
      });

      // Add all course skills to mastered skills list
      course.skillsAcquired.forEach(skill => {
        if (!updatedSkills.includes(skill)) {
          updatedSkills.push(skill);
        }
      });
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

  // Handle assessment completed
  const handleAssessmentCompleted = (category: string) => {
    // Increase streak or add special competency skill tag
    const mockSkillTag = `${category} Mastered`;
    if (!userProgress.skillsMastered.includes(mockSkillTag)) {
      setUserProgress({
        ...userProgress,
        streakDays: userProgress.streakDays + 1,
        skillsMastered: [...userProgress.skillsMastered, mockSkillTag]
      });
    }
  };

  // Hero Search Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('catalog');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0B090F] flex flex-col items-center justify-center space-y-4 relative overflow-hidden" id="auth-loading-node">
        <XebiaLiveBackground variant="dark" interactive={false} />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <XebiaLogo height={36} textColor="#FFFFFF" className="animate-pulse" />
          <div className="flex items-center space-x-1.5 text-xs text-purple-300 font-mono">
            <span className="h-2 w-2 rounded-full bg-[#FF5A36] animate-ping shrink-0" />
            <span>Connecting to Enterprise Node...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 relative" id="xebia-lms-root-layout">
      
      {/* Top Header Controls */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'player') setSelectedCourse(null);
        }}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        streakDays={userProgress.streakDays}
        userProfile={userProfile}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Container Wrapper */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* TAB: HOME LEARNER DASHBOARD */}
            {currentTab === 'home' && (
              <div id="home-tab-view">
                <Dashboard
                  userProgress={userProgress}
                  onSelectCourse={(course) => {
                    if (!currentUser) {
                      handleOpenAuth('Student');
                    } else {
                      setSelectedCourse(course);
                      // Enroll automatically if not already
                      if (!userProgress.enrolledCourseIds.includes(course.id)) {
                        handleEnroll(course.id);
                      }
                      setCurrentTab('player');
                    }
                  }}
                  onNavigateToCatalog={() => setCurrentTab('catalog')}
                  userProfile={userProfile}
                  onOpenAuth={handleOpenAuth}
                />
              </div>
            )}

            {/* TAB: COURSE CATALOG LIBRARY */}
            {currentTab === 'catalog' && (
              <div id="catalog-tab-view">
                <CourseCatalog
                  onEnroll={(courseId) => {
                    if (!currentUser) {
                      handleOpenAuth('Student');
                    } else {
                      handleEnroll(courseId);
                    }
                  }}
                  enrolledCourseIds={userProgress.enrolledCourseIds}
                  courseCompletion={userProgress.courseCompletion}
                  onSelectCourse={(course) => {
                    if (!currentUser) {
                      handleOpenAuth('Student');
                    } else {
                      setSelectedCourse(course);
                      // Enroll on selection to let them study right away
                      if (!userProgress.enrolledCourseIds.includes(course.id)) {
                        handleEnroll(course.id);
                      }
                      setCurrentTab('player');
                    }
                  }}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {/* TAB: ACTIVE STUDY LECTURE PLAYER */}
            {currentTab === 'player' && selectedCourse && (
              <div id="player-tab-view">
                <CoursePlayer
                  course={selectedCourse}
                  userProgress={userProgress}
                  onMarkLessonComplete={handleMarkLessonComplete}
                  onBackToCatalog={() => {
                    setSelectedCourse(null);
                    setCurrentTab('catalog');
                  }}
                />
              </div>
            )}

            {/* TAB: CERTIFICATION ASSESSMENT ENGINE */}
            {currentTab === 'assessment' && (
              <div id="assessment-tab-view">
                <AssessmentEngine
                  onAssessmentCompleted={handleAssessmentCompleted}
                  isAuthenticated={!!currentUser}
                  onOpenAuth={handleOpenAuth}
                />
              </div>
            )}

            {/* TAB: TEAM ADMIN METRICS */}
            {currentTab === 'admin' && isAdminMode && (
              <div id="admin-tab-view">
                <AdminAnalytics />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-left" id="xebia-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <XebiaLogo height={28} textColor="#FFFFFF" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Xebia Academy Enterprise LMS drives professional upskilling, coaching, and certifications at leading global digital agencies.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4">Practice Streams</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleSearch('Cloud')} className="hover:text-white transition-colors cursor-pointer text-left">Cloud & AWS Architect</button></li>
              <li><button onClick={() => handleSearch('Kubernetes')} className="hover:text-white transition-colors cursor-pointer text-left">DevOps & Kubernetes</button></li>
              <li><button onClick={() => handleSearch('Scrum')} className="hover:text-white transition-colors cursor-pointer text-left">Agile Leadership & Scrum</button></li>
              <li><button onClick={() => handleSearch('Generative AI')} className="hover:text-white transition-colors cursor-pointer text-left">Generative AI & LLMs</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4">Credentials Vault</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">AWS Certified Solutions Architect</span></li>
              <li><span className="text-slate-400">Certified Kubernetes Administrator</span></li>
              <li><span className="text-slate-400">Professional Scrum Master I (PSM I)</span></li>
              <li><span className="text-slate-400">Xebia Frontend Architect badge</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4">Compliance</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Licensed corporate cloud instance. Under corporate security SLA policies.
            </p>
            <div className="mt-4 flex items-center space-x-2 rounded-lg bg-slate-800 p-2.5 border border-slate-700/65">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="text-[10px] font-bold text-slate-300">All enterprise nodes operational</span>
            </div>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <span>&copy; 2026 Xebia Academy Solutions. All rights reserved.</span>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">SLA Agreement</span>
            <span>&middot;</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Standards</span>
            <span>&middot;</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Protocol</span>
          </div>
        </div>
      </footer>

      {/* Floating Modern Modal Overlay for Authentication */}
      <AnimatePresence>
        {showAuthOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            id="auth-modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl"
            >
              <Auth
                initialRole={authOverlayRole}
                onClose={() => setShowAuthOverlay(false)}
                onAuthSuccess={async (user, profile) => {
                  setIsAuthLoading(true);
                  setCurrentUser(user);
                  
                  // Use provided profile if available (e.g. from google / demo mode), otherwise fetch
                  let activeProfile = profile;
                  if (!activeProfile) {
                    try {
                      activeProfile = await getUserProfile(user.uid);
                    } catch (e) {
                      console.error("Error fetching user profile:", e);
                    }
                  }
                  setUserProfile(activeProfile);
                  setIsAdminMode(activeProfile?.role === 'Admin');

                  if (user.uid.startsWith('demo-')) {
                    const localProgress = localStorage.getItem(`xebia_progress_${user.uid}`);
                    if (localProgress) {
                      setUserProgress(JSON.parse(localProgress));
                    } else {
                      setUserProgress(INITIAL_PROGRESS);
                    }
                  } else {
                    const progress = await getUserProgressFromDB(user.uid);
                    if (progress) {
                      setUserProgress(progress);
                    } else {
                      await saveUserProgressToDB(user.uid, INITIAL_PROGRESS);
                      setUserProgress(INITIAL_PROGRESS);
                    }
                  }
                  setShowAuthOverlay(false);
                  setIsAuthLoading(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
