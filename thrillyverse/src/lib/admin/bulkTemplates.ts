import type { AdminBulkTemplateField } from '@/lib/admin/bulkTypes';

// ── Movies ───────────────────────────────────────────────────────────────────
export const moviesBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',         type: 'text',     required: true },
  { key: 'slug',          label: 'Slug',          type: 'text',     helpText: 'Auto-generated from title if left blank' },
  { key: 'description',   label: 'Description',   type: 'textarea' },
  { key: 'poster_url',    label: 'Poster URL',    type: 'url' },
  { key: 'trailer_url',   label: 'Trailer URL',   type: 'url' },
  { key: 'movie_link',    label: 'Movie Link',    type: 'url' },
  { key: 'download_link', label: 'Download Link', type: 'url' },
  { key: 'category',      label: 'Category',      type: 'text' },
  { key: 'year',          label: 'Year',          type: 'number' },
  { key: 'rating',        label: 'Rating',        type: 'text',     helpText: 'e.g. 8.5 or PG-13' },
  { key: 'language',      label: 'Language',      type: 'text' },
  { key: 'duration',      label: 'Duration',      type: 'text',     helpText: 'e.g. 2h 15m' },
  { key: 'tags',          label: 'Tags',          type: 'tags',     helpText: 'Comma-separated' },
  { key: 'featured',      label: 'Featured',      type: 'checkbox', helpText: 'true/false' },
  { key: 'published',     label: 'Published',     type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order',    label: 'Sort Order',    type: 'number' },
];

// ── Materials ────────────────────────────────────────────────────────────────
export const materialsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',         type: 'text',     required: true },
  { key: 'slug',          label: 'Slug',          type: 'text',     helpText: 'Auto-generated from title if left blank' },
  { key: 'board',         label: 'Board',         type: 'text',     helpText: 'e.g. ICSE, CBSE, ISC, State, Other' },
  { key: 'class_level',   label: 'Class Level',   type: 'text',     helpText: 'e.g. 10, 11, 12' },
  { key: 'subject',       label: 'Subject',       type: 'text' },
  { key: 'topic',         label: 'Topic',         type: 'text' },
  { key: 'description',   label: 'Description',   type: 'textarea' },
  { key: 'cover_image',   label: 'Cover Image',   type: 'url' },
  {
    key: 'resource_type',
    label: 'Resource Type',
    type: 'select',
    options: [
      { label: 'Notes', value: 'notes' },
      { label: 'PDF',   value: 'pdf'   },
      { label: 'Video', value: 'video' },
      { label: 'Link',  value: 'link'  },
      { label: 'Image', value: 'image' },
      { label: 'Other', value: 'other' },
    ],
  },
  { key: 'resource_link', label: 'Resource Link', type: 'url' },
  { key: 'download_link', label: 'Download Link', type: 'url' },
  { key: 'file_size',     label: 'File Size',     type: 'text',     helpText: 'e.g. 2.4 MB' },
  { key: 'is_premium',    label: 'Is Premium',    type: 'checkbox', helpText: 'true/false' },
  { key: 'featured',      label: 'Featured',      type: 'checkbox', helpText: 'true/false' },
  { key: 'published',     label: 'Published',     type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order',    label: 'Sort Order',    type: 'number' },
];

// ── Blogs ─────────────────────────────────────────────────────────────────────
export const blogsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',       label: 'Title',       type: 'text',     required: true },
  { key: 'slug',        label: 'Slug',        type: 'text',     helpText: 'Auto-generated from title if left blank' },
  { key: 'excerpt',     label: 'Excerpt',     type: 'textarea' },
  { key: 'content',     label: 'Content',     type: 'textarea' },
  { key: 'cover_image', label: 'Cover Image', type: 'url' },
  { key: 'category',    label: 'Category',    type: 'text' },
  { key: 'tags',        label: 'Tags',        type: 'tags',     helpText: 'Comma-separated' },
  { key: 'read_time',   label: 'Read Time',   type: 'number',   helpText: 'In minutes' },
  { key: 'featured',    label: 'Featured',    type: 'checkbox', helpText: 'true/false' },
  { key: 'published',   label: 'Published',   type: 'checkbox', helpText: 'true/false — sets published_at automatically' },
];

// ── Quizzes ───────────────────────────────────────────────────────────────────
export const quizzesBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',       label: 'Title',       type: 'text',     required: true },
  { key: 'slug',        label: 'Slug',        type: 'text',     helpText: 'Auto-generated from title if left blank' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'board',       label: 'Board',       type: 'text',     helpText: 'e.g. ICSE, CBSE' },
  { key: 'class_level', label: 'Class Level', type: 'text',     helpText: 'e.g. 10, 11' },
  { key: 'subject',     label: 'Subject',     type: 'text' },
  { key: 'time_limit',  label: 'Time Limit',  type: 'number',   helpText: 'In minutes' },
  {
    key: 'difficulty',
    label: 'Difficulty',
    type: 'select',
    options: [
      { label: 'Easy',   value: 'easy'   },
      { label: 'Medium', value: 'medium' },
      { label: 'Hard',   value: 'hard'   },
    ],
  },
  { key: 'published', label: 'Published', type: 'checkbox', helpText: 'true/false' },
];

