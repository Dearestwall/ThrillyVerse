import {
  bulkUploadRowsAction,
} from '@/app/actions/admin';

export type BulkUploadField = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'checkbox' | 'url' | 'select' | 'date' | 'email' | 'tags';
  required?: boolean;
  options?: { label: string; value: string }[];
};

export async function runBulkUpload(
  table: string,
  rows: Record<string, string>[]
) {
  await bulkUploadRowsAction(table as any, rows);
}

export function normalizeBooleanCsvValue(value: unknown) {
  const v = String(value ?? '').trim().toLowerCase();
  return ['true', '1', 'yes', 'y', 'on'].includes(v);
}