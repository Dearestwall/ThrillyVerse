import type { AdminBulkTemplateField } from '@/components/sections/admin/AdminBulkUploadModal';

// ── Movies ──────────────────────────────────────────────────────────────────
export const moviesBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',           type: 'text',     required: true  },
  { key: 'slug',          label: 'Slug',             type: 'text',     required: true  },
  { key: 'description',   label: 'Description',      type: 'textarea'                  },
  { key: 'cover_url',     label: 'Cover URL',        type: 'url'                       },
  { key: 'trailer_url',   label: 'Trailer URL',      type: 'url'                       },
  { key: 'stream_url',    label: 'Stream URL',       type: 'url'                       },
  { key: 'genre',         label: 'Genre',            type: 'tags',     helpText: 'Comma-separated' },
  { key: 'language',      label: 'Language',         type: 'text'                      },
  { key: 'release_year',  label: 'Release Year',     type: 'number'                    },
  { key: 'rating',        label: 'Rating',           type: 'number'                    },
  { key: 'featured',      label: 'Featured',         type: 'checkbox', helpText: 'true/false' },
  { key: 'published',     label: 'Published',        type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order',    label: 'Sort Order',       type: 'number'                    },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Materials ────────────────────────────────────────────────────────────────
export const materialsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'slug',          label: 'Slug',             type: 'text',     required: true  },
  { key: 'board',         label: 'Board',            type: 'text',     required: true, helpText: 'e.g. ICSE, CBSE' },
  { key: 'class_level',   label: 'Class Level',      type: 'number',   required: true, helpText: 'e.g. 10, 11' },
  { key: 'subject',       label: 'Subject',          type: 'text',     required: true  },
  { key: 'topic',         label: 'Topic',            type: 'text'                      },
  { key: 'description',   label: 'Description',      type: 'textarea'                  },
  { key: 'cover_image',   label: 'Cover Image',      type: 'url'                       },
  { key: 'resource_type', label: 'Resource Type',    type: 'select',
    options: [
      { label: 'PDF',     value: 'pdf'   },
      { label: 'Video',   value: 'video' },
      { label: 'Link',    value: 'link'  },
      { label: 'Doc',     value: 'doc'   },
    ]
  },
  { key: 'resource_link', label: 'Resource Link',    type: 'url'                       },
  { key: 'download_link', label: 'Download Link',    type: 'url'                       },
  { key: 'file_size',     label: 'File Size',        type: 'text',     helpText: 'e.g. 200kb' },
  { key: 'is_premium',    label: 'Is Premium',       type: 'checkbox', helpText: 'true/false' },
  { key: 'featured',      label: 'Featured',         type: 'checkbox', helpText: 'true/false' },
  { key: 'published',     label: 'Published',        type: 'checkbox', helpText: 'true/false' },
  { key: 'view_count',    label: 'View Count',       type: 'number'                    },
  { key: 'sort_order',    label: 'Sort Order',       type: 'number'                    },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Blogs ─────────────────────────────────────────────────────────────────────
export const blogsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'slug',          label: 'Slug',             type: 'text',     required: true  },
  { key: 'summary',       label: 'Summary',          type: 'textarea'                  },
  { key: 'content',       label: 'Content',          type: 'textarea'                  },
  { key: 'cover_url',     label: 'Cover URL',        type: 'url'                       },
  { key: 'author',        label: 'Author',           type: 'text'                      },
  { key: 'tags',          label: 'Tags',             type: 'tags',     helpText: 'Comma-separated' },
  { key: 'is_featured',   label: 'Is Featured',      type: 'checkbox', helpText: 'true/false' },
  { key: 'published',     label: 'Published',        type: 'checkbox', helpText: 'true/false' },
  { key: 'view_count',    label: 'View Count',       type: 'number'                    },
  { key: 'author_id',     label: 'Author ID',        type: 'text',     helpText: 'User UUID' },
];

// ── Quizzes ───────────────────────────────────────────────────────────────────
export const quizzesBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'slug',          label: 'Slug',             type: 'text',     required: true  },
  { key: 'description',   label: 'Description',      type: 'textarea'                  },
  { key: 'category',      label: 'Category',         type: 'text'                      },
  { key: 'difficulty',    label: 'Difficulty',       type: 'select',
    options: [
      { label: 'Easy',    value: 'easy'   },
      { label: 'Medium',  value: 'medium' },
      { label: 'Hard',    value: 'hard'   },
    ]
  },
  { key: 'cover_url',     label: 'Cover URL',        type: 'url'                       },
  { key: 'time_limit',    label: 'Time Limit',       type: 'number',   helpText: 'In minutes' },
  { key: 'published',     label: 'Published',        type: 'checkbox', helpText: 'true/false' },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Announcements ─────────────────────────────────────────────────────────────
