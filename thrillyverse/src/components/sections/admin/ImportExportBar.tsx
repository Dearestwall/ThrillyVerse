'use client';

import { useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onImport?: (text: string) => Promise<void>;
  placeholder?: string;
  templateCsv?: string;
  onExport?: () => void;
};

export function ImportExportBar({
  value,
  onChange,
  onImport,
  placeholder,
  templateCsv = 'title,slug\nExample Title,example-title',
  onExport,
}: Props) {
  const [text, setText] = useState('');
  const [importing, setImporting] = useState(false);

  const downloadTemplate = () => {
    const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!onImport || !text.trim()) return;
    setImporting(true);
    try {
      await onImport(text);
      setText('');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-card p-4 space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <input
          className="form-input admin-search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Search...'}
        />
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-secondary btn-sm" onClick={downloadTemplate} type="button">
            Download template
          </button>
          {onExport && (
            <button className="btn btn-secondary btn-sm" onClick={onExport} type="button">
              Export CSV
            </button>
          )}
        </div>
      </div>

      {onImport && (
        <div className="grid gap-2">
          <textarea
            className="form-input min-h-28"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste CSV / TSV here..."
          />
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleImport} type="button" disabled={importing}>
              {importing ? 'Importing...' : 'Import pasted data'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setText('')} type="button">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}