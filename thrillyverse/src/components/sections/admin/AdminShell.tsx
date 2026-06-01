'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react';
import AdminBulkUploadModal from './AdminBulkUploadModal';

/* ── Types ────────────────────────────────────────────────── */

export type AdminColumn<T> = {
  key: keyof T | string;
  label: string;
  className?: string;
  mobileHidden?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type AdminStatTone = 'default' | 'success' | 'warning' | 'danger';

export type AdminStat<T> = {
  label: string;
  value: number | string | ((rows: T[]) => number | string);
  tone?: AdminStatTone;
};

export type AdminBulkTemplateField = {
  key: string;
  label: string;
  type?:
    | 'text'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'url'
    | 'email'
    | 'date'
    | 'select'
    | 'tags';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
};

type Props<T extends Record<string, any>> = {
  title: string;
  initialData?: T[] | null;
  columns: AdminColumn<T>[];
  searchKeys?: (keyof T | string)[];
  exportFields?: (keyof T | string)[];
  renderForm: (
    item: T | null,
    onClose: () => void,
    onSaved: () => void
  ) => React.ReactNode;
  extraActions?: (row: T) => React.ReactNode;
  onBulkUpload?: (rows: Record<string, string>[]) => Promise<void>;
  bulkTemplateFields?: AdminBulkTemplateField[];
  getRowId?: (row: T) => string;
  addLabel?: string;
  stats?: AdminStat<T>[];
  hideCreateButton?: boolean;
  emptyMessage?: string;
};

/* ── Helpers ──────────────────────────────────────────────── */

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0] ?? {});

  const escapeCell = (value: unknown) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  return [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => escapeCell(row?.[h])).join(',')
    ),
  ].join('\n');
}

function getStatValue<T>(stat: AdminStat<T>, rows: T[]) {
  return typeof stat.value === 'function' ? stat.value(rows) : stat.value;
}

/* ── Component ────────────────────────────────────────────── */

export function AdminShell<T extends Record<string, any>>({
  title,
  initialData,
  columns,
  searchKeys = [],
  exportFields = [],
  renderForm,
  extraActions,
  onBulkUpload,
  bulkTemplateFields = [],
  getRowId = (row) => String(row.id),
  addLabel,
  stats = [],
  hideCreateButton = false,
  emptyMessage,
}: Props<T>) {
  const router = useRouter();

  const normalizedInitialData = useMemo(
    () => ensureArray(initialData),
    [initialData]
  );

  const [rows, setRows] = useState<T[]>(normalizedInitialData);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  /* Sync rows when server re-fetches (RSC re-render) */
  useEffect(() => {
    setRows(ensureArray(initialData));
  }, [initialData]);

  const safeRows = useMemo(() => ensureArray(rows), [rows]);

  /* ── Search filter ── */
  const filteredRows = useMemo(() => {
    if (!query.trim()) return safeRows;
    const q = query.toLowerCase();
    return safeRows.filter((row) =>
      searchKeys.some((key) =>
        String(row?.[String(key)] ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
  }, [safeRows, query, searchKeys]);

  const hasRows = safeRows.length > 0;

  /* ── Bulk template fields ── */
  const templateFields = useMemo<AdminBulkTemplateField[]>(() => {
    if (bulkTemplateFields.length) return bulkTemplateFields;

    const base =
      exportFields.length > 0
        ? exportFields.map(String)
        : Object.keys(normalizedInitialData[0] ?? { title: '', published: '' });

    return base.map((field) => ({
      key: field,
      label: field
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase()),
      type: 'text' as const,
    }));
  }, [bulkTemplateFields, exportFields, normalizedInitialData]);

  const canBulkUpload = Boolean(onBulkUpload && templateFields.length > 0);

  /* ── Handlers ── */
  const handleSaved = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    // Soft refresh: re-runs RSC data fetch without full page reload
    router.refresh();
  }, [router]);

  const exportCsv = useCallback(() => {
    if (!hasRows) return;

    const fields =
      exportFields.length > 0
        ? exportFields.map(String)
        : Object.keys(safeRows[0] ?? {});

    const mapped = safeRows.map((row) => {
      const entry: Record<string, any> = {};
      fields.forEach((f) => {
        entry[f] = row?.[f];
      });
      return entry;
    });

    const csv = toCsv(mapped);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [hasRows, exportFields, safeRows, title]);

  const openCreateModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((row: T) => {
    setEditingItem(row);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  /* ── Render ── */
  return (
    <>
      <section className="admin-shell-pro card">
        {/* ── Stats ── */}
        {stats.length > 0 && (
          <div className="admin-stats-grid pro-stats-grid">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`admin-stat-card admin-stat-${stat.tone ?? 'default'}`}
              >
                <span className="admin-stat-label">{stat.label}</span>
                <strong className="admin-stat-value">
                  {getStatValue(stat, safeRows)}
                </strong>
              </div>
            ))}
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="admin-toolbar-block">
          <div className="admin-toolbar-head">
            <div className="admin-shell-headline">
              <div className="admin-shell-kicker">
                <SlidersHorizontal size={14} />
                <span>Management Workspace</span>
              </div>
              <h2 className="admin-section-title">{title}</h2>
              <p className="admin-section-subtitle">
                Search, create, update, export, and bulk-manage{' '}
                {title.toLowerCase()} from one workspace.
              </p>
            </div>
          </div>

          <div className="admin-toolbar-controls">
            <div className="admin-toolbar-search-row">
              <label
                className="admin-shell-search"
                aria-label={`Search ${title}`}
              >
                <Search size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="form-input"
                  placeholder={`Search ${title.toLowerCase()}...`}
                />
              </label>
            </div>

            <div className="admin-toolbar-actions-row">
              {canBulkUpload && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsBulkModalOpen(true)}
                >
                  <Upload size={14} />
                  Bulk Upload
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={exportCsv}
                disabled={!hasRows}
              >
                <Download size={14} />
                Export
              </button>

              {!hideCreateButton && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openCreateModal}
                >
                  <Plus size={14} />
                  {addLabel ??
                    `Add ${title.endsWith('s') ? title.slice(0, -1) : title}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="admin-table-section">
          <div className="admin-table-meta-row">
            <p className="admin-table-meta">
              Showing <strong>{filteredRows.length}</strong> of{' '}
              <strong>{safeRows.length}</strong> entries
            </p>
          </div>

          <div className="table-wrapper admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={`${col.className ?? ''} ${
                        col.mobileHidden ? 'hide-mobile' : ''
                      }`.trim()}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length ? (
                  filteredRows.map((row) => (
                    <tr key={getRowId(row)}>
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={`${col.className ?? ''} ${
                            col.mobileHidden ? 'hide-mobile' : ''
                          }`.trim()}
                        >
                          {col.render
                            ? col.render(row)
                            : String(row?.[String(col.key)] ?? '—')}
                        </td>
                      ))}
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEditModal(row)}
                          >
                            Edit
                          </button>
                          {extraActions?.(row)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <div className="empty-inline">
                        {emptyMessage ??
                          `No ${title.toLowerCase()} found.`}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Edit / Create modal ── */}
      {isModalOpen && (
        <div
          className="admin-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${editingItem ? 'Edit' : 'Create'} ${title}`}
        >
          <div className="admin-modal-panel">
            <button
              type="button"
              className="admin-modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {renderForm(editingItem, closeModal, handleSaved)}
          </div>
        </div>
      )}

      {/* ── Bulk upload modal ── */}
      {canBulkUpload && onBulkUpload && (
        <AdminBulkUploadModal
          open={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title={title}
          templateFields={templateFields}
          onBulkUpload={onBulkUpload}
        />
      )}
    </>
  );
}