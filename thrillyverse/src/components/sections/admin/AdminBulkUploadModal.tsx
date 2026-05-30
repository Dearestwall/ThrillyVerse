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

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  templateFields: string[];
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

  if (!open) return null;

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
          Object.fromEntries(Object.entries(row ?? {}).map(([k, v]) => [k, String(v ?? '')]))
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

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="bulk-modal-title">
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
            <h2 className="modal-title" id="bulk-modal-title">Bulk Upload {title}</h2>
            <p className="admin-page-subtitle">
              Import multiple {singularTitle.toLowerCase()} records from CSV, JSON, Excel, or pasted structured data.
            </p>
          </div>
        </div>

        <div className="bulk-layout">
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
                <small>First sheet is imported</small>
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
                <small>CSV headers or JSON array</small>
              </div>
            </button>
          </aside>

          <div className="bulk-main">
            <section className="bulk-card">
              <div className="bulk-card-head">
                <h3 className="bulk-card-title">Template files</h3>
                <p className="bulk-card-text">
                  Download a clean template with the expected field order before importing.
                </p>
              </div>

              <div className="bulk-card-actions">
                <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('csv')}>
                  <Download size={14} />
                  CSV Template
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('json')}>
                  <Download size={14} />
                  JSON Template
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => downloadTemplate('xlsx')}>
                  <Download size={14} />
                  Excel Template
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
            </section>

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

              {(bulkFormat === 'csv' || bulkFormat === 'json' || bulkFormat === 'xlsx') && (
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
                      ? 'Uploading...'
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
                    <Upload size={14} />
                    {isUploading ? 'Importing...' : 'Import Pasted Data'}
                  </button>
                </>
              )}

              {bulkInfo ? <p className="bulk-status success">{bulkInfo}</p> : null}
              {bulkError ? <p className="bulk-status error">{bulkError}</p> : null}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}