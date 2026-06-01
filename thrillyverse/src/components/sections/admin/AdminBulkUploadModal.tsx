'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ClipboardPaste,
  Download,
  FileJson,
  FileSpreadsheet,
  FileUp,
  Upload,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';

type BulkFormat = 'csv' | 'json' | 'xlsx' | 'paste';

export type AdminBulkTemplateField = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'checkbox' | 'url' | 'email' | 'date' | 'select' | 'tags';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
};

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  templateFields: string[] | AdminBulkTemplateField[];
  onBulkUpload: (rows: Record<string, string>[]) => Promise<void>;
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

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());

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
      if (Array.isArray(value)) {
        mapped[key] = value.map((v) => String(v ?? '').trim()).filter(Boolean).join(', ');
      } else if (value && typeof value === 'object') {
        mapped[key] = JSON.stringify(value);
      } else {
        mapped[key] = String(value ?? '');
      }
    });
    return mapped;
  });
}

function toCsv(rows: Record<string, unknown>[]): string {
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
    ...rows.map((row) => headers.map((h) => escapeCell(row?.[h])).join(',')),
  ].join('\n');
}

function normalizeTemplateFields(
  templateFields: string[] | AdminBulkTemplateField[]
): AdminBulkTemplateField[] {
  if (!templateFields.length) return [];
  const first = templateFields[0];
  if (typeof first === 'string') {
    return (templateFields as string[]).map((field) => ({
      key: field,
      label: field.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
      type: 'text',
    }));
  }
  return templateFields as AdminBulkTemplateField[];
}

function normalizeRowKeys(
  rows: Record<string, string>[],
  templateFields: AdminBulkTemplateField[]
): Record<string, string>[] {
  const fieldMap = new Map<string, string>();
  templateFields.forEach((field) => {
    fieldMap.set(field.key.toLowerCase().trim(), field.key);
    fieldMap.set(field.label.toLowerCase().trim(), field.key);
  });

  return rows.map((row) => {
    const normalized: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      const cleanKey = key.toLowerCase().trim();
      const matchedField = fieldMap.get(cleanKey) ?? key.trim();
      normalized[matchedField] = String(value ?? '').trim();
    });
    templateFields.forEach((field) => {
      if (!(field.key in normalized)) normalized[field.key] = '';
    });
    return normalized;
  });
}

// FIXED: only enforce required fields — extra/unknown columns are silently ignored
function validateHeaders(
  rows: Record<string, string>[],
  templateFields: AdminBulkTemplateField[]
) {
  if (!rows.length) return;

  const rowKeys = Object.keys(rows[0] ?? {}).map((k) => k.trim().toLowerCase());

  const requiredFields = templateFields.filter((f) => f.required);
  const missingRequired = requiredFields.filter((field) => {
    const key   = field.key.trim().toLowerCase();
    const label = field.label.trim().toLowerCase();
    return !rowKeys.includes(key) && !rowKeys.includes(label);
  });

  if (missingRequired.length) {
    throw new Error(
      `Missing required columns: ${missingRequired.map((f) => f.label).join(', ')}`
    );
  }
}

