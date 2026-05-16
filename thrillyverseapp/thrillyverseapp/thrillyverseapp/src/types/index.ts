// src/types/index.ts
// Core TypeScript types for ThrillyVerse

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
}

export interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  type: 'PDF' | 'Document' | 'Notes' | 'Video';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  thumbnail?: string;
  tags: string[];
  uploadedBy: string;
  uploaderName: string;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  entityType: 'project' | 'material' | 'quiz';
  entityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  likes: number;
  likedBy: string[];
  status: 'active' | 'hidden' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  readBy?: string;
  readAt?: Date;
  createdAt: Date;
}
