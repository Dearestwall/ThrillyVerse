// src/lib/firebase/firestore.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

// Generic CRUD operations

export async function createDocument<T extends Record<string, any>>(
  collectionName: string,
  data: T
) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
}

export async function getDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    }
    return { data: null, error: 'Document not found' };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getDocuments(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data: documents, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, any>
) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Specific queries for ThrillyVerse

export async function getPublishedProjects() {
  return getDocuments('projects', [
    where('status', '==', 'published'),
    orderBy('order', 'asc'),
  ]);
}

export async function getFeaturedProjects() {
  return getDocuments('projects', [
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('order', 'asc'),
    limit(6),
  ]);
}

export async function getApprovedMaterials() {
  return getDocuments('materials', [
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
  ]);
}

export async function getPendingMaterials() {
  return getDocuments('materials', [
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  ]);
}