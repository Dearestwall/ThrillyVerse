'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
// ✅ Single import — only from bulkTypes, never from AdminShell
import type { AdminBulkTemplateField } from '@/lib/admin/bulkTypes';

/* ── Types ── */
type UploadTab = 'csv' | 'json' | 'excel' | 'paste';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  templateFields: AdminBulkTemplateField[];
  onBulkUpload: (rows: Record<string, string>[]) => Promise<void>;
}

type ParseResult =
  | { ok: true; rows: Record<string, string>[] }
  | { ok: false; error: string };

/* ── Key normalization helpers ──────────────────────────────
   This is THE fix: every parsed row — no matter the source
   (CSV header text, JSON object keys, Excel column headers,
   or pasted text) — gets remapped to the EXACT `field.key`
   defined in templateFields. This guarantees the final rows
   sent to onBulkUpload always use consistent, predictable
   keys that match what the Server Action / DB expects.
──────────────────────────────────────────────────────────── */

function normalizeKey(str: string): string {
  return String(str ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildFieldKeyMap(
  fields: AdminBulkTemplateField[]
): Record<string, string> {
  const map: Record<string, string> = {};
  fields.forEach((f) => {
    map[normalizeKey(f.key)] = f.key;
    map[normalizeKey(f.label)] = f.key;
  });
  return map;
}

function remapRowKeys(
  row: Record<string, string>,
  keyMap: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(row).forEach(([rawKey, value]) => {
    const norm = normalizeKey(rawKey);
    const mappedKey = keyMap[norm] ?? rawKey;
    // Don't silently overwrite an already-mapped field with an unmapped extra column
    if (out[mappedKey] === undefined) {
      out[mappedKey] = value;
    }
  });
  return out;
}

function remapRows(
  rows: Record<string, string>[],
  fields: AdminBulkTemplateField[]
): Record<string, string>[] {
  if (!fields.length) return rows;
  const keyMap = buildFieldKeyMap(fields);
  return rows.map((row) => remapRowKeys(row, keyMap));
}

/* ── Parsing helpers ── */

function cleanText(raw: string) {
  return raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function parseCsvText(text: string): string[][] {
  const rows: string[][] = [];
  const lines = cleanText(text).split('\n');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const cells: string[] = [];
    let cur = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuote = false; }
        else { cur += ch; }
      } else if (ch === '"') {
        inQuote = true;
      } else if (ch === ',') {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

function csvToObjects(text: string): ParseResult {
  const grid = parseCsvText(text);
  if (grid.length < 2)
    return { ok: false, error: 'CSV must have a header row and at least one data row.' };

  const headers = grid[0].map((h) => normalizeKey(h));
  const rows = grid.slice(1)
    .filter((cells) => cells.some((c) => c.trim().length > 0))
    .map((cells) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = cells[i] ?? ''; });
      return obj;
    });
  return { ok: true, rows };
}

function jsonToObjects(text: string): ParseResult {
  try {
    const parsed = JSON.parse(text.trim());
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.length === 0)
      return { ok: false, error: 'JSON array is empty.' };
    if (typeof arr[0] !== 'object' || arr[0] === null)
      return { ok: false, error: 'Each JSON element must be an object.' };

    const rows = arr.map((item: Record<string, unknown>) => {
      const obj: Record<string, string> = {};
      Object.entries(item).forEach(([k, v]) => {
        obj[normalizeKey(k)] = v == null ? '' : String(v);
      });
      return obj;
    });
    return { ok: true, rows };
  } catch {
    return { ok: false, error: 'Invalid JSON. Make sure it is a valid JSON array or object.' };
  }
}

function loadXLSX(): Promise<any> {
  if ((window as any).XLSX) return Promise.resolve((window as any).XLSX);
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    s.onload = () => res((window as any).XLSX);
    s.onerror = () => rej(new Error('Failed to load SheetJS'));
    document.head.appendChild(s);
  });
}

