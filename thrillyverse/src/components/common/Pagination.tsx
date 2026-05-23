'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, onPageChange }: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap && <span className="text-text-faint text-sm">…</span>}
            <button
              className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}