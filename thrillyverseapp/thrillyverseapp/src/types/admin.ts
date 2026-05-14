// src/types/admin.ts - COMPLETE & ERROR-FREE

// Define Material types inline to avoid import errors
type MaterialStatus = 'pending' | 'approved' | 'rejected';
type MaterialType = 'pdf' | 'video' | 'document' | 'link';

interface Material {
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

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMaterials: number;
  pendingApprovals: number;
  totalQuizzes: number;
  unreadMessages: number;
  todaySignups: number;
  todayDownloads: number;
}

export interface UserActivity {
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  details?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  repliedBy?: string;
  reply?: string;
  createdAt: Date;
  repliedAt?: Date;
  category?: 'general' | 'technical' | 'content' | 'other';
}

export interface UploadRequest {
  id: string;
  materialData: Omit<Material, 'id' | 'status' | 'approvedBy'>;
  requestedBy: string;
  requestedByName: string;
  status: MaterialStatus;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: Date;
  reviewedAt?: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface SiteSettings {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    featuredMaterials: string[];
    announcements: Announcement[];
  };
  stats: AdminStats;
}

// Export Material types for use in other files
export type { Material, MaterialStatus, MaterialType };