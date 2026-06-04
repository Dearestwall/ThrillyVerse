export type AdminBulkFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'url'
  | 'email'
  | 'select'
  | 'tags';

export interface AdminBulkTemplateField {
  key: string;
  label: string;
  type?: AdminBulkFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
}