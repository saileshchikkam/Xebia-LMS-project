import { createClient } from '@supabase/supabase-js';
import { UserProgress } from '../types';
import { UserProfile } from './firebase';

// Retrieve credentials from environment variables using dynamic any-cast to avoid Vite compilation strict-typing errors
const SUPABASE_URL = ((import.meta as any).env).VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = ((import.meta as any).env).VITE_SUPABASE_ANON_KEY || '';

// Detect if Supabase is fully configured
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Initialize Supabase Client if configured
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * PostgreSQL Schema DDL for Supabase SQL Editor:
 * 
 * -- Create Users Table
 * CREATE TABLE public.users (
 *     uid TEXT PRIMARY KEY,
 *     email TEXT NOT NULL,
 *     display_name TEXT,
 *     role TEXT DEFAULT 'Student',
 *     title TEXT,
 *     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Create User Progress Table
 * CREATE TABLE public.user_progress (
 *     uid TEXT PRIMARY KEY REFERENCES public.users(uid) ON DELETE CASCADE,
 *     enrolled_course_ids TEXT[],
 *     completed_lessons TEXT[],
 *     course_completion JSONB DEFAULT '{}'::jsonb,
 *     completed_course_ids TEXT[],
 *     streak_days INTEGER DEFAULT 0,
 *     last_active_date TEXT,
 *     skills_mastered TEXT[],
 *     certificates JSONB DEFAULT '[]'::jsonb,
 *     active_tab TEXT DEFAULT 'home',
 *     updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Enable Row Level Security (RLS)
 * ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
 * 
 * -- Policies for Users Table
 * CREATE POLICY "Users can view own profile" ON public.users 
 *     FOR SELECT USING (auth.uid() = uid);
 *     
 * CREATE POLICY "Users can update own profile" ON public.users 
 *     FOR UPDATE USING (auth.uid() = uid);
 *     
 * CREATE POLICY "Allow insert during registration" ON public.users 
 *     FOR INSERT WITH CHECK (true);
 * 
 * -- Policies for User Progress
 * CREATE POLICY "Users can view own progress" ON public.user_progress 
 *     FOR SELECT USING (auth.uid() = uid);
 *     
 * CREATE POLICY "Users can update own progress" ON public.user_progress 
 *     FOR ALL USING (auth.uid() = uid);
 */

// Polymorphic DB & Auth wrapper to route calls to either real Supabase, Firebase, or clean Sandbox
class CloudDatabaseService {
  private activeProvider: 'firebase' | 'supabase' = 'firebase';

  constructor() {
    // Automatically switch to Supabase if config is detected
    if (isSupabaseConfigured) {
      this.activeProvider = 'supabase';
      console.log('🔌 CloudDatabaseService: Real Supabase cloud integration initialized.');
    } else {
      // Check if user previously toggled provider preference
      const savedProvider = localStorage.getItem('xebia_active_db_provider');
      if (savedProvider === 'supabase') {
        this.activeProvider = 'supabase';
      }
    }
  }

  getProvider(): 'firebase' | 'supabase' {
    return this.activeProvider;
  }

  setProvider(provider: 'firebase' | 'supabase') {
    this.activeProvider = provider;
    localStorage.setItem('xebia_active_db_provider', provider);
  }

  // --- GOOGLE SIGN IN VIA SUPABASE ---
  async signInWithSupabaseGoogle() {
    if (!supabase) {
      throw new Error("Supabase is not configured. Please supply your Supabase URL and Anon Key first.");
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  // --- FETCH USER PROFILE ---
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (this.activeProvider === 'supabase' && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uid', uid)
          .single();

        if (error) {
          // If profile doesn't exist, we return null so the Auth system can create one
          if (error.code === 'PGRST116') return null; 
          throw error;
        }

        const profile: UserProfile = {
          uid: data.uid,
          email: data.email,
          displayName: data.display_name || '',
          role: data.role as 'Student' | 'Admin',
          title: data.title || '',
          createdAt: data.created_at
        };

        localStorage.setItem(`xebia_supabase_profile_${uid}`, JSON.stringify(profile));
        return profile;
      } catch (err) {
        console.warn('Supabase DB error, attempting local storage fallback:', err);
        const cached = localStorage.getItem(`xebia_supabase_profile_${uid}`);
        if (cached) return JSON.parse(cached) as UserProfile;
        return null;
      }
    }

    // Default Sandbox / Firebase mock fallback behavior
    const cachedSandbox = localStorage.getItem(`xebia_profile_${uid}`);
    if (cachedSandbox) return JSON.parse(cachedSandbox) as UserProfile;
    return null;
  }

  // --- CREATE USER PROFILE ---
  async createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<UserProfile> {
    const newProfile: UserProfile = {
      ...profile,
      uid,
      createdAt: new Date().toISOString()
    };

    // Store in local cache
    localStorage.setItem(`xebia_supabase_profile_${uid}`, JSON.stringify(newProfile));
    localStorage.setItem(`xebia_profile_${uid}`, JSON.stringify(newProfile));

    if (this.activeProvider === 'supabase' && supabase) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert({
            uid: newProfile.uid,
            email: newProfile.email,
            display_name: newProfile.displayName,
            role: newProfile.role,
            title: newProfile.title,
            created_at: newProfile.createdAt
          });

        if (error) throw error;
      } catch (err) {
        console.error('Failed to create user profile in real Supabase Cloud DB:', err);
      }
    }

    return newProfile;
  }

  // --- FETCH USER PROGRESS ---
  async getUserProgress(uid: string): Promise<UserProgress | null> {
    if (this.activeProvider === 'supabase' && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('uid', uid)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw error;
        }

        const progress: UserProgress = {
          enrolledCourseIds: Array.isArray(data.enrolled_course_ids) ? data.enrolled_course_ids : [],
          completedLessons: Array.isArray(data.completed_lessons) ? data.completed_lessons : [],
          courseCompletion: typeof data.course_completion === 'object' && data.course_completion !== null ? data.course_completion : {},
          completedCourseIds: Array.isArray(data.completed_course_ids) ? data.completed_course_ids : [],
          streakDays: data.streak_days || 0,
          lastActiveDate: data.last_active_date || '',
          skillsMastered: Array.isArray(data.skills_mastered) ? data.skills_mastered : [],
          certificates: Array.isArray(data.certificates) ? data.certificates : [],
          activeTab: data.active_tab || 'home'
        };

        localStorage.setItem(`xebia_supabase_progress_${uid}`, JSON.stringify(progress));
        return progress;
      } catch (err) {
        console.warn('Supabase DB fetch progress error, attempting cache fallback:', err);
        const cached = localStorage.getItem(`xebia_supabase_progress_${uid}`);
        if (cached) return JSON.parse(cached) as UserProgress;
        return null;
      }
    }

    // Default Sandbox / Firebase mock progress fallback
    const cachedSandbox = localStorage.getItem(`xebia_progress_${uid}`);
    if (cachedSandbox) return JSON.parse(cachedSandbox) as UserProgress;
    return null;
  }

  // --- SAVE USER PROGRESS ---
  async saveUserProgress(uid: string, progress: UserProgress): Promise<void> {
    // Cache locally first for 100% offline resilience
    localStorage.setItem(`xebia_supabase_progress_${uid}`, JSON.stringify(progress));
    localStorage.setItem(`xebia_progress_${uid}`, JSON.stringify(progress));

    if (this.activeProvider === 'supabase' && supabase) {
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            uid: uid,
            enrolled_course_ids: progress.enrolledCourseIds,
            completed_lessons: progress.completedLessons,
            course_completion: progress.courseCompletion,
            completed_course_ids: progress.completedCourseIds,
            streak_days: progress.streakDays,
            last_active_date: progress.lastActiveDate,
            skills_mastered: progress.skillsMastered,
            certificates: progress.certificates,
            active_tab: progress.activeTab,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (err) {
        console.error('Failed to sync user progress to Supabase Cloud:', err);
      }
    }
  }
}

export const cloudDB = new CloudDatabaseService();
