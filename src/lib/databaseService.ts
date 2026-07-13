import { 
  getUserProfile as getFirebaseProfile, 
  createUserProfile as createFirebaseProfile, 
  getUserProgressFromDB as getFirebaseProgress, 
  saveUserProgressToDB as saveFirebaseProgress 
} from './firebase';
import { cloudDB } from './supabase';
import { UserProgress } from '../types';
import { UserProfile } from './firebase';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (cloudDB.getProvider() === 'supabase') {
    return cloudDB.getUserProfile(uid);
  }
  return getFirebaseProfile(uid);
}

export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<UserProfile> {
  if (cloudDB.getProvider() === 'supabase') {
    return cloudDB.createUserProfile(uid, profile);
  }
  const firebaseProfile: UserProfile = {
    ...profile,
    uid,
    createdAt: new Date().toISOString()
  };
  await createFirebaseProfile(uid, profile);
  return firebaseProfile;
}

export async function getUserProgressFromDB(uid: string): Promise<UserProgress | null> {
  if (cloudDB.getProvider() === 'supabase') {
    return cloudDB.getUserProgress(uid);
  }
  return getFirebaseProgress(uid);
}

export async function saveUserProgressToDB(uid: string, progress: UserProgress): Promise<void> {
  if (cloudDB.getProvider() === 'supabase') {
    return cloudDB.saveUserProgress(uid, progress);
  }
  return saveFirebaseProgress(uid, progress);
}
