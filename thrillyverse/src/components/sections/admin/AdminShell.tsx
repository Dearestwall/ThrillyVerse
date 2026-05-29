'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Plus, Search, Upload, X, FileJson, FileSpreadsheet, ClipboardPaste } from 'lucide-react';
import * as XLSX from 'xlsx';
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
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    return row;
  });
}

function parseJson(text: string): Record<string, string>[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const mapped: Record<string, string> = {};
    Object.entries(row ?? {}).forEach(([key, value]) => {
      mapped[key] = String(value ?? '');
    });
    return mapped;
  });
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

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(',')),
  ].join('\n');
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
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFormat, setBulkFormat] = useState<'csv' | 'json' | 'paste'>('csv');
  const [pasteValue, setPasteValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const handleSaved = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    window.location.reload();
  };

  const exportCsv = () => {
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
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  const templateFields =
    exportFields.length ? exportFields.map(String) : Object.keys(initialData[0] ?? { title: '', published: '' });

  const downloadTemplate = (format: 'csv' | 'json') => {
    const sampleRow = Object.fromEntries(templateFields.map((field) => [field, '']));
    const content =
      format === 'csv'
        ? toCsv([sampleRow])
        : JSON.stringify([sampleRow], null, 2);

    const type = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-template.${format}`;
    a.click();
  };

  const runBulkUpload = async (parsed: Record<string, string>[]) => {
    if (!onBulkUpload) return;
    setIsUploading(true);
    try {
      await onBulkUpload(parsed);
      setIsBulkModalOpen(false);
      setPasteValue('');
      window.location.reload();
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const text = await file.text();
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: '' });
  const parsed = json.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, String(v ?? '')]))
  );
  await runBulkUpload(parsed);
  return;
}
    await runBulkUpload(parseCsv(text));
  };

  const handlePasteImport = async () => {
    if (!pasteValue.trim()) return;

    try {
      const parsed = pasteValue.trim().startsWith('[')
        ? parseJson(pasteValue)
        : parseCsv(pasteValue);
      await runBulkUpload(parsed);
    } catch {
      alert('Invalid pasted format. Use CSV with headers or JSON array.');
    }
  };

  return (
    <section className="admin-shell card">
      <div className="admin-shell-toolbar admin-shell-toolbar-top">
        <div className="admin-shell-toolbar-stack">
          <div className="admin-shell-headline">
            <h2 className="admin-section-title">{title}</h2>
            <p className="admin-section-subtitle">
              Search, create, update, export, and bulk-manage {title.toLowerCase()}.
            </p>
          </div>

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
            <button type="button" className="btn btn-secondary" onClick={() => setIsBulkModalOpen(true)}>
              <Upload size={14} />
              Bulk Upload
            </button>
          )}

          <button type="button" className="btn btn-secondary" onClick={exportCsv} disabled={!rows.length}>
            <Download size={14} />
            Export
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          >
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
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setEditingItem(row);
                          setIsModalOpen(true);
                        }}
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

      {isBulkModalOpen && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-panel bulk-modal-panel">
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setIsBulkModalOpen(false)}
              aria-label="Close bulk upload"
            >
              <X size={16} />
            </button>

            <div className="bulk-modal-header">
              <h2 className="modal-title">Bulk Upload {title}</h2>
              <p className="admin-page-subtitle">
                Download a template, upload CSV or JSON, or paste rows directly.
              </p>
            </div>

            <div className="bulk-format-tabs">
              <button
                type="button"
                className={`bulk-tab ${bulkFormat === 'csv' ? 'is-active' : ''}`}
                onClick={() => setBulkFormat('csv')}
              >
                <FileSpreadsheet size={14} />
                CSV
              </button>
              <button
                type="button"
                className={`bulk-tab ${bulkFormat === 'json' ? 'is-active' : ''}`}
                onClick={() => setBulkFormat('json')}
              >
                <FileJson size={14} />
                JSON
              </button>
              <button
                type="button"
                className={`bulk-tab ${bulkFormat === 'paste' ? 'is-active' : ''}`}
                onClick={() => setBulkFormat('paste')}
              >
                <ClipboardPaste size={14} />
                Paste
              </button>
            </div>

            <div className="bulk-modal-grid">
              <div className="bulk-card">
                <h3 className="bulk-card-title">Template</h3>
                <p className="bulk-card-text">
                  Download a starter file with the required headers for {title.toLowerCase()}.
                </p>

                <div className="bulk-card-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('csv')}>
                    Download CSV Template
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('json')}>
                    Download JSON Template
                  </button>
                </div>

                <div className="bulk-fields-preview">
                  <span className="bulk-fields-label">Expected fields</span>
                  <div className="bulk-chip-wrap">
                    {templateFields.map((field) => (
                      <span key={field} className="bulk-chip">{field}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bulk-card">
                <h3 className="bulk-card-title">Import</h3>

                {(bulkFormat === 'csv' || bulkFormat === 'json') && (
                  <>
                    <p className="bulk-card-text">
                      Upload {bulkFormat.toUpperCase()} files. Excel users can save sheets as CSV before upload.
                    </p>

                    <input
                      ref={fileRef}
                      type="file"
                      hidden
                      accept={bulkFormat === 'json' ? '.json' : '.csv,.txt'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleFileUpload(file);
                      }}
                    />

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => fileRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : `Upload ${bulkFormat.toUpperCase()}`}
                    </button>
                  </>
                )}

                {bulkFormat === 'paste' && (
                  <>
                    <p className="bulk-card-text">
                      Paste CSV with headers or a JSON array of objects directly below.
                    </p>

                    <textarea
                      className="form-input bulk-paste-area"
                      placeholder={`Example CSV:\n${templateFields.join(',')}\n\nOr paste JSON array here...`}
                      value={pasteValue}
                      onChange={(e) => setPasteValue(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePasteImport}
                      disabled={isUploading || !pasteValue.trim()}
                    >
                      {isUploading ? 'Importing...' : 'Import Pasted Data'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}