// ── Announcements ─────────────────────────────────────────────────────────────
export const announcementsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',     label: 'Title',     type: 'text',     required: true },
  { key: 'body',      label: 'Body',      type: 'textarea' },
  { key: 'cta_label', label: 'CTA Label', type: 'text' },
  { key: 'cta_url',   label: 'CTA URL',   type: 'url' },
  { key: 'badge',     label: 'Badge',     type: 'text' },
  { key: 'priority',  label: 'Priority',  type: 'number',   helpText: 'Higher = shown first' },
  { key: 'active',    label: 'Active',    type: 'checkbox', helpText: 'true/false' },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',      label: 'Title',      type: 'text',     required: true },
  { key: 'message',    label: 'Message',    type: 'textarea', required: true },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { label: 'Info',    value: 'info'    },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Error',   value: 'error'   },
    ],
  },
  { key: 'target_url', label: 'Target URL', type: 'url' },
  {
    key: 'audience',
    label: 'Audience',
    type: 'select',
    options: [
      { label: 'All',      value: 'all'      },
      { label: 'Students', value: 'students' },
      { label: 'Admins',   value: 'admins'   },
      { label: 'Visitors', value: 'visitors' },
    ],
  },
  { key: 'is_active', label: 'Is Active', type: 'checkbox', helpText: 'true/false' },
];

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',       label: 'Title',       type: 'text',     required: true },
  { key: 'slug',        label: 'Slug',        type: 'text',     helpText: 'Auto-uniquified from title if left blank' },
  { key: 'summary',     label: 'Summary',     type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'image_url',   label: 'Image URL',   type: 'url' },
  { key: 'tech_stack',  label: 'Tech Stack',  type: 'tags',     helpText: 'Comma-separated e.g. React, Next.js' },
  { key: 'link',        label: 'Live Link',   type: 'url' },
  { key: 'github_url',  label: 'GitHub URL',  type: 'url' },
  { key: 'featured',    label: 'Featured',    type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order',  label: 'Sort Order',  type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Published', value: 'published' },
      { label: 'Archived',  value: 'archived'  },
    ],
  },
];

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',       label: 'Name',        type: 'text',     required: true },
  { key: 'role',       label: 'Role',        type: 'text',     helpText: 'e.g. Movie Enthusiast' },
  { key: 'text',       label: 'Review Text', type: 'textarea', required: true },
  { key: 'avatar_url', label: 'Avatar URL',  type: 'url' },
  { key: 'emoji',      label: 'Emoji',       type: 'text',     helpText: 'e.g. ⭐ (defaults to ⭐)' },
  { key: 'rating',     label: 'Rating',      type: 'number',   helpText: '1–5 (defaults to 5)' },
  { key: 'featured',   label: 'Featured',    type: 'checkbox', helpText: 'true/false' },
  { key: 'published',  label: 'Published',   type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order', label: 'Sort Order',  type: 'number' },
];

// ── Partners ──────────────────────────────────────────────────────────────────
export const partnersBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',        label: 'Name',        type: 'text',     required: true },
  { key: 'emoji',       label: 'Emoji',       type: 'text' },
  { key: 'logo_url',    label: 'Logo URL',    type: 'url' },
  { key: 'website_url', label: 'Website URL', type: 'url' },
  { key: 'sort_order',  label: 'Sort Order',  type: 'number' },
  { key: 'active',      label: 'Active',      type: 'checkbox', helpText: 'true/false' },
];

// ── Certifications ────────────────────────────────────────────────────────────
export const certificationsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',      label: 'Title',      type: 'text',     required: true },
  { key: 'subtitle',   label: 'Subtitle',   type: 'text' },
  { key: 'emoji',      label: 'Emoji',      type: 'text',     helpText: 'e.g. 🔐' },
  { key: 'color_from', label: 'Color From', type: 'text',     helpText: 'Hex e.g. #7c3aed' },
  { key: 'color_to',   label: 'Color To',   type: 'text',     helpText: 'Hex e.g. #6d28d9' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
  { key: 'active',     label: 'Active',     type: 'checkbox', helpText: 'true/false' },
];

// ── Contacts (exportable, read-only import) ───────────────────────────────────
export const contactsBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',    label: 'Name',    type: 'text',     required: true },
  { key: 'email',   label: 'Email',   type: 'email',    required: true },
  { key: 'phone',   label: 'Phone',   type: 'text' },
  { key: 'subject', label: 'Subject', type: 'text' },
  { key: 'message', label: 'Message', type: 'textarea' },
  { key: 'read',    label: 'Read',    type: 'checkbox', helpText: 'true/false' },
];