async function excelToObjects(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await loadXLSX();
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          resolve({ ok: false, error: 'No sheets found in this Excel file.' });
          return;
        }
        const sheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (!json.length) {
          resolve({ ok: false, error: 'The first sheet is empty.' });
          return;
        }
        const rows = json.map((item) => {
          const obj: Record<string, string> = {};
          Object.entries(item).forEach(([k, v]) => {
            obj[normalizeKey(k)] = v == null ? '' : String(v);
          });
          return obj;
        });
        resolve({ ok: true, rows });
      } catch (err: any) {
        resolve({ ok: false, error: err?.message ?? 'Failed to parse Excel file.' });
      }
    };
    reader.onerror = () => resolve({ ok: false, error: 'Failed to read the file.' });
    reader.readAsArrayBuffer(file);
  });
}

/* ── Template generators (keyed by field.key, header row is human label) ── */

function buildCsvTemplate(fields: AdminBulkTemplateField[]): string {
  const header = fields.map((f) => f.label).join(',');
  const sample = fields.map((f) => {
    if (f.type === 'number') return '0';
    if (f.type === 'checkbox') return 'false';
    if (f.type === 'date') return '2024-01-01';
    if (f.type === 'url') return 'https://example.com';
    if (f.type === 'email') return 'example@email.com';
    if (f.options?.length) return f.options[0]?.value ?? '';
    return f.placeholder ?? `Sample ${f.label}`;
  }).join(',');
  return `${header}\n${sample}`;
}

function buildJsonTemplate(fields: AdminBulkTemplateField[]): string {
  const sample: Record<string, any> = {};
  fields.forEach((f) => {
    if (f.type === 'number') sample[f.key] = 0;
    else if (f.type === 'checkbox') sample[f.key] = false;
    else if (f.type === 'date') sample[f.key] = '2024-01-01';
    else if (f.type === 'url') sample[f.key] = 'https://example.com';
    else if (f.type === 'email') sample[f.key] = 'example@email.com';
    else if (f.options?.length) sample[f.key] = f.options[0]?.value ?? '';
    else sample[f.key] = f.placeholder ?? `Sample ${f.label}`;
  });
  return JSON.stringify([sample], null, 2);
}

