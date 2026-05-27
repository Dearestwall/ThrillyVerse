'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { bulkDeleteAction, deleteRowAction } from '@/app/actions/admin';
import { BulkActionsBar } from './BulkActionsBar';
import { ImportExportBar } from './ImportExportBar';

type Column<T> = {
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type FilterOption = {
  key: string;
  label: string;
};

export function BaseAdminTable<T extends { id: string }>({
  title,
  addLabel,
  createHref,
  data,
  columns,
  searchKeys = [],
  filters = [],
  tableName,
  deletePaths = [],
  renderRowActions,
  onImport,
  onExport,
}: {
  title: string;
  addLabel: string;
  createHref?: string;
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T | string)[];
  filters?: FilterOption[];
  tableName: string;
  deletePaths?: string[];
  renderRowActions?: (row: T) => React.ReactNode;
  onImport?: (text: string) => Promise<void>;
  onExport?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [, startTransition] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();

    return data.filter((row) => {
      const haystack = searchKeys.length
        ? searchKeys.map((k) => String((row as any)[k] ?? '')).join(' ').toLowerCase()
        : Object.values(row).join(' ').toLowerCase();

      const passesQuery = !q || haystack.includes(q);
      const passesFilter =
        activeFilter === 'all'
          ? true
          : String((row as any)[activeFilter]) === 'true' ||
            String((row as any)[activeFilter]) === activeFilter;

      return passesQuery && passesFilter;
    });
  }, [data, query, searchKeys, activeFilter]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !rows.find((r) => r.id === id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...rows.map((r) => r.id)])));
    }
  }

  async function handleBulkDelete() {
    try {
      await bulkDeleteAction(tableName, selected, deletePaths);
      setSelected([]);
      toast.success('Deleted selected items');
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to delete selected items');
    }
  }

  async function handleDeleteOne(id: string) {
    try {
      await deleteRowAction(tableName, id, deletePaths);
      toast.success('Deleted item');
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to delete item');
    }
  }

  return (
    <div className="space-y-4">
      <div className="admin-toolbar">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-text-muted">{title}</div>
          <div className="text-sm text-text-muted">
            {rows.length} shown of {data.length} total
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {createHref ? (
            <Link href={createHref} className="btn btn-primary">
              {addLabel}
            </Link>
          ) : (
            <button className="btn btn-primary" type="button">
              {addLabel}
            </button>
          )}
          {onExport && (
            <button className="btn btn-secondary" type="button" onClick={onExport}>
              Export CSV
            </button>
          )}
        </div>
      </div>

      <ImportExportBar
        value={query}
        onChange={setQuery}
        onImport={onImport}
        placeholder={`Search ${title.toLowerCase()}...`}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`admin-chip ${activeFilter === 'all' ? 'admin-chip--success' : 'admin-chip--muted'}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        {filters.map((f) => (
          <button
            type="button"
            key={f.key}
            className={`admin-chip ${activeFilter === f.key ? 'admin-chip--success' : 'admin-chip--muted'}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <BulkActionsBar
          count={selected.length}
          onDelete={handleBulkDelete}
          onClear={() => setSelected([])}
        />
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              {columns.map((c) => (
                <th key={c.label} className={c.className}>
                  {c.label}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const checked = selected.includes(row.id);
              return (
                <tr key={row.id} className={checked ? 'admin-row admin-row--selected' : 'admin-row'}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((x) => x !== row.id)
                            : [...prev, row.id]
                        )
                      }
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.label} className={column.className}>
                      {column.render(row)}
                    </td>
                  ))}
                  <td>
                    <div className="admin-actions">
                      {renderRowActions?.(row)}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          startTransition(async () => {
                            await handleDeleteOne(row.id);
                          })
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && <div className="admin-empty">No matching records found.</div>}
    </div>
  );
}