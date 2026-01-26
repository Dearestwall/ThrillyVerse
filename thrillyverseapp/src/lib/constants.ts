// src/lib/constants.ts

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Language',
  'English Literature',
  'History',
  'Geography',
  'Computer Applications',
  'Commercial Applications',
  'Economics',
  'Physical Education',
  'Hindi',
] as const;

export const CLASSES = ['10', '11', '12'] as const;

export const MATERIAL_TYPES = ['PDF', 'Document', 'Notes', 'Video'] as const;

export const PROJECT_CATEGORIES = [
  'Web App',
  'Mobile App',
  'Game',
  'Tool',
  'Educational',
  'Other',
] as const;

export const TECHNOLOGIES = [
  'Next.js',
  'React',
  'TypeScript',
  'Firebase',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'JavaScript',
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];