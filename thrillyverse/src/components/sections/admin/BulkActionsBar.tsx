'use client';

type Props = {
  count: number;
  onDelete: () => void;
  onClear: () => void;
};

export function BulkActionsBar({ count, onDelete, onClear }: Props) {
  return (
    <div className="admin-card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="text-sm text-text-muted">
        <span className="font-semibold text-white">{count}</span> selected
      </div>
      <div className="flex gap-2">
        <button className="btn btn-danger btn-sm" onClick={onDelete} type="button">
          Delete selected
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onClear} type="button">
          Clear
        </button>
      </div>
    </div>
  );
}