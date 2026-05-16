// src/lib/firebase/firestore.ts - FIXED (No 'any' types)
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  WhereFilterOp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

interface Filter {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean | null;
}

// Generic function to get a document
export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error('Error getting document:', error);
    return null;
  }
};

// Generic function to get multiple documents with filters
export const getDocuments = async <T>(
  collectionName: string,
  filters?: Filter[],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<T[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // Add filters
    if (filters) {
      filters.forEach((filter) => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
    }

    // Add ordering
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection || 'desc'));
    }

    // Add limit
    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });

    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};

// Create or set a document
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error setting document:', error);
    return false;
  }
};

// Update a document
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

// Convert Firestore timestamp to Date
export const timestampToDate = (timestamp: Timestamp | { toDate: () => Date } | Date | string | number): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};