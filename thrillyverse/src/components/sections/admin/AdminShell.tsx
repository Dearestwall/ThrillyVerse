'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Download,
  Plus,
  Search,
  Upload,
  X,
  FileJson,
  FileSpreadsheet,
  ClipboardPaste,
  FileUp,
} from 'lucide-react';
import * as XLSX from 'xlsx';

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

type Props<T extends Record<string, any>> = {
  title: string;
  initialData?: T[] | null;
  columns: AdminColumn<T>[];
  searchKeys?: (keyof T | string)[];
  exportFields?: (keyof T | string)[];
  renderForm: (item: T | null, onClose: () => void, onSaved: () => void) => React.ReactNode;
  extraActions?: (row: T) => React.ReactNode;
  onBulkUpload?: (rows: Record<string, string>[]) => Promise<void>;
  getRowId?: (row: T) => string;
  addLabel?: string;
  stats?: AdminStat<T>[];
};

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

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

  return lines
    .map((line, index) => ({ line, index }))
    .slice(1)
    .map(({ line }) => {
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
    ...rows.map((row) => headers.map((header) => escapeCell(row?.[header])).join(',')),
  ].join('\n');
}

function getStatValue<T>(stat: AdminStat<T>, rows: T[]) {
  return typeof stat.value === 'function' ? stat.value(rows) : stat.value;
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
  stats = [],
}: Props<T>) {
  const normalizedInitialData = useMemo(() => ensureArray(initialData), [initialData]);

  const [rows, setRows] = useState<T[]>(normalizedInitialData);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFormat, setBulkFormat] = useState<'csv' | 'json' | 'xlsx' | 'paste'>('csv');
  const [pasteValue, setPasteValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkInfo, setBulkInfo] = useState('');

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setRows(ensureArray(initialData));
  }, [initialData]);

  const safeRows = useMemo(() => ensureArray(rows), [rows]);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return safeRows;
    const q = query.toLowerCase();

    return safeRows.filter((row) =>
      searchKeys.some((key) => String(row?.[String(key)] ?? '').toLowerCase().includes(q)),
    );
  }, [safeRows, query, searchKeys]);

  const hasRows = safeRows.length > 0;

  const handleSaved = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    window.location.reload();
  };

  const exportCsv = () => {
    if (!hasRows) return;

    const fields = exportFields.length
      ? exportFields.map(String)
      : Object.keys(safeRows[0] ?? {});

    const mapped = safeRows.map((row) => {
      const entry: Record<string, any> = {};
      fields.forEach((field) => {
        entry[field] = row?.[field];
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
  };

  const templateFields = exportFields.length
    ? exportFields.map(String)
    : Object.keys(normalizedInitialData[0] ?? { title: '', published: '' });

  const downloadTemplate = (format: 'csv' | 'json' | 'xlsx') => {
    const sampleRow = Object.fromEntries(templateFields.map((field) => [field, '']));

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet([sampleRow]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}-template.xlsx`);
      return;
    }

    const content =
      format === 'csv' ? toCsv([sampleRow]) : JSON.stringify([sampleRow], null, 2);

    const type =
      format === 'csv'
        ? 'text/csv;charset=utf-8;'
        : 'application/json;charset=utf-8;';

    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-template.${format}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const runBulkUpload = async (parsed: Record<string, string>[]) => {
    if (!onBulkUpload) return;

    if (!parsed.length) {
      setBulkError('No valid rows were found in the uploaded content.');
      return;
    }

    setIsUploading(true);
    setBulkError('');
    setBulkInfo('');

    try {
      await onBulkUpload(parsed);
      setBulkInfo(`Imported ${parsed.length} row${parsed.length > 1 ? 's' : ''} successfully.`);
      setTimeout(() => {
        setIsBulkModalOpen(false);
        setPasteValue('');
        window.location.reload();
      }, 700);
    } catch (error) {
      setBulkError(error instanceof Error ? error.message : 'Bulk upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setBulkError('');
    setBulkInfo('');

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames?.[0];
        if (!firstSheetName) {
          setBulkError('The uploaded Excel file has no worksheet.');
          return;
        }

        const firstSheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: '' });

        const parsed = json.map((row) =>
          Object.fromEntries(Object.entries(row ?? {}).map(([k, v]) => [k, String(v ?? '')])),
        );

        await runBulkUpload(parsed);
        return;
      }

      const text = await file.text();

      if (file.name.endsWith('.json')) {
        await runBulkUpload(parseJson(text));
        return;
      }

      await runBulkUpload(parseCsv(text));
    } catch (error) {
      setBulkError(error instanceof Error ? error.message : 'Could not read the uploaded file.');
    }
  };

  const handlePasteImport = async () => {
    if (!pasteValue.trim()) return;

    setBulkError('');
    setBulkInfo('');

    try {
      const parsed = pasteValue.trim().startsWith('[')
        ? parseJson(pasteValue)
        : parseCsv(pasteValue);

      await runBulkUpload(parsed);
    } catch {
      setBulkError('Invalid pasted format. Use CSV with headers or a JSON array.');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (row: T) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const openBulkModal = () => {
    setBulkError('');
    setBulkInfo('');
    setPasteValue('');
    setBulkFormat('csv');
    setIsBulkModalOpen(true);
  };

  return (
    <>
      <section className="admin-shell card">
        {stats.length > 0 && (
          <div className="admin-stats-grid">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`admin-stat-card admin-stat-${stat.tone ?? 'default'}`}
              >
                <span className="admin-stat-label">{stat.label}</span>
                <strong className="admin-stat-value">{getStatValue(stat, safeRows)}</strong>
              </div>
            ))}
          </div>
        )}

        <div className="admin-shell-toolbar admin-shell-toolbar-top">
          <div className="admin-shell-toolbar-stack">
            <div className="admin-shell-headline">
              <h2 className="admin-section-title">{title}</h2>
              <p className="admin-section-subtitle">
                Search, create, update, export, and bulk-manage {title.toLowerCase()}.
              </p>
            </div>

            <div className="admin-shell-search">
              <Search size={16} />
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
              <button type="button" className="btn btn-secondary" onClick={openBulkModal}>
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

            <button type="button" className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={14} />
              {addLabel ?? `Add ${title.endsWith('s') ? title.slice(0, -1) : title}`}
            </button>
          </div>
        </div>

        <div className="admin-table-section">
          <div className="table-wrapper admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`${column.className ?? ''} ${column.mobileHidden ? 'hide-mobile' : ''}`.trim()}
                    >
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
                        <td
                          key={String(column.key)}
                          className={`${column.className ?? ''} ${column.mobileHidden ? 'hide-mobile' : ''}`.trim()}
                        >
                          {column.render ? column.render(row) : String(row?.[String(column.key)] ?? '—')}
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
                      <div className="empty-inline">No {title.toLowerCase()} found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
                Download a template, upload CSV, JSON, Excel, or paste rows directly in the expected format.
              </p>
            </div>

            <div className="bulk-modal-grid-vertical">
              <aside className="bulk-sidebar">
                <button
                  type="button"
                  className={`bulk-nav-item ${bulkFormat === 'csv' ? 'is-active' : ''}`}
                  onClick={() => setBulkFormat('csv')}
                >
                  <FileSpreadsheet size={16} />
                  <div>
                    <span>CSV Upload</span>
                    <small>Comma-separated rows</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`bulk-nav-item ${bulkFormat === 'json' ? 'is-active' : ''}`}
                  onClick={() => setBulkFormat('json')}
                >
                  <FileJson size={16} />
                  <div>
                    <span>JSON Upload</span>
                    <small>Array of objects</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`bulk-nav-item ${bulkFormat === 'xlsx' ? 'is-active' : ''}`}
                  onClick={() => setBulkFormat('xlsx')}
                >
                  <FileUp size={16} />
                  <div>
                    <span>Excel Upload</span>
                    <small>.xlsx or .xls sheet</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`bulk-nav-item ${bulkFormat === 'paste' ? 'is-active' : ''}`}
                  onClick={() => setBulkFormat('paste')}
                >
                  <ClipboardPaste size={16} />
                  <div>
                    <span>Paste Data</span>
                    <small>CSV or JSON text</small>
                  </div>
                </button>
              </aside>

              <div className="bulk-main-panel">
                <div className="bulk-card">
                  <h3 className="bulk-card-title">Template</h3>
                  <p className="bulk-card-text">
                    Download a ready-made template with the correct field order for {title.toLowerCase()}.
                  </p>

                  <div className="bulk-card-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('csv')}>
                      Download CSV Template
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('json')}>
                      Download JSON Template
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('xlsx')}>
                      Download Excel Template
                    </button>
                  </div>

                  <div className="bulk-fields-preview">
                    <span className="bulk-fields-label">Expected fields</span>
                    <div className="bulk-chip-wrap">
                      {templateFields.map((field) => (
                        <span key={field} className="bulk-chip">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bulk-card">
                  <h3 className="bulk-card-title">
                    {bulkFormat === 'paste'
                      ? 'Paste Content'
                      : bulkFormat === 'xlsx'
                        ? 'Upload Excel Sheet'
                        : bulkFormat === 'json'
                          ? 'Upload JSON File'
                          : 'Upload CSV File'}
                  </h3>

                  {(bulkFormat === 'csv' || bulkFormat === 'json' || bulkFormat === 'xlsx') && (
                    <>
                      <p className="bulk-card-text">
                        {bulkFormat === 'xlsx'
                          ? 'Upload a spreadsheet directly. The first worksheet will be read automatically.'
                          : `Upload ${bulkFormat.toUpperCase()} content that matches the template fields.`}
                      </p>

                      <input
                        ref={fileRef}
                        type="file"
                        hidden
                        accept={
                          bulkFormat === 'json'
                            ? '.json'
                            : bulkFormat === 'xlsx'
                              ? '.xlsx,.xls'
                              : '.csv,.txt'
                        }
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
                        {isUploading
                          ? 'Uploading...'
                          : bulkFormat === 'xlsx'
                            ? 'Upload Excel File'
                            : `Upload ${bulkFormat.toUpperCase()}`}
                      </button>
                    </>
                  )}

                  {bulkFormat === 'paste' && (
                    <>
                      <p className="bulk-card-text">
                        Paste CSV with headers or a JSON array of objects below, then import it directly.
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

                  {bulkInfo ? <p className="bulk-status success">{bulkInfo}</p> : null}
                  {bulkError ? <p className="bulk-status error">{bulkError}</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}