export default function AdminBulkUploadModal({
  title,
  open,
  onClose,
  templateFields,
  onBulkUpload,
}: Props) {
  const [bulkFormat, setBulkFormat] = useState<BulkFormat>('csv');
  const [pasteValue, setPasteValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkInfo, setBulkInfo] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const singularTitle = useMemo(
    () => (title.endsWith('s') ? title.slice(0, -1) : title),
    [title]
  );

  const normalizedTemplateFields = useMemo(
    () => normalizeTemplateFields(templateFields),
    [templateFields]
  );

  if (!open) return null;

  const downloadTemplate = (format: 'csv' | 'json' | 'xlsx') => {
    // Build a richer sample row with placeholder hints
    const sampleRow = Object.fromEntries(
      normalizedTemplateFields.map((field) => [
        field.key,
        field.helpText ?? field.placeholder ?? '',
      ])
    );

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet([sampleRow]);
      const workbook  = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}-template.xlsx`);
      return;
    }

    const content =
      format === 'csv' ? toCsv([sampleRow]) : JSON.stringify([sampleRow], null, 2);
    const type =
      format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([content], { type });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-template.${format}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const runBulkUpload = async (rawRows: Record<string, string>[]) => {
    if (!rawRows.length) {
      setBulkError('No valid rows were found in the uploaded content.');
      return;
    }

    setIsUploading(true);
    setBulkError('');
    setBulkInfo('');

    try {
      validateHeaders(rawRows, normalizedTemplateFields);
      const rows = normalizeRowKeys(rawRows, normalizedTemplateFields);
      await onBulkUpload(rows);
      setBulkInfo(`Imported ${rows.length} row${rows.length > 1 ? 's' : ''} successfully.`);
      setTimeout(() => {
        setPasteValue('');
        onClose();
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
    // Reset so the same file can be re-selected
    if (fileRef.current) fileRef.current.value = '';

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer        = await file.arrayBuffer();
        const workbook      = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames?.[0];
        if (!firstSheetName) {
          setBulkError('The uploaded Excel file has no worksheet.');
          return;
        }
        const firstSheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
          defval: '',
        });
        const parsed = json.map((row) =>
          Object.fromEntries(
            Object.entries(row ?? {}).map(([k, v]) => {
              if (Array.isArray(v)) return [k, v.join(', ')];
              if (v && typeof v === 'object') return [k, JSON.stringify(v)];
              return [k, String(v ?? '')];
            })
          )
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
      setBulkError(
        error instanceof Error ? error.message : 'Could not read the uploaded file.'
      );
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

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-modal-title"
    >
      <div className="admin-modal-panel admin-bulk-modal-panel">
        <button
          type="button"
          className="admin-modal-close"
          onClick={onClose}
          aria-label="Close bulk upload"
        >
          <X size={16} />
        </button>

        <div className="bulk-modal-header">
          <div>
            <p className="bulk-eyebrow">Bulk import workspace</p>
            <h2 className="modal-title" id="bulk-modal-title">
              Bulk Upload {title}
            </h2>
            <p className="admin-page-subtitle">
              Import multiple {singularTitle.toLowerCase()} records from CSV,
              JSON, Excel, or pasted structured data.
            </p>
          </div>
        </div>

        <div className="bulk-layout">
          {/* ── Format switcher ── */}
          <aside className="bulk-sidebar">
            {(
              [
                {
                  id: 'csv',
                  icon: <FileSpreadsheet size={16} />,
                  label: 'CSV Upload',
                  hint: 'Comma-separated rows',
                },
                {
                  id: 'json',
                  icon: <FileJson size={16} />,
                  label: 'JSON Upload',
                  hint: 'Array of objects',
                },
                {
                  id: 'xlsx',
                  icon: <FileUp size={16} />,
                  label: 'Excel Upload',
                  hint: 'First sheet is imported',
                },
                {
                  id: 'paste',
                  icon: <ClipboardPaste size={16} />,
                  label: 'Paste Data',
                  hint: 'CSV headers or JSON array',
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`bulk-nav-item${bulkFormat === item.id ? ' is-active' : ''}`}
                onClick={() => setBulkFormat(item.id)}
              >
                {item.icon}
                <div>
                  <span>{item.label}</span>
                  <small>{item.hint}</small>
                </div>
              </button>
            ))}
          </aside>

          <div className="bulk-main">
            {/* ── Template download ── */}
            <section className="bulk-card">
              <div className="bulk-card-head">
                <h3 className="bulk-card-title">Template files</h3>
                <p className="bulk-card-text">
                  Download a clean template with the expected field order
                  before importing.
                </p>
              </div>

              <div className="bulk-card-actions">
                {(['csv', 'json', 'xlsx'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => downloadTemplate(fmt)}
                  >
                    <Download size={14} />
                    {fmt === 'xlsx' ? 'Excel' : fmt.toUpperCase()} Template
                  </button>
                ))}
              </div>

              <div className="bulk-fields-preview">
                <span className="bulk-fields-label">Expected fields</span>
                <div className="bulk-chip-wrap">
                  {normalizedTemplateFields.map((field) => (
                    <span
                      key={field.key}
                      className={`bulk-chip${field.required ? ' is-required' : ''}`}
                      title={field.helpText}
                    >
                      {field.label}
                      {field.required ? ' *' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Upload / paste section ── */}
            <section className="bulk-card">
              <div className="bulk-card-head">
                <h3 className="bulk-card-title">
                  {bulkFormat === 'paste'
                    ? 'Paste structured data'
                    : bulkFormat === 'xlsx'
                      ? 'Upload Excel workbook'
                      : bulkFormat === 'json'
                        ? 'Upload JSON file'
                        : 'Upload CSV file'}
                </h3>
                <p className="bulk-card-text">
                  {bulkFormat === 'paste'
                    ? 'Paste CSV with headers or a JSON array.'
                    : bulkFormat === 'xlsx'
                      ? 'Upload an Excel file. The first worksheet will be parsed automatically.'
                      : `Upload a ${bulkFormat.toUpperCase()} file that matches the template fields.`}
                </p>
              </div>

              {(bulkFormat === 'csv' ||
                bulkFormat === 'json' ||
                bulkFormat === 'xlsx') && (
                <>
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
                    <Upload size={14} />
                    {isUploading
                      ? 'Uploading…'
                      : bulkFormat === 'xlsx'
                        ? 'Choose Excel File'
                        : `Choose ${bulkFormat.toUpperCase()} File`}
                  </button>
                </>
              )}

              {bulkFormat === 'paste' && (
                <>
                  <textarea
                    className="form-input bulk-paste-area"
                    placeholder={`Example CSV:\n${normalizedTemplateFields
                      .map((f) => f.key)
                      .join(',')}\n\nOr paste JSON array here…`}
                    value={pasteValue}
                    onChange={(e) => setPasteValue(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasteImport}
                    disabled={isUploading || !pasteValue.trim()}
                  >
                    <Upload size={14} />
                    {isUploading ? 'Importing…' : 'Import Pasted Data'}
                  </button>
                </>
              )}

              {bulkInfo && <p className="bulk-status success">{bulkInfo}</p>}
              {bulkError && <p className="bulk-status error">{bulkError}</p>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}