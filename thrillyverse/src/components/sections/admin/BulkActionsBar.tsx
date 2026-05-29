'use client';

type Props = {
  count: number;
  onDelete: () => void;
  onClear: () => void;
  deleting?: boolean;
};

export function BulkActionsBar({ count, onDelete, onClear, deleting = false }: Props) {
  if (count <= 0) return null;

  return (
    <div className="admin-bulk-bar">
      <div className="flex items-center gap-3">
        <div className="bulk-count-badge">{count}</div>
        <div>
          <div className="text-sm font-medium text-white">Bulk selection active</div>
          <div className="text-xs text-text-muted">{count} selected.</div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button className="btn btn-danger btn-sm" onClick={onDelete} type="button" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete selected'}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onClear} type="button" disabled={deleting}>
          Clear selection
        </button>
      </div>
    </div>
  );
}