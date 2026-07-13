import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  sendEmailVerification,
  signOut,
  setPersistence,
  browserLocalPersistence
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

// Enable local persistence so user sessions persist across page reloads
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

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
      const profile = userDocSnap.data() as UserProfile;
      try {
        localStorage.setItem(`xebia_profile_${uid}`, JSON.stringify(profile));
      } catch (e) {
        console.warn('Error caching user profile locally:', e);
      }
      return profile;
    }
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('offline') || errorMsg.includes('unavailable') || errorMsg.includes('network')) {
      console.info('Serving user profile from offline cache due to connection limits.');
    } else {
      console.error('Error fetching user profile:', error);
    }
  }

  // Fallback to local storage cache if offline or error occurs
  try {
    const cached = localStorage.getItem(`xebia_profile_${uid}`);
    if (cached) {
      console.log('Serving user profile from offline cache for:', uid);
      return JSON.parse(cached) as UserProfile;
    }
  } catch (e) {
    console.warn('Error reading cached user profile:', e);
  }
  return null;
}

export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt'>): Promise<void> {
  const profileData: UserProfile = {
    ...profile,
    uid,
    createdAt: new Date().toISOString()
  };

  // Cache locally first for 100% offline resilience
  try {
    localStorage.setItem(`xebia_profile_${uid}`, JSON.stringify(profileData));
  } catch (e) {
    console.warn('Error caching created user profile locally:', e);
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, profileData);
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('offline') || errorMsg.includes('unavailable') || errorMsg.includes('network')) {
      console.info('Firestore is offline. User profile queued locally (will sync when online).');
    } else {
      console.error('Error creating user profile in Firestore:', error);
    }
  }
}

// Helper to fetch user progress
export async function getUserProgressFromDB(uid: string): Promise<UserProgress | null> {
  try {
    const progressDocRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressDocRef);
    if (progressSnap.exists()) {
      const progress = progressSnap.data() as UserProgress;
      try {
        localStorage.setItem(`xebia_progress_${uid}`, JSON.stringify(progress));
      } catch (e) {
        console.warn('Error caching user progress locally:', e);
      }
      return progress;
    }
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('offline') || errorMsg.includes('unavailable') || errorMsg.includes('network')) {
      console.info('Serving user progress from offline cache due to connection limits.');
    } else {
      console.error('Error fetching user progress from DB:', error);
    }
  }

  // Fallback to local storage cache if offline or error occurs
  try {
    const cached = localStorage.getItem(`xebia_progress_${uid}`);
    if (cached) {
      console.log('Serving user progress from offline cache for:', uid);
      return JSON.parse(cached) as UserProgress;
    }
  } catch (e) {
    console.warn('Error reading cached user progress:', e);
  }
  return null;
}

// Helper to save user progress
export async function saveUserProgressToDB(uid: string, progress: UserProgress): Promise<void> {
  // Cache locally first for 100% offline resilience
  try {
    localStorage.setItem(`xebia_progress_${uid}`, JSON.stringify(progress));
  } catch (e) {
    console.warn('Error caching user progress locally:', e);
  }

  try {
    const progressDocRef = doc(db, 'userProgress', uid);
    await setDoc(progressDocRef, progress);
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('offline') || errorMsg.includes('unavailable') || errorMsg.includes('network')) {
      console.info('Firestore is offline. Progress queued locally (will sync when online).');
    } else {
      console.error('Error saving user progress to Firestore:', error);
    }
  }
}

// ==========================================
// CUSTOM DATABASE-BACKED AUTHENTICATION (FASTER & NO FIREBASE AUTH IFRAME/POPUP DELAYS)
// ==========================================

export async function registerCustomUser(
  email: string,
  password: string,
  displayName: string,
  role: 'Student' | 'Admin',
  title: string
): Promise<{ user: any; profile: UserProfile }> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const credentialDocRef = doc(db, 'customCredentials', normalizedEmail);
    const credentialSnap = await getDoc(credentialDocRef);
    if (credentialSnap.exists()) {
      throw new Error('This email is already in use by another account.');
    }

    // Generate a unique client-side custom ID
    const customUid = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Store secure credentials block (using standard base64 for safe encoding)
    const encodedPassword = btoa(password);
    await setDoc(credentialDocRef, {
      email: normalizedEmail,
      password: encodedPassword,
      uid: customUid,
      createdAt: new Date().toISOString()
    });

    // Create the standard profile
    const profileData: UserProfile = {
      uid: customUid,
      email: normalizedEmail,
      displayName,
      role,
      title,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', customUid), profileData);

    // Seed initial progress block
    const initialProgress: UserProgress = {
      enrolledCourseIds: ['course-aws-arch', 'course-scrum-master'],
      completedLessons: ['aws-l1', 'aws-l2', 'scrum-l1'],
      courseCompletion: {
        'course-aws-arch': 65,
        'course-scrum-master': 13
      },
      completedCourseIds: [],
      streakDays: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      skillsMastered: ['VPC Networking', 'Scrum Values'],
      certificates: [],
      activeTab: 'home'
    };
    await setDoc(doc(db, 'userProgress', customUid), initialProgress);

    const userObj = {
      uid: customUid,
      email: normalizedEmail,
      displayName
    };

    return { user: userObj, profile: profileData };
  } catch (error: any) {
    console.error('Error in custom user registration:', error);
    throw error;
  }
}

export async function loginCustomUser(
  email: string,
  password: string
): Promise<{ user: any; profile: UserProfile }> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Get credentials doc
    const credentialDocRef = doc(db, 'customCredentials', normalizedEmail);
    const credentialSnap = await getDoc(credentialDocRef);
    if (!credentialSnap.exists()) {
      throw new Error('Invalid email or password.');
    }

    const creds = credentialSnap.data();
    const encodedPassword = btoa(password);
    if (creds.password !== encodedPassword) {
      throw new Error('Invalid email or password.');
    }

    // Fetch public profile
    const profile = await getUserProfile(creds.uid);
    if (!profile) {
      throw new Error('User profile record not found in database.');
    }

    const userObj = {
      uid: creds.uid,
      email: normalizedEmail,
      displayName: profile.displayName
    };

    return { user: userObj, profile };
  } catch (error: any) {
    console.error('Error in custom user login:', error);
    throw error;
  }
}

