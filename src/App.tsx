import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CourseCatalog from './components/CourseCatalog';
import CoursePlayer from './components/CoursePlayer';
import Dashboard from './components/Dashboard';
import AdminAnalytics from './components/AdminAnalytics';
import AssessmentEngine from './components/AssessmentEngine';
import SubnetCalculator from './components/SubnetCalculator';
import { Course, UserProgress } from './types';
import { COURSES } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, ShieldAlert, Sparkles } from 'lucide-react';
import XebiaLogo from './components/XebiaLogo';
import XebiaLiveBackground from './components/XebiaLiveBackground';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';

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
  useEffect(() => {
    // Force light-mode class on application root and document body
    const root = document.getElementById('root') || document.body;
    root.classList.add('light-mode');
    root.classList.remove('dark');
    root.classList.remove('dark-mode');
    localStorage.setItem('xebia_theme', 'light');
  }, []);

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
  const [publicTab, setPublicTab] = useState<string>('home');

  // Custom polished safe in-app notice dialog
  const [noticeModal, setNoticeModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const handleOpenAuth = (role: 'Student' | 'Admin') => {
    setAuthOverlayRole(role);
    setShowAuthOverlay(true);
  };

  const handleShowNotice = (title: string, message: string) => {
    setNoticeModal({ isOpen: true, title, message });
  };

  // Auth State Listener (Checks local session cache first for fast 0ms restores)
  useEffect(() => {
    const restoreSession = () => {
      // 1. Check if we have a custom database session active (Instant)
      const savedCustom = localStorage.getItem('xebia_custom_user');
      if (savedCustom) {
        try {
          const { user, profile } = JSON.parse(savedCustom);
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
          console.error("Failed to restore custom database session:", e);
        }
      }

      // 2. Check if we have a demo session active
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

      // No active local sandbox session found
      setCurrentUser(null);
      setUserProfile(null);
      setUserProgress(INITIAL_PROGRESS);
      setIsAdminMode(false);
      setIsAuthLoading(false);
    };

    restoreSession();
  }, []);

  // Synchronize progress to offline Sandbox storage on changes
  useEffect(() => {
    if (currentUser && !isAuthLoading && userProgress) {
      localStorage.setItem(`xebia_progress_${currentUser.uid}`, JSON.stringify(userProgress));
    }
  }, [userProgress, currentUser, isAuthLoading]);

  // Handle Logout
  const handleLogout = () => {
    setIsAuthLoading(true);
    localStorage.removeItem('xebia_demo_user');
    localStorage.removeItem('xebia_custom_user');
    setCurrentUser(null);
    setUserProfile(null);
    setUserProgress(INITIAL_PROGRESS);
    setCurrentTab('home');
    setIsAdminMode(false);
    setIsAuthLoading(false);
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
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4 relative overflow-hidden" id="auth-loading-node">
        <XebiaLiveBackground variant="light" interactive={false} />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <XebiaLogo height={42} className="animate-pulse" />
          <div className="flex items-center space-x-1.5 text-xs text-[#681D5F] font-mono">
            <span className="h-2 w-2 rounded-full bg-[#681D5F] animate-ping shrink-0" />
            <span>Connecting to Enterprise Node...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="relative">
        <LandingPage
          onOpenAuth={(role) => handleOpenAuth(role)}
          publicTab={publicTab}
          setPublicTab={setPublicTab}
        />
        
        {/* Floating Modern Modal Overlay for Authentication */}
        <AnimatePresence>
          {showAuthOverlay && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
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
                    setUserProfile(profile);
                    setIsAdminMode(profile?.role === 'Admin');

                    const localProgress = localStorage.getItem(`xebia_progress_${user.uid}`);
                    if (localProgress) {
                      setUserProgress(JSON.parse(localProgress));
                    } else {
                      setUserProgress(INITIAL_PROGRESS);
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

  // Once authenticated: Check role and return the corresponding elegant full-bleed portal layout
  if (isAdminMode) {
    return (
      <AdminPortal 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <StudentPortal
      userProgress={userProgress}
      setUserProgress={setUserProgress}
      userProfile={userProfile}
      setUserProfile={setUserProfile}
      onLogout={handleLogout}
    />
  );
}
