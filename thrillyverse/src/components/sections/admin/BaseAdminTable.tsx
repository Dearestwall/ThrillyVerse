'use client';

import { useState } from 'react';

type Column<T> = {
  label: string;
  render: (row: T) => React.ReactNode;
};

export function BaseAdminTable<T extends { id: string }>({
  title,
  addLabel,
  data,
  columns
}: {
  title: string;
  addLabel: string;
  data: T[];
  columns: Column<T>[];
}) {
  const [rows] = useState<T[]>(data);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">{title}</h1>
        <button className="btn btn-primary">{addLabel}</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column, idx) => <th key={idx}>{column.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column, idx) => <td key={idx}>{column.render(row)}</td>)}
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}