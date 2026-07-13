import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, createUserProfile, saveUserProgressToDB, getUserProfile } from '../lib/firebase';
import { motion } from 'motion/react';
import { Mail, Lock, User, Briefcase, Award, ArrowRight, ShieldCheck, RefreshCw, LogOut, Check, X } from 'lucide-react';
import XebiaLogo from './XebiaLogo';
import XebiaLiveBackground from './XebiaLiveBackground';
import { UserProgress } from '../types';

interface AuthProps {
  onAuthSuccess: (user: any, profile: any) => void;
  initialRole?: 'Student' | 'Admin';
  onClose?: () => void;
}

export default function Auth({ onAuthSuccess, initialRole, onClose }: AuthProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [title, setTitle] = useState<string>('Frontend Engineer');
  const [role, setRole] = useState<'Student' | 'Admin'>(initialRole || 'Student');
  
  // Sync initialRole when it changes
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);
  
  // States for verification and loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState<boolean>(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // When signing in with Google, we check if they already have a custom profile in Firestore
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        // If not, we create one.
        const selectedTitle = !isLogin ? title : 'Senior Cloud Architect';
        const selectedRole = !isLogin ? role : 'Student';
        
        const profileData = {
          email: user.email || '',
          displayName: user.displayName || 'Google Learner',
          role: selectedRole,
          title: selectedTitle
        };
        await createUserProfile(user.uid, profileData);
        
        // Seed initial progress for them
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
        await saveUserProgressToDB(user.uid, initialProgress);
        
        profile = {
          uid: user.uid,
          createdAt: new Date().toISOString(),
          ...profileData
        };
      }

      onAuthSuccess(user, profile);
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'An error occurred during Google authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = (selectedRole: 'Student' | 'Admin') => {
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);
    
    const demoUid = `demo-${selectedRole.toLowerCase()}-user`;
    const demoUser = {
      uid: demoUid,
      email: `${selectedRole.toLowerCase()}@xebia.com`,
      emailVerified: true,
      displayName: `Demo ${selectedRole}`
    };
    
    const demoProfile = {
      uid: demoUid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      role: selectedRole,
      title: selectedRole === 'Admin' ? 'Enterprise Principal LMS Admin' : 'Senior Frontend Architect',
      createdAt: new Date().toISOString()
    };
    
    // Save in localStorage as standard session
    localStorage.setItem('xebia_demo_user', JSON.stringify({ user: demoUser, profile: demoProfile }));
    
    // Call success!
    onAuthSuccess(demoUser, demoProfile);
    setIsLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      if (isLogin) {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
          setTempUser(user);
          setVerificationPending(true);
          // Auto-send verification if they somehow didn't get it
          try {
            await sendEmailVerification(user);
          } catch (err) {
            console.log('Verification email already sent or rate limited');
          }
          setIsLoading(false);
          return;
        }

        // Fetch user profile info
        // Wait, since we fetch it inside App.tsx, we can trigger success callback
        onAuthSuccess(user, null);
      } else {
        // Sign Up
        if (!displayName.trim()) {
          throw new Error('Please enter your full name.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile Display Name
        await updateProfile(user, { displayName });

        // Create Custom User Profile in Firestore
        const profileData = {
          email,
          displayName,
          role,
          title
        };
        await createUserProfile(user.uid, profileData);

        // Seed initial progress in Firestore
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
        await saveUserProgressToDB(user.uid, initialProgress);

        // Send verification email
        await sendEmailVerification(user);

        setTempUser(user);
        setVerificationPending(true);
        setInfoMessage('Verification email sent! Please check your inbox.');
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use by another account.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = "Email/Password sign-in is disabled in your Firebase Console. Please click the 'Sign In with Google' or 'Register with Google' button below instead!";
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    if (!auth.currentUser && !tempUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser || tempUser;
      await user.reload();
      
      if (user.emailVerified) {
        setVerificationPending(false);
        onAuthSuccess(user, null);
      } else {
        setError('Email not verified yet. Please click the link in your email and try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to refresh status. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    const user = auth.currentUser || tempUser;
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);
    try {
      await sendEmailVerification(user);
      setInfoMessage('A fresh verification link has been sent to your email.');
    } catch (err: any) {
      console.error(err);
      setError('Too many requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVerification = async () => {
    await signOut(auth);
    setTempUser(null);
    setVerificationPending(false);
    setError(null);
    setInfoMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#0B090F] px-4 py-12 sm:px-6 lg:px-8" id="auth-screen">
      
      {/* Background Animated Waves */}
      <XebiaLiveBackground variant="dark" interactive={true} />

      <div className="relative z-10 w-full max-w-md space-y-8 bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/15 shadow-2xl">
        {onClose && (
          <button 
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
            title="Close Portal"
            id="auth-close-btn"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <XebiaLogo height={32} textColor="#FFFFFF" className="mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#FF5A36] font-mono font-bold pt-1">
            Academy Enterprise LMS
          </p>
        </div>

        {/* Dynamic Inner Container */}
        <div className="mt-6">
          {verificationPending ? (
            /* Verification Screen */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center text-slate-200"
              id="verification-pending-view"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mail className="h-8 w-8 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-white">Verify your email address</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  We've sent a verification link to <strong className="text-white">{(auth.currentUser || tempUser)?.email}</strong>. Please check your inbox or spam folder.
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 text-left">
                  {error}
                </div>
              )}

              {infoMessage && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 text-left flex items-start space-x-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{infoMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={checkVerificationStatus}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#831B84] to-purple-600 hover:from-[#9c259d] hover:to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  id="btn-verify-status"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>I have verified my email</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={resendVerification}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 py-3 rounded-xl transition-all cursor-pointer"
                    id="btn-resend-verify"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Resend Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelVerification}
                    className="flex items-center justify-center space-x-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 py-3 rounded-xl transition-all cursor-pointer"
                    id="btn-verify-cancel"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Cancel / Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Login/Registration Form */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* ⚡ Fast 1-Click Instant Access (Recommended) */}
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-center space-y-3 shadow-lg shadow-emerald-950/20" id="fast-access-container">
                <div className="flex items-center justify-center space-x-1.5 text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono">⚡ 1-Click Fast Login (Recommended)</span>
                </div>
                <p className="text-[11.5px] text-slate-300 leading-normal font-sans">
                  Instantly bypass Google iframe/domain authorization restrictions and experience the full Enterprise LMS Academy in under 0.1 seconds!
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('Student')}
                    className="flex items-center justify-center space-x-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                    id="fast-student-btn"
                  >
                    <span>Enter as Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('Admin')}
                    className="flex items-center justify-center space-x-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                    id="fast-admin-btn"
                  >
                    <span>Enter as Admin</span>
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 bg-white/5 rounded-2xl p-1 border border-white/5" id="auth-mode-tabs">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(null); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  id="tab-auth-login"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(null); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  id="tab-auth-register"
                >
                  Create Account
                </button>
              </div>

              {/* Error Box */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 text-left font-medium"
                  id="auth-error-box"
                >
                  {error}
                </motion.div>
              )}

              {/* Form elements */}
              <form onSubmit={handleAuth} className="space-y-4 text-left">
                
                {/* Full name (Register mode only) */}
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#831B84] focus:border-[#831B84] transition-all"
                        id="auth-input-fullname"
                      />
                    </div>
                  </div>
                )}

                {/* Email input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah.jenkins@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#831B84] focus:border-[#831B84] transition-all"
                      id="auth-input-email"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#831B84] focus:border-[#831B84] transition-all"
                      id="auth-input-password"
                    />
                  </div>
                </div>

                {/* Title and Role (Register mode only) */}
                {!isLogin && (
                  <>
                    {/* Job Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono">Professional Title</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-[#171321] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#831B84] focus:border-[#831B84] transition-all appearance-none cursor-pointer"
                          id="auth-input-title"
                        >
                          <option value="Frontend Engineer">Frontend Engineer</option>
                          <option value="Senior Cloud Architect">Senior Cloud Architect</option>
                          <option value="DevOps & Kubernetes Engineer">DevOps & Kubernetes Engineer</option>
                          <option value="Agile Coach & Consultant">Agile Coach & Consultant</option>
                          <option value="Director of Engineering">Director of Engineering</option>
                        </select>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono">Select Role</label>
                      <div className="grid grid-cols-2 gap-3" id="auth-role-selectors">
                        <button
                          type="button"
                          onClick={() => setRole('Student')}
                          className={`flex items-center justify-center space-x-1.5 py-2.5 text-xs rounded-xl border transition-all cursor-pointer ${
                            role === 'Student'
                              ? 'bg-gradient-to-r from-[#831B84] to-purple-800 border-transparent text-white font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                          id="role-select-student"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>Student</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole('Admin')}
                          className={`flex items-center justify-center space-x-1.5 py-2.5 text-xs rounded-xl border transition-all cursor-pointer ${
                            role === 'Admin'
                              ? 'bg-gradient-to-r from-[#FF5A36] to-orange-700 border-transparent text-white font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                          id="role-select-admin"
                        >
                          <Award className="h-3.5 w-3.5" />
                          <span>Admin</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-[#831B84] via-[#c449c5] to-[#FF5A36] hover:brightness-110 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  id="auth-submit-btn"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Portal' : 'Register Custom Account'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-mono uppercase tracking-wider">Or continue with</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                id="auth-google-btn"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>{isLogin ? 'Sign In with Google' : 'Register with Google'}</span>
              </button>

            </motion.div>
          )}
        </div>

      </div>

    </div>
  );
}
