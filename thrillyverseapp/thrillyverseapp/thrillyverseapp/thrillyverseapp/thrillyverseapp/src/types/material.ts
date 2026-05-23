// src/types/material.ts
export type MaterialStatus = 'pending' | 'approved' | 'rejected';
export type MaterialType = 'pdf' | 'video' | 'document' | 'link';

export interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  topic: string;
  fileUrl: string;
  fileType: MaterialType;
  fileSize: number;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedByName: string;
  status: MaterialStatus;
  approvedBy?: string;
  rejectionReason?: string;
  downloads: number;
  views: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaterialData {
  title: string;
  description: string;
  subject: string;
  class: string;
  topic: string;
  fileUrl: string;
  fileType: MaterialType;
  fileSize: number;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface MaterialFilters {
  subject?: string;
  class?: string;
  topic?: string;
  status?: MaterialStatus;
  uploadedBy?: string;
  searchQuery?: string;
}
