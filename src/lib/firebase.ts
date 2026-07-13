import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { UserProgress } from '../types';

// Configuration from /firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAbp1a2YrRNSdXj9zvT5zYC7Zsl5Nww08k",
  authDomain: "prismatic-coast-kjmtp.firebaseapp.com",
  projectId: "prismatic-coast-kjmtp",
  storageBucket: "prismatic-coast-kjmtp.firebasestorage.app",
  messagingSenderId: "109473836292",
  appId: "1:109473836292:web:a734faff5300f3ac77b451"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to fetch user custom fields (role, title, displayName)
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'Student' | 'Admin';
  title: string;
  createdAt: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserProfile;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
  return null;
}

export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...profile,
      uid,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Helper to fetch user progress
export async function getUserProgressFromDB(uid: string): Promise<UserProgress | null> {
  try {
    const progressDocRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressDocRef);
    if (progressSnap.exists()) {
      return progressSnap.data() as UserProgress;
    }
  } catch (error) {
    console.error('Error fetching user progress from DB:', error);
  }
  return null;
}

// Helper to save user progress
export async function saveUserProgressToDB(uid: string, progress: UserProgress): Promise<void> {
  try {
    const progressDocRef = doc(db, 'userProgress', uid);
    await setDoc(progressDocRef, progress);
  } catch (error) {
    console.error('Error saving user progress to DB:', error);
  }
}
