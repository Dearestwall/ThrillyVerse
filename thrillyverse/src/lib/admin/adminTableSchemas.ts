export type AdminFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'date'
  | 'datetime'
  | 'select'
  | 'tags'
  | 'json'
  | 'hidden';

export type AdminFieldOverride = {
  label?: string;
  type?: AdminFieldType;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
  hidden?: boolean;
  readOnly?: boolean;
  createOnly?: boolean;
  updateOnly?: boolean;
  required?: boolean;
};

export type AdminTableOverride = {
  titleField?: string;
  slugSourceField?: string;
  hiddenColumns?: string[];
  fieldOrder?: string[];
  overrides?: Record<string, AdminFieldOverride>;
};

export const ADMIN_TABLE_OVERRIDES: Record<string, AdminTableOverride> = {
  projects: {
    titleField: 'title',
    slugSourceField: 'title',
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    fieldOrder: [
      'title',
      'slug',
      'status',
      'summary',
      'description',
      'image_url',
      'tech_stack',
      'link',
      'github_url',
      'sort_order',
      'featured',
    ],
    overrides: {
      title: { label: 'Title', type: 'text', required: true },
      slug: { label: 'Slug', type: 'text' },
      status: {
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
          { label: 'Archived', value: 'archived' },
        ],
      },
      summary: { label: 'Summary', type: 'textarea' },
      description: { label: 'Description', type: 'textarea' },
      image_url: { label: 'Image URL', type: 'url' },
      tech_stack: {
        label: 'Tech Stack',
        type: 'tags',
        placeholder: 'React, Next.js, Supabase',
      },
      link: { label: 'Live Link', type: 'url' },
      github_url: { label: 'GitHub URL', type: 'url' },
      sort_order: { label: 'Sort Order', type: 'number' },
      featured: { label: 'Featured', type: 'checkbox' },
    },
  },

  movies: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    fieldOrder: [
      'title',
      'slug',
      'category',
      'description',
      'poster_url',
      'trailer_url',
      'movie_link',
      'download_link',
      'year',
      'rating',
      'language',
      'duration',
      'tags',
      'featured',
      'published',
      'sort_order',
    ],
    overrides: {
      description: { type: 'textarea' },
      poster_url: { label: 'Poster URL', type: 'url' },
      trailer_url: { label: 'Trailer URL', type: 'url' },
      movie_link: { label: 'Movie Link', type: 'url' },
      download_link: { label: 'Download Link', type: 'url' },
      tags: { type: 'tags' },
      featured: { type: 'checkbox' },
      published: { type: 'checkbox' },
    },
  },

  blogs: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'author_id', 'published_at'],
    fieldOrder: [
      'title',
      'slug',
      'category',
      'excerpt',
      'content',
      'cover_image',
      'tags',
      'read_time',
      'featured',
      'published',
    ],
    overrides: {
      excerpt: { type: 'textarea' },
      content: { type: 'textarea' },
      cover_image: { label: 'Cover Image', type: 'url' },
      tags: { type: 'tags' },
      featured: { type: 'checkbox' },
      published: { type: 'checkbox' },
    },
  },

  reviews: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    fieldOrder: [
      'name',
      'role',
      'text',
      'avatar_url',
      'emoji',
      'rating',
      'featured',
      'published',
      'sort_order',
    ],
    overrides: {
      text: { label: 'Review Text', type: 'textarea' },
      avatar_url: { label: 'Avatar URL', type: 'url' },
      featured: { type: 'checkbox' },
      published: { type: 'checkbox' },
    },
  },

  certifications: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    fieldOrder: ['title', 'subtitle', 'emoji', 'color_from', 'color_to', 'sort_order', 'active'],
    overrides: {
      active: { type: 'checkbox' },
    },
  },

  notifications: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    fieldOrder: ['title', 'message', 'type', 'target_url', 'audience', 'is_active'],
    overrides: {
      message: { type: 'textarea' },
      type: {
        type: 'select',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
        ],
      },
      target_url: { label: 'Target URL', type: 'url' },
      is_active: { label: 'Active', type: 'checkbox' },
    },
  },

  partners: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    fieldOrder: ['name', 'emoji', 'logo_url', 'website_url', 'sort_order', 'active'],
    overrides: {
      logo_url: { label: 'Logo URL', type: 'url' },
      website_url: { label: 'Website URL', type: 'url' },
      active: { type: 'checkbox' },
    },
  },

  materials: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    overrides: {
      description: { type: 'textarea' },
      cover_image: { label: 'Cover Image', type: 'url' },
      resource_link: { label: 'Resource Link', type: 'url' },
      download_link: { label: 'Download Link', type: 'url' },
      is_premium: { label: 'Premium', type: 'checkbox' },
      featured: { type: 'checkbox' },
      published: { type: 'checkbox' },
    },
  },

  quizzes: {
    hiddenColumns: ['id', 'created_at', 'updated_at', 'created_by'],
    overrides: {
      description: { type: 'textarea' },
      difficulty: {
        type: 'select',
        options: [
          { label: 'Easy', value: 'easy' },
          { label: 'Medium', value: 'medium' },
          { label: 'Hard', value: 'hard' },
        ],
      },
      published: { type: 'checkbox' },
    },
  },
};