export const announcementsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'message',       label: 'Message',          type: 'textarea', required: true  },
  { key: 'type',          label: 'Type',             type: 'select',
    options: [
      { label: 'Info',    value: 'info'    },
      { label: 'Warning', value: 'warning' },
      { label: 'Success', value: 'success' },
      { label: 'Error',   value: 'error'   },
    ]
  },
  { key: 'link',          label: 'Link',             type: 'url'                       },
  { key: 'link_text',     label: 'Link Text',        type: 'text'                      },
  { key: 'priority',      label: 'Priority',         type: 'number',   helpText: 'Higher = shown first' },
  { key: 'is_active',     label: 'Is Active',        type: 'checkbox', helpText: 'true/false' },
  { key: 'published_at',  label: 'Published At',     type: 'date'                      },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'body',          label: 'Body',             type: 'textarea', required: true  },
  { key: 'type',          label: 'Type',             type: 'select',
    options: [
      { label: 'Info',    value: 'info'    },
      { label: 'Warning', value: 'warning' },
      { label: 'Success', value: 'success' },
    ]
  },
  { key: 'target_url',    label: 'Target URL',       type: 'url'                       },
  { key: 'icon_url',      label: 'Icon URL',         type: 'url'                       },
  { key: 'is_active',     label: 'Is Active',        type: 'checkbox', helpText: 'true/false' },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'slug',          label: 'Slug',             type: 'text',     required: true  },
  { key: 'summary',       label: 'Summary',          type: 'text'                      },
  { key: 'description',   label: 'Description',      type: 'textarea'                  },
  { key: 'image_url',     label: 'Image URL',        type: 'url'                       },
  { key: 'tech_stack',    label: 'Tech Stack',       type: 'tags',     helpText: 'Comma-separated, e.g. HTML,CSS,JavaScript' },
  { key: 'link',          label: 'Link',             type: 'url'                       },
  { key: 'github_url',    label: 'GitHub URL',       type: 'url'                       },
  { key: 'featured',      label: 'Featured',         type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order',    label: 'Sort Order',       type: 'number'                    },
  { key: 'status',        label: 'Status',           type: 'select',
    options: [
      { label: 'Published',   value: 'published'   },
      { label: 'Draft',       value: 'draft'       },
      { label: 'Archived',    value: 'archived'    },
    ]
  },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',          label: 'Name',             type: 'text',     required: true  },
  { key: 'role',          label: 'Role',             type: 'text',     helpText: 'e.g. Movie Enthusiast' },
  { key: 'avatar_url',    label: 'Avatar URL',       type: 'url'                       },
  { key: 'emoji',         label: 'Emoji',            type: 'text',     helpText: 'e.g. 👨‍💻' },
  { key: 'rating',        label: 'Rating',           type: 'number',   required: true, helpText: '1–5' },
  { key: 'text',          label: 'Review Text',      type: 'textarea', required: true  },
  { key: 'featured',      label: 'Featured',         type: 'checkbox', helpText: 'true/false' },
  { key: 'published',     label: 'Published',        type: 'checkbox', helpText: 'true/false' },
  { key: 'sort_order',    label: 'Sort Order',       type: 'number'                    },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Partners ──────────────────────────────────────────────────────────────────
export const partnersBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',          label: 'Name',             type: 'text',     required: true  },
  { key: 'logo_url',      label: 'Logo URL',         type: 'url'                       },
  { key: 'emoji',         label: 'Emoji',            type: 'text'                      },
  { key: 'website_url',   label: 'Website URL',      type: 'url'                       },
  { key: 'sort_order',    label: 'Sort Order',       type: 'number'                    },
  { key: 'active',        label: 'Active',           type: 'checkbox', helpText: 'true/false' },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Certifications ────────────────────────────────────────────────────────────
export const certificationsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',         label: 'Title',            type: 'text',     required: true  },
  { key: 'subtitle',      label: 'Subtitle',         type: 'text'                      },
  { key: 'emoji',         label: 'Emoji',            type: 'text',     helpText: 'e.g. 🔐' },
  { key: 'color_from',    label: 'Color From',       type: 'text',     helpText: 'Hex e.g. #7c3aed' },
  { key: 'color_to',      label: 'Color To',         type: 'text',     helpText: 'Hex e.g. #6d28d9' },
  { key: 'sort_order',    label: 'Sort Order',       type: 'number'                    },
  { key: 'active',        label: 'Active',           type: 'checkbox', helpText: 'true/false' },
  { key: 'created_by',    label: 'Created By',       type: 'text',     helpText: 'User UUID' },
];

// ── Contacts (read-only — but exportable) ─────────────────────────────────────
export const contactsBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',          label: 'Name',             type: 'text',     required: true  },
  { key: 'email',         label: 'Email',            type: 'email',    required: true  },
  { key: 'subject',       label: 'Subject',          type: 'text'                      },
  { key: 'message',       label: 'Message',          type: 'textarea'                  },
  { key: 'is_read',       label: 'Is Read',          type: 'checkbox', helpText: 'true/false' },
];