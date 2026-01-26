// src/lib/firebase/database.ts - FIXED VERSION (No 'any' types)
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// =====================================================================
// TYPE DEFINITIONS
// =====================================================================

interface MaterialData {
  title: string;
  subject: string;
  chapter: string;
  description: string;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  tags: string[];
}

interface QuizData {
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  questions: QuizQuestion[];
  duration: number;
  totalPoints: number;
  passingScore: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

interface QueryFilters {
  subject?: string;
  chapter?: string;
  difficulty?: string;
  limit?: number;
}

interface FirebaseError {
  code?: string;
  message?: string;
}

// =====================================================================
// MATERIALS FUNCTIONS
// =====================================================================

export async function createMaterial(materialData: MaterialData, userId: string) {
  try {
    const materialRef = doc(collection(db, 'materials'));
    await setDoc(materialRef, {
      ...materialData,
      id: materialRef.id,
      uploadedBy: userId,
      downloads: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: materialRef.id };
  } catch (error) {
    const err = error as FirebaseError;
    console.error('Error creating material:', err);
    return { success: false, error: err.message || 'Failed to create material' };
  }
}

export async function getMaterials(filters: QueryFilters = {}) {
  try {
    let q = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));

    if (filters.subject) {
      q = query(q, where('subject', '==', filters.subject));
    }
    if (filters.chapter) {
      q = query(q, where('chapter', '==', filters.chapter));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting materials:', error);
    return [];
  }
}

export async function incrementMaterialDownloads(materialId: string) {
  try {
    const materialRef = doc(db, 'materials', materialId);
    await updateDoc(materialRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
  }
}

// =====================================================================
// QUIZZES FUNCTIONS
// =====================================================================

export async function createQuiz(quizData: QuizData, userId: string) {
  try {
    const quizRef = doc(collection(db, 'quizzes'));
    await setDoc(quizRef, {
      ...quizData,
      id: quizRef.id,
      createdBy: userId,
      attempts: 0,
      averageScore: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: quizRef.id };
  } catch (error) {
    const err = error as FirebaseError;
    console.error('Error creating quiz:', err);
    return { success: false, error: err.message || 'Failed to create quiz' };
  }
}

export async function getQuizzes(filters: QueryFilters = {}) {
  try {
    let q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));

    if (filters.subject) {
      q = query(q, where('subject', '==', filters.subject));
    }
    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return [];
  }
}

export async function submitQuizAttempt(
  quizId: string, 
  userId: string, 
  score: number, 
  answers: Record<string, number>
) {
  try {
    const attemptRef = doc(collection(db, 'quizAttempts'));
    await setDoc(attemptRef, {
      quizId,
      userId,
      score,
      answers,
      completedAt: serverTimestamp(),
    });

    // Update quiz stats
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, {
      attempts: increment(1)
    });

    return { success: true, id: attemptRef.id };
  } catch (error) {
    const err = error as FirebaseError;
    console.error('Error submitting quiz attempt:', err);
    return { success: false, error: err.message || 'Failed to submit quiz' };
  }
}

// =====================================================================
// COMMENTS FUNCTIONS
// =====================================================================

export async function addComment(
  resourceType: string, 
  resourceId: string, 
  userId: string, 
  userName: string, 
  content: string
) {
  try {
    const commentRef = doc(collection(db, 'comments'));
    await setDoc(commentRef, {
      id: commentRef.id,
      resourceType,
      resourceId,
      userId,
      userName,
      content,
      likes: 0,
      replies: [],
      createdAt: serverTimestamp(),
    });
    return { success: true, id: commentRef.id };
  } catch (error) {
    const err = error as FirebaseError;
    console.error('Error adding comment:', err);
    return { success: false, error: err.message || 'Failed to add comment' };
  }
}

export async function getComments(resourceType: string, resourceId: string) {
  try {
    const q = query(
      collection(db, 'comments'),
      where('resourceType', '==', resourceType),
      where('resourceId', '==', resourceId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function likeComment(commentId: string) {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking comment:', error);
  }
}

// =====================================================================
// USER PROFILE FUNCTIONS
// =====================================================================

interface UserProfileUpdates {
  displayName?: string;
  bio?: string;
  photoURL?: string;
  [key: string]: string | undefined;
}

export async function updateUserProfile(userId: string, updates: UserProfileUpdates) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    const err = error as FirebaseError;
    console.error('Error updating user profile:', err);
    return { success: false, error: err.message || 'Failed to update profile' };
  }
}

interface QuizAttempt {
  score: number;
  [key: string]: unknown;
}

export async function getUserStats(userId: string) {
  try {
    // Get quiz attempts
    const attemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId)
    );
    const attemptsSnapshot = await getDocs(attemptsQuery);
    const attempts = attemptsSnapshot.docs.map(doc => doc.data() as QuizAttempt);

    // Get comments
    const commentsQuery = query(
      collection(db, 'comments'),
      where('userId', '==', userId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    return {
      quizzesTaken: attempts.length,
      averageScore: attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        : 0,
      commentsPosted: commentsSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

// =====================================================================
// ADMIN FUNCTIONS
// =====================================================================

export async function getAdminStats() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const materialsSnapshot = await getDocs(collection(db, 'materials'));
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    const commentsSnapshot = await getDocs(collection(db, 'comments'));

    return {
      totalUsers: usersSnapshot.size,
      totalMaterials: materialsSnapshot.size,
      totalQuizzes: quizzesSnapshot.size,
      totalComments: commentsSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return null;
  }
}

export async function deleteResource(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (error) {
    const err = error as FirebaseError;
    console.error('Error deleting resource:', err);
    return { success: false, error: err.message || 'Failed to delete resource' };
  }
}