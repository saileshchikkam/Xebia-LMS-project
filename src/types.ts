export interface Course {
  id: string;
  title: string;
  category: 'Cloud' | 'DevOps' | 'Agile & Scrum' | 'Data & AI' | 'Software Engineering' | 'Product Management' | 'Software Architecture';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner Friendly';
  duration: string; // e.g., "12 hours"
  lessonsCount: number;
  rating: number;
  reviewsCount: number;
  instructor: string;
  instructorTitle: string;
  coverImage: string;
  description: string;
  skillsAcquired: string[];
  syllabus: {
    title: string;
    duration: string;
    lessons: { id: string; title: string; duration: string; completed?: boolean; type: 'video' | 'quiz' | 'reading'; content?: string }[];
  }[];
}

export interface UserProgress {
  enrolledCourseIds: string[];
  completedLessons: string[]; // lesson ids
  courseCompletion: Record<string, number>; // courseId -> percentage (0-100)
  completedCourseIds: string[];
  streakDays: number;
  lastActiveDate: string;
  skillsMastered: string[];
  certificates: {
    courseId: string;
    issuedAt: string;
    certificateId: string;
  }[];
  activeTab: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillAssessment {
  id: string;
  title: string;
  category: string;
  questionsCount: number;
  questions: AssessmentQuestion[];
}

export interface EmployeeProgress {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  enrolledCount: number;
  completedCount: number;
  learningHours: number;
  lastActive: string;
  completionRate: number; // 0 to 100
}
