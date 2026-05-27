'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import {
  deleteRowAction,
  toggleAnnouncementActiveAction,
  toggleBlogPublishedAction,
  toggleCertificationActiveAction,
  toggleContactReadAction,
  toggleNotificationActiveAction,
  togglePartnerActiveAction,
  toggleQuizPublishedAction,
  toggleReviewPublishedAction,
} from '@/app/actions/admin';

function TableShell({ children }: { children: React.ReactNode }) {
  return <div className="admin-card overflow-hidden">{children}</div>;
}

function SearchBar({
  value,
  onChange,
  total,
  shown,
}: {
  value: string;
  onChange: (v: string) => void;
  total: number;
  shown: number;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
      <p className="text-xs text-text-muted tabular-nums">
        Showing {shown} of {total}
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="form-input max-w-xs text-sm"
      />
    </div>
  );
}

function StatPills({ items }: { items: { label: string; value: number }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {items.map((s) => (
        <div key={s.label} className="stat-pill">
          <div className="text-[11px] uppercase tracking-[0.15em] text-text-muted">{s.label}</div>
          <div className="font-display text-xl font-bold tabular-nums">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function RowBtn({
  onClick,
  label,
  danger,
  pending,
}: {
  onClick: () => void;
  label: string;
  danger?: boolean;
  pending?: boolean;
}) {
  return (
    <button
      className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-secondary'}`}
      disabled={pending}
      onClick={onClick}
      type="button"
    >
      {pending ? '...' : label}
    </button>
  );
}

export function BlogsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.slug, r.category].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Published', value: initialData.filter((r) => r.published).length },
          { label: 'Featured', value: initialData.filter((r) => r.featured).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Read time</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted truncate max-w-xs">{row.excerpt ?? row.slug}</div>
                </td>
                <td className="text-sm">{row.category ?? '—'}</td>
                <td>
                  <span className={`badge ${row.published ? 'badge-success' : 'badge-muted'}`}>
                    {row.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="text-sm tabular-nums">{row.read_time ?? '—'} min</td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <Link href={`/admin/blogs/${row.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <RowBtn
                      label={row.published ? 'Unpublish' : 'Publish'}
                      onClick={() =>
                        startT(async () => {
                          await toggleBlogPublishedAction(row.id, !row.published);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('blogs', row.id, ['/blogs', '/admin/blogs']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function PartnersAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.name, r.website_url].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Active', value: initialData.filter((r) => r.active).length },
          { label: 'Inactive', value: initialData.filter((r) => !r.active).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Website</th>
              <th>Order</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="logo-circle w-9 h-9 text-lg shrink-0">{row.emoji ?? '🤝'}</div>
                    <div>
                      <div className="font-medium text-sm">{row.name}</div>
                      {row.logo_url && (
                        <div className="text-xs text-text-muted truncate max-w-[160px]">{row.logo_url}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {row.website_url ? (
                    <a
                      href={row.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate block max-w-[160px]"
                    >
                      {row.website_url}
                    </a>
                  ) : (
                    <span className="text-text-muted text-sm">—</span>
                  )}
                </td>
                <td className="text-sm tabular-nums">{row.sort_order}</td>
                <td>
                  <span className={`badge ${row.active ? 'badge-success' : 'badge-muted'}`}>
                    {row.active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.active ? 'Hide' : 'Show'}
                      onClick={() =>
                        startT(async () => {
                          await togglePartnerActiveAction(row.id, !row.active);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('partners', row.id, ['/', '/admin/partners']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function ReviewsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.name, r.role, r.text].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Published', value: initialData.filter((r) => r.published).length },
          { label: 'Featured', value: initialData.filter((r) => r.featured).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="logo-circle w-9 h-9 text-lg shrink-0">{row.emoji ?? '👤'}</div>
                    <div>
                      <div className="font-medium text-sm">{row.name}</div>
                      <div className="text-xs text-text-muted">{row.role ?? '—'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-amber-400">{'⭐'.repeat(row.rating ?? 5)}</span>
                </td>
                <td>
                  <div className="text-xs text-text-muted line-clamp-2 max-w-xs">{row.text}</div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <span className={`badge ${row.published ? 'badge-success' : 'badge-muted'}`}>
                      {row.published ? 'Published' : 'Draft'}
                    </span>
                    {row.featured && <span className="badge bg-amber-500/20 text-amber-500 text-[10px]">⭐ Featured</span>}
                  </div>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.published ? 'Unpublish' : 'Publish'}
                      onClick={() =>
                        startT(async () => {
                          await toggleReviewPublishedAction(row.id, !row.published);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('reviews', row.id, ['/', '/admin/reviews']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function CertificationsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.subtitle].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Active', value: initialData.filter((r) => r.active).length },
          { label: 'Hidden', value: initialData.filter((r) => !r.active).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Badge</th>
              <th>Subtitle</th>
              <th>Colors</th>
              <th>Order</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="logo-circle w-9 h-9 text-lg shrink-0"
                      style={{ background: `linear-gradient(135deg, ${row.color_from}, ${row.color_to})` }}
                    >
                      {row.emoji}
                    </div>
                    <div className="font-medium text-sm">{row.title}</div>
                  </div>
                </td>
                <td className="text-sm text-text-muted">{row.subtitle ?? '—'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full border border-divider inline-block"
                      style={{ background: row.color_from }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-divider inline-block"
                      style={{ background: row.color_to }}
                    />
                    <span className="text-xs text-text-muted">{row.color_from}</span>
                  </div>
                </td>
                <td className="text-sm tabular-nums">{row.sort_order}</td>
                <td>
                  <span className={`badge ${row.active ? 'badge-success' : 'badge-muted'}`}>
                    {row.active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.active ? 'Hide' : 'Show'}
                      onClick={() =>
                        startT(async () => {
                          await toggleCertificationActiveAction(row.id, !row.active);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('certifications', row.id, ['/', '/admin/certifications']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function MoviesAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.slug, r.category].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Published', value: initialData.filter((r) => r.published).length },
          { label: 'Featured', value: initialData.filter((r) => r.featured).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted">{row.language ?? ''}</div>
                </td>
                <td className="text-sm">{row.category ?? '—'}</td>
                <td className="text-sm tabular-nums">{row.year ?? '—'}</td>
                <td>
                  <span className={`badge ${row.published ? 'badge-success' : 'badge-muted'}`}>
                    {row.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <Link href={`/admin/movies/${row.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('movies', row.id, ['/movies', '/admin/movies']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function MaterialsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.subject, r.class_level, r.board].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Published', value: initialData.filter((r) => r.published).length },
          { label: 'Premium', value: initialData.filter((r) => r.is_premium).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Board</th>
              <th>Class</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted">{row.subject}</div>
                </td>
                <td className="text-sm">{row.board ?? '—'}</td>
                <td className="text-sm tabular-nums">{row.class_level ?? '—'}</td>
                <td>
                  <span className={`badge ${row.published ? 'badge-success' : 'badge-muted'}`}>
                    {row.published ? 'Published' : 'Draft'}
                  </span>
                  {row.is_premium && <span className="badge bg-amber-500/20 text-amber-500 ml-1">⭐</span>}
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <Link href={`/admin/materials/${row.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('materials', row.id, ['/materials', '/admin/materials']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function AnnouncementsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.body, r.badge].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Active', value: initialData.filter((r) => r.active).length },
          { label: 'Inactive', value: initialData.filter((r) => !r.active).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Badge</th>
              <th>Priority</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted line-clamp-1 max-w-xs">{row.body ?? '—'}</div>
                </td>
                <td className="text-sm">{row.badge ?? '—'}</td>
                <td className="text-sm tabular-nums">{row.priority ?? 0}</td>
                <td>
                  <span className={`badge ${row.active ? 'badge-success' : 'badge-muted'}`}>
                    {row.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.active ? 'Deactivate' : 'Activate'}
                      onClick={() =>
                        startT(async () => {
                          await toggleAnnouncementActiveAction(row.id, !row.active);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('announcements', row.id, ['/', '/admin/announcements']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function NotificationsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.message, r.type].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Active', value: initialData.filter((r) => r.is_active).length },
          { label: 'Types', value: new Set(initialData.map((r) => r.type)).size },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Audience</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted line-clamp-1 max-w-xs">{row.message}</div>
                </td>
                <td className="text-sm">{row.type ?? 'info'}</td>
                <td className="text-sm">{row.audience ?? 'all'}</td>
                <td>
                  <span className={`badge ${row.is_active ? 'badge-success' : 'badge-muted'}`}>
                    {row.is_active ? 'Active' : 'Off'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.is_active ? 'Deactivate' : 'Activate'}
                      onClick={() =>
                        startT(async () => {
                          await toggleNotificationActiveAction(row.id, !row.is_active);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('notifications', row.id, ['/materials', '/admin/notifications']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function QuizzesAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.subject, r.board, r.class_level].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Published', value: initialData.filter((r) => r.published).length },
          { label: 'Drafts', value: initialData.filter((r) => !r.published).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Board</th>
              <th>Class</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted">{row.subject}</div>
                </td>
                <td className="text-sm">{row.board ?? '—'}</td>
                <td className="text-sm tabular-nums">{row.class_level ?? '—'}</td>
                <td className="text-sm capitalize">{row.difficulty ?? 'medium'}</td>
                <td>
                  <span className={`badge ${row.published ? 'badge-success' : 'badge-muted'}`}>
                    {row.published ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.published ? 'Unpublish' : 'Publish'}
                      onClick={() =>
                        startT(async () => {
                          await toggleQuizPublishedAction(row.id, !row.published);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('quizzes', row.id, ['/materials', '/admin/quizzes']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function ContactsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.name, r.email, r.message].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Read', value: initialData.filter((r) => r.read).length },
          { label: 'Unread', value: initialData.filter((r) => !r.read).length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={`hover-row ${!row.read ? 'font-medium' : ''}`}>
                <td className="text-sm">{row.name}</td>
                <td className="text-sm text-text-muted">{row.email}</td>
                <td>
                  <div className="text-xs text-text-muted line-clamp-2 max-w-xs">{row.message}</div>
                </td>
                <td>
                  <span className={`badge ${row.read ? 'badge-success' : 'badge-warning'}`}>
                    {row.read ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <RowBtn
                      label={row.read ? 'Unread' : 'Mark Read'}
                      onClick={() =>
                        startT(async () => {
                          await toggleContactReadAction(row.id, !row.read);
                        })
                      }
                    />
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('contacts', row.id, ['/admin/contacts']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

export function ProjectsAdminTable({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('');
  const [, startT] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return initialData.filter((r) =>
      [r.title, r.slug, r.summary].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [initialData, query]);

  return (
    <TableShell>
      <StatPills
        items={[
          { label: 'Total', value: initialData.length },
          { label: 'Shown', value: rows.length },
          { label: 'Published', value: initialData.filter((r) => r.status === 'published').length },
          { label: 'Drafts', value: initialData.filter((r) => r.status !== 'published').length },
        ]}
      />
      <SearchBar value={query} onChange={setQuery} total={initialData.length} shown={rows.length} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tech</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover-row">
                <td>
                  <div className="font-medium text-sm">{row.title}</div>
                  <div className="text-xs text-text-muted">{row.summary}</div>
                </td>
                <td className="text-sm">{(row.tech_stack ?? []).slice(0, 3).join(', ')}</td>
                <td>
                  <span className={`badge ${row.status === 'published' ? 'badge-success' : 'badge-muted'}`}>
                    {row.status ?? 'draft'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <Link href={`/admin/projects/${row.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <RowBtn
                      danger
                      label="Delete"
                      onClick={() =>
                        startT(async () => {
                          await deleteRowAction('projects', row.id, ['/', '/admin/projects']);
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}