async function buildExcelTemplate(fields: AdminBulkTemplateField[]): Promise<Blob> {
  const XLSX = await loadXLSX();
  const sample: Record<string, any> = {};
  fields.forEach((f) => {
    if (f.type === 'number') sample[f.label] = 0;
    else if (f.type === 'checkbox') sample[f.label] = false;
    else if (f.type === 'date') sample[f.label] = '2024-01-01';
    else if (f.options?.length) sample[f.label] = f.options[0]?.value ?? '';
    else sample[f.label] = f.placeholder ?? `Sample ${f.label}`;
  });
  const ws = XLSX.utils.json_to_sheet([sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Import');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadText(text: string, filename: string, mime = 'text/plain') {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

/* ── Tab config ── */
const TABS: { id: UploadTab; label: string; icon: React.ElementType; hint: string }[] = [
  { id: 'csv',   label: 'CSV Upload',   icon: FileText,        hint: 'Comma-separated rows' },
  { id: 'json',  label: 'JSON Upload',  icon: FileJson,        hint: 'Array of objects' },
  { id: 'excel', label: 'Excel Upload', icon: FileSpreadsheet, hint: 'First sheet is imported' },
  { id: 'paste', label: 'Paste Data',   icon: ClipboardPaste,  hint: 'CSV headers or JSON array' },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
export default function AdminBulkUploadModal({
  open,
  onClose,
  title,
  templateFields,
  onBulkUpload,
}: Props) {
  const [activeTab, setActiveTab]         = useState<UploadTab>('csv');
  const [csvFile, setCsvFile]             = useState<File | null>(null);
  const [jsonFile, setJsonFile]           = useState<File | null>(null);
  const [excelFile, setExcelFile]         = useState<File | null>(null);
  const [pasteText, setPasteText]         = useState('');
  const [preview, setPreview]             = useState<Record<string, string>[] | null>(null);
  const [parseError, setParseError]       = useState<string | null>(null);
  const [uploading, setUploading]         = useState(false);
  const [done, setDone]                   = useState(false);
  const [uploadError, setUploadError]     = useState<string | null>(null);
  const [xlsxLoading, setXlsxLoading]     = useState(false);

  const csvInputRef   = useRef<HTMLInputElement>(null);
  const jsonInputRef  = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  /* Reset on open or tab change */
  useEffect(() => {
    if (!open) return;
    setCsvFile(null);
    setJsonFile(null);
    setExcelFile(null);
    setPasteText('');
    setPreview(null);
    setParseError(null);
    setUploading(false);
    setDone(false);
    setUploadError(null);
  }, [open, activeTab]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const slugTitle = title.toLowerCase().replace(/\s+/g, '-');

  /* ── Parse + remap + preview ── */
  const parseAndPreview = useCallback(async () => {
    setParseError(null);
    setPreview(null);
    setUploadError(null);

    let result: ParseResult | null = null;

    if (activeTab === 'csv' && csvFile) {
      result = csvToObjects(await csvFile.text());
    } else if (activeTab === 'json' && jsonFile) {
      result = jsonToObjects(await jsonFile.text());
    } else if (activeTab === 'excel' && excelFile) {
      setXlsxLoading(true);
      result = await excelToObjects(excelFile);
      setXlsxLoading(false);
    } else if (activeTab === 'paste' && pasteText.trim()) {
      const t = pasteText.trim();
      result = t.startsWith('[') || t.startsWith('{')
        ? jsonToObjects(t)
        : csvToObjects(t);
    }

    if (!result) return;
    if (!result.ok) { setParseError(result.error); return; }

    // ✅ THE FIX — remap every row's keys to the exact field.key values
    const remapped = remapRows(result.rows, templateFields);

    if (!remapped.length) {
      setParseError('No valid rows were found in the provided data.');
      return;
    }

    setPreview(remapped);
  }, [activeTab, csvFile, jsonFile, excelFile, pasteText, templateFields]);

  /* Auto-preview on input */
  useEffect(() => {
    const hasInput =
      (activeTab === 'csv'   && csvFile)   ||
      (activeTab === 'json'  && jsonFile)  ||
      (activeTab === 'excel' && excelFile) ||
      (activeTab === 'paste' && pasteText.trim().length > 10);
    if (hasInput) parseAndPreview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvFile, jsonFile, excelFile, pasteText, activeTab]);

  /* ── Required-field validation ── */
  const validation = useMemo(() => {
    if (!preview?.length) return { valid: true, missingRows: [] as number[] };
    const requiredKeys = templateFields.filter((f) => f.required).map((f) => f.key);
    if (!requiredKeys.length) return { valid: true, missingRows: [] as number[] };

    const missingRows: number[] = [];
    preview.forEach((row, i) => {
      const isMissing = requiredKeys.some(
        (k) => !row[k] || !String(row[k]).trim()
      );
      if (isMissing) missingRows.push(i + 1);
    });
    return { valid: missingRows.length === 0, missingRows };
  }, [preview, templateFields]);

  /* ── Upload ── */
  const handleUpload = useCallback(async () => {
    if (!preview?.length || !validation.valid) return;
    setUploading(true);
    setUploadError(null);
    try {
      await onBulkUpload(preview);
      setDone(true);
    } catch (err: any) {
      setUploadError(err?.message ?? 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [preview, validation.valid, onBulkUpload]);

  /* ── Template downloads ── */
  const downloadCsvTemplate = () =>
    downloadText(buildCsvTemplate(templateFields), `${slugTitle}-template.csv`, 'text/csv');

  const downloadJsonTemplate = () =>
    downloadText(buildJsonTemplate(templateFields), `${slugTitle}-template.json`, 'application/json');

  const downloadExcelTemplate = async () => {
    try {
      const blob = await buildExcelTemplate(templateFields);
      downloadBlob(blob, `${slugTitle}-template.xlsx`);
    } catch {
      alert('Excel template generation failed. SheetJS could not be loaded.');
    }
  };

  /* ── Preview columns — always ordered by templateFields, since rows
     are now guaranteed to use field.key exactly ── */
  const previewColumns = useMemo(() => {
    if (!preview?.length) return [];
    const rowKeys = new Set(Object.keys(preview[0]));
    const ordered = templateFields.map((f) => f.key).filter((k) => rowKeys.has(k));
    const knownKeys = new Set(templateFields.map((f) => f.key));
    const extras = Object.keys(preview[0]).filter((k) => !knownKeys.has(k));
    return [...ordered, ...extras.slice(0, 3)];
  }, [preview, templateFields]);

  /* Map field.key -> label for readable preview headers */
  const columnLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    templateFields.forEach((f) => { map[f.key] = f.label; });
    return map;
  }, [templateFields]);

  if (!open) return null;

  const fieldLabels = templateFields.map((f) => f.label);

  return (
    <div
      className="bulk-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Bulk Upload ${title}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bulk-modal-panel">
        {/* ── Header ── */}
        <div className="bulk-modal-header">
          <div className="bulk-modal-header-left">
            <div className="bulk-modal-kicker">
              <Upload size={13} />
              <span>Bulk import workspace</span>
            </div>
            <h2 className="bulk-modal-title">Bulk Upload {title}</h2>
          </div>
          <button
            type="button"
            className="bulk-modal-close"
            onClick={onClose}
            aria-label="Close bulk upload"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="bulk-tab-bar" role="tablist">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`bulk-tab${activeTab === tab.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={15} />
                <span className="bulk-tab-label">{tab.label}</span>
                <span className="bulk-tab-hint">{tab.hint}</span>
              </button>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div className="bulk-modal-body">

          {/* Template downloads */}
          <div className="bulk-section">
            <div className="bulk-section-label">
              <Download size={13} />
              Template files
            </div>
            <p className="bulk-section-hint">
              Download a clean template with the expected field order before importing.
            </p>
            <div className="bulk-template-btns">
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadCsvTemplate}>
                <FileText size={13} /> CSV Template
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadJsonTemplate}>
                <FileJson size={13} /> JSON Template
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={downloadExcelTemplate}>
                <FileSpreadsheet size={13} /> Excel Template
              </button>
            </div>
          </div>

          {/* Expected fields */}
          <div className="bulk-section">
            <div className="bulk-section-label">Expected fields</div>
            <div className="bulk-field-pills">
              {templateFields.map((f) => (
                <span
                  key={f.key}
                  className={`bulk-field-pill${f.required ? ' is-required' : ''}`}
                  title={f.helpText ?? f.type ?? 'text'}
                >
                  {f.label}
                  {f.required && <span className="bulk-pill-req" aria-label="required">*</span>}
                </span>
              ))}
            </div>
          </div>

          {/* ── CSV tab ── */}
          {activeTab === 'csv' && (
            <div className="bulk-section">
              <div className="bulk-section-label">
                <FileText size={13} /> Upload CSV file
              </div>
              <p className="bulk-section-hint">
                Upload a CSV file that matches the template fields.
              </p>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                className={`bulk-drop-zone${csvFile ? ' has-file' : ''}`}
                onClick={() => csvInputRef.current?.click()}
                aria-label="Choose CSV file"
              >
                <FileText size={28} className="bulk-drop-icon" />
                {csvFile ? (
                  <span className="bulk-drop-filename">{csvFile.name}</span>
                ) : (
                  <>
                    <span className="bulk-drop-cta">Choose CSV File</span>
                    <span className="bulk-drop-sub">or drag and drop here</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── JSON tab ── */}
          {activeTab === 'json' && (
            <div className="bulk-section">
              <div className="bulk-section-label">
                <FileJson size={13} /> Upload JSON file
              </div>
              <p className="bulk-section-hint">
                Upload a <code>.json</code> file containing an array of objects.
              </p>
              <input
                ref={jsonInputRef}
                type="file"
                accept=".json,application/json"
                className="sr-only"
                onChange={(e) => setJsonFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                className={`bulk-drop-zone${jsonFile ? ' has-file' : ''}`}
                onClick={() => jsonInputRef.current?.click()}
                aria-label="Choose JSON file"
              >
                <FileJson size={28} className="bulk-drop-icon" />
                {jsonFile ? (
                  <span className="bulk-drop-filename">{jsonFile.name}</span>
                ) : (
                  <>
                    <span className="bulk-drop-cta">Choose JSON File</span>
                    <span className="bulk-drop-sub">or drag and drop here</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── Excel tab ── */}
          {activeTab === 'excel' && (
            <div className="bulk-section">
              <div className="bulk-section-label">
                <FileSpreadsheet size={13} /> Upload Excel file
              </div>
              <p className="bulk-section-hint">
                Upload a <code>.xlsx</code> or <code>.xls</code> file. The first sheet will be imported.
              </p>
              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                className={`bulk-drop-zone${excelFile ? ' has-file' : ''}`}
                onClick={() => excelInputRef.current?.click()}
                aria-label="Choose Excel file"
                disabled={xlsxLoading}
              >
                {xlsxLoading
                  ? <Loader2 size={28} className="bulk-drop-icon bulk-spin" />
                  : <FileSpreadsheet size={28} className="bulk-drop-icon" />
                }
                {excelFile ? (
                  <span className="bulk-drop-filename">{excelFile.name}</span>
                ) : (
                  <>
                    <span className="bulk-drop-cta">
                      {xlsxLoading ? 'Parsing…' : 'Choose Excel File'}
                    </span>
                    <span className="bulk-drop-sub">
                      {xlsxLoading ? 'Loading SheetJS…' : '.xlsx or .xls supported'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── Paste tab ── */}
          {activeTab === 'paste' && (
            <div className="bulk-section">
              <div className="bulk-section-label">
                <ClipboardPaste size={13} /> Paste raw data
              </div>
              <p className="bulk-section-hint">
                Paste CSV text (with headers) or a JSON array directly.
              </p>
              <textarea
                className="bulk-paste-area form-input"
                rows={8}
                placeholder={
                  `Paste CSV:\n${fieldLabels.join(',')}\nvalue1,value2,...` +
                  `\n\nOr paste JSON:\n[{"${templateFields[0]?.key ?? 'field'}": "value", ...}]`
                }
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                spellCheck={false}
              />
            </div>
          )}

          {/* Parse error */}
          {parseError && (
            <div className="bulk-error-banner" role="alert">
              <AlertCircle size={15} />
              <span>{parseError}</span>
            </div>
          )}

          {/* Required-field validation error */}
          {preview && !validation.valid && (
            <div className="bulk-error-banner" role="alert">
              <AlertCircle size={15} />
              <span>
                Row{validation.missingRows.length !== 1 ? 's' : ''}{' '}
                {validation.missingRows.slice(0, 8).join(', ')}
                {validation.missingRows.length > 8 ? '…' : ''} missing required
                field{templateFields.filter((f) => f.required).length !== 1 ? 's' : ''}.
                Fix the source data and re-upload before continuing.
              </span>
            </div>
          )}

          {/* Preview table */}
          {preview && preview.length > 0 && !parseError && (
            <div className="bulk-section">
              <div className="bulk-section-label">
                {validation.valid ? (
                  <CheckCircle2 size={13} style={{ color: 'var(--color-success)' }} />
                ) : (
                  <AlertCircle size={13} style={{ color: 'var(--color-error)' }} />
                )}
                Preview — {preview.length} row{preview.length !== 1 ? 's' : ''} parsed
              </div>
              <div className="bulk-preview-wrap">
                <table className="bulk-preview-table">
                  <thead>
                    <tr>
                      <th className="bulk-preview-row-num">#</th>
                      {previewColumns.map((col) => (
                        <th key={col}>{columnLabelMap[col] ?? col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        <td className="bulk-preview-row-num">{i + 1}</td>
                        {previewColumns.map((col) => (
                          <td key={col} title={row[col]}>
                            {row[col]
                              ? <span className="bulk-preview-cell">{row[col]}</span>
                              : <span className="bulk-preview-empty">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 5 && (
                  <p className="bulk-preview-more">
                    +{preview.length - 5} more rows not shown
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="bulk-error-banner" role="alert">
              <AlertCircle size={15} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="bulk-success-banner" role="status">
              <CheckCircle2 size={15} />
              <span>
                {preview?.length ?? 0} rows uploaded successfully to {title}!
              </span>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="bulk-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {done ? 'Close' : 'Cancel'}
          </button>

          {!done && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!preview?.length || uploading || !validation.valid}
              onClick={handleUpload}
            >
              {uploading ? (
                <><Loader2 size={14} className="bulk-spin" /> Uploading…</>
              ) : (
                <>
                  <Upload size={14} />
                  Upload {preview?.length
                    ? `${preview.length} Row${preview.length !== 1 ? 's' : ''}`
                    : 'Data'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}