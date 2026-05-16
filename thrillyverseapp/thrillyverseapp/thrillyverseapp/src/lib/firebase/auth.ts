// src/lib/firebase/auth.ts - WITH GOOGLE SIGN-IN
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';

interface AuthResult {
  user: User | null;
  error: string | null;
}

const getErrorMessage = (error: AuthError): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email address',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/popup-closed-by-user': 'Sign-in cancelled',
    'auth/cancelled-popup-request': 'Sign-in cancelled',
  };

  return errorMessages[error.code] || 'An error occurred. Please try again';
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: getErrorMessage(error as AuthError) };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
      displayName,
    });

    await sendEmailVerification(userCredential.user);

    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: getErrorMessage(error as AuthError) };
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const provider = new GoogleAuthProvider();
    // Optional: Add scopes
    provider.addScope('profile');
    provider.addScope('email');

    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      return { user: null, error: 'Google sign-in failed' };
    }

    return { user: result.user, error: null };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { user: null, error: getErrorMessage(error as AuthError) };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: getErrorMessage(error as AuthError) };
  }
};

export const logOut = signOut;

export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: getErrorMessage(error as AuthError) };
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resendVerificationEmail = async (user: User): Promise<{ error: string | null }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user is currently signed in' };
    }

    await sendEmailVerification(user);
    return { error: null };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { error: getErrorMessage(error as AuthError) };
  }
};