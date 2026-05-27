'use client';

import { useState } from 'react';

export function EditorToolbar({
  onPreview,
  onClear,
  onSaveDraft,
}: {
  onPreview?: () => void;
  onClear?: () => void;
  onSaveDraft?: () => void;
}) {
  const [active, setActive] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={`btn btn-sm ${active === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActive('edit')}
        >
          Edit
        </button>
        <button
          type="button"
          className={`btn btn-sm ${active === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setActive('preview');
            onPreview?.();
          }}
        >
          Preview
        </button>
      </div>

      <div className="flex gap-2">
        {onSaveDraft && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onSaveDraft}>
            Save draft
          </button>
        )}
        {onClear && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}