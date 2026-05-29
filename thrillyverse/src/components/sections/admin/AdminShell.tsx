'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Plus, Search, Upload, X } from 'lucide-react';

export type AdminColumn<T> = {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends Record<string, any>> = {
  title: string;
  initialData: T[];
  columns: AdminColumn<T>[];
  searchKeys?: (keyof T | string)[];
  exportFields?: (keyof T | string)[];
  renderForm: (item: T | null, onClose: () => void, onSaved: () => void) => React.ReactNode;
  extraActions?: (row: T) => React.ReactNode;
  onBulkUpload?: (rows: Record<string, string>[]) => Promise<void>;
  getRowId?: (row: T) => string;
  addLabel?: string;
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result.map((cell) => cell.replace(/^"(.*)"$/, '$1').trim());
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    rows.push(row);
  }

  return rows;
}

function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);

  const escapeCell = (value: unknown) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(',')),
  ];

  return lines.join('\n');
}

export function AdminShell<T extends Record<string, any>>({
  title,
  initialData,
  columns,
  searchKeys = [],
  exportFields = [],
  renderForm,
  extraActions,
  onBulkUpload,
  getRowId = (row) => String(row.id),
  addLabel,
}: Props<T>) {
  const [rows, setRows] = useState<T[]>(initialData);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();

    return rows.filter((row) =>
      searchKeys.some((key) => String(row[String(key)] ?? '').toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    window.location.reload();
  };

  const handleExport = () => {
    const fields = exportFields.length ? exportFields.map(String) : Object.keys(rows[0] ?? {});
    const mapped = rows.map((row) => {
      const entry: Record<string, any> = {};
      fields.forEach((field) => {
        entry[field] = row[field];
      });
      return entry;
    });

    const csv = toCsv(mapped);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    anchor.click();
  };

  const handleBulkPick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (file: File) => {
    if (!onBulkUpload) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      await onBulkUpload(parsed);
      window.location.reload();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="admin-shell card">
      <div className="admin-shell-toolbar">
        <div className="admin-shell-left">
          <div className="admin-shell-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input"
              placeholder={`Search ${title.toLowerCase()}...`}
              aria-label={`Search ${title}`}
            />
          </div>
        </div>

        <div className="admin-shell-actions">
          {onBulkUpload && (
            <>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFileChange(file);
                }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleBulkPick} disabled={isUploading}>
                <Upload size={14} />
                {isUploading ? 'Uploading...' : 'Bulk Upload'}
              </button>
            </>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={!rows.length}
          >
            <Download size={14} />
            Export
          </button>

          <button type="button" className="btn btn-primary" onClick={handleCreate}>
            <Plus size={14} />
            {addLabel ?? `Add ${title.endsWith('s') ? title.slice(0, -1) : title}`}
          </button>
        </div>
      </div>

      <div className="table-wrapper admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={column.className}>
                  {column.label}
                </th>
              ))}
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <tr key={getRowId(row)}>
                  {columns.map((column) => (
                    <td key={String(column.key)} className={column.className}>
                      {column.render ? column.render(row) : String(row[String(column.key)] ?? '—')}
                    </td>
                  ))}
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleEdit(row)}>
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
                  <div className="empty-inline">No {title.toLowerCase()} found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-panel">
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {renderForm(editingItem, () => setIsModalOpen(false), handleSaved)}
          </div>
        </div>
      )}
    </section>
  );
}