import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, db, googleProvider } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { uploadProfilePhoto } from '../lib/storage';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photo?: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Check for redirect result on initial load
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        handleGoogleUser(result.user);
      }
    }).catch((error) => {
      console.error('Redirect Sign In Error:', error);
    });

    return unsubscribe;
  }, []);

  const handleGoogleUser = async (user: User) => {
    // Create or update user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date().toISOString()
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    try {
      // Try popup first
      const result = await signInWithPopup(auth, googleProvider);
      await handleGoogleUser(result.user);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        // If popup is blocked, fall back to redirect
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw error;
      }
    }
  };

  const logout = () => signOut(auth);

  const updateUserProfile = async (displayName: string, photo?: File) => {
    if (!currentUser) return;

    const updates: { displayName: string; photoURL?: string } = { displayName };

    if (photo) {
      const photoURL = await uploadProfilePhoto(currentUser.uid, photo);
      updates.photoURL = photoURL;
    }

    await updateProfile(currentUser, updates);
    
    await setDoc(doc(db, 'users', currentUser.uid), {
      name: displayName,
      ...(updates.photoURL && { photoURL: updates.photoURL }),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setCurrentUser({ ...currentUser, ...updates });
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}