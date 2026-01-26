// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

export async function signUp(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData: Omit<User, 'uid'> = {
      email: user.email!,
      displayName,
      photoURL: user.photoURL || '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new user document
      const userData: Omit<User, 'uid'> = {
        email: user.email!,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || '',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { uid, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function isAdmin(user: FirebaseUser | null): Promise<boolean> {
  if (!user) return false;

  const userData = await getUserData(user.uid);
  if (userData?.role === 'admin') return true;

  // Check if email is in admin list
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(user.email || '');
}