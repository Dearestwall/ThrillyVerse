'use client';

import { useState } from 'react';

export function ImageUrlField({
  name,
  label,
  placeholder = 'https://...',
  defaultValue = '',
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="form-label">{label}</label>
      <input
        name={name}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value ? (
        <div className="rounded-2xl overflow-hidden border border-divider bg-black/20">
          <img
            src={value}
            alt={label}
            className="w-full h-52 object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : null}
    </div>
  );
}