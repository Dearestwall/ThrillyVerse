import { createClient } from '@/lib/supabase/server';
import { ADMIN_TABLE_OVERRIDES, AdminFieldType } from './adminTableSchemas';

export type DbColumnSchema = {
  table_schema: string;
  table_name: string;
  ordinal_position: number;
  column_name: string;
  data_type: string;
  udt_name: string;
  is_nullable: boolean;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  is_identity: boolean;
  is_generated: boolean;
  is_primary_key: boolean;
  is_unique: boolean;
};

export type AdminResolvedField = {
  name: string;
  label: string;
  dbType: string;
  uiType: AdminFieldType;
  required: boolean;
  hidden: boolean;
  readOnly: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
};

function startCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function inferUiType(col: DbColumnSchema): AdminFieldType {
  const name = col.column_name;

  if (name === 'email') return 'email';
  if (name.endsWith('_url') || name === 'link' || name === 'website' || name === 'website_url') return 'url';
  if (name.includes('description') || name === 'content' || name === 'message' || name === 'summary' || name === 'excerpt' || name === 'text') return 'textarea';
  if (name === 'tags' || name === 'tech_stack') return 'tags';
  if (col.data_type === 'boolean') return 'checkbox';
  if (
    col.data_type === 'smallint' ||
    col.data_type === 'integer' ||
    col.data_type === 'bigint' ||
    col.data_type === 'numeric' ||
    col.data_type === 'real' ||
    col.data_type === 'double precision'
  ) return 'number';
  if (col.data_type === 'date') return 'date';
  if (col.data_type.includes('timestamp')) return 'datetime';
  if (col.data_type === 'json' || col.data_type === 'jsonb') return 'json';

  return 'text';
}

export async function getAdminTableSchema(tableName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_table_form_schema', {
    p_table_name: tableName,
  });

  if (error) {
    throw new Error(error.message);
  }

  const dbColumns = (data ?? []) as DbColumnSchema[];
  const tableOverride = ADMIN_TABLE_OVERRIDES[tableName] ?? {};
  const hiddenColumns = new Set(tableOverride.hiddenColumns ?? []);
  const overrideMap = tableOverride.overrides ?? {};

  let fields: AdminResolvedField[] = dbColumns.map((col) => {
    const override = overrideMap[col.column_name];

    const hidden =
      Boolean(override?.hidden) ||
      hiddenColumns.has(col.column_name) ||
      col.is_generated;

    const readOnly =
      Boolean(override?.readOnly) ||
      col.is_identity ||
      col.is_generated;

    return {
      name: col.column_name,
      label: override?.label ?? startCase(col.column_name),
      dbType: col.data_type,
      uiType: override?.type ?? inferUiType(col),
      required: override?.required ?? (!col.is_nullable && !col.column_default && !col.is_identity),
      hidden,
      readOnly,
      isPrimaryKey: col.is_primary_key,
      isUnique: col.is_unique,
      placeholder: override?.placeholder,
      helpText: override?.helpText,
      options: override?.options,
    };
  });

  if (tableOverride.fieldOrder?.length) {
    const order = new Map(tableOverride.fieldOrder.map((name, index) => [name, index]));
    fields = fields.sort((a, b) => {
      const aIndex = order.has(a.name) ? order.get(a.name)! : 9999 + a.name.localeCompare(b.name);
      const bIndex = order.has(b.name) ? order.get(b.name)! : 9999 + b.name.localeCompare(a.name);
      return aIndex - bIndex;
    });
  }

  return {
    tableName,
    titleField: tableOverride.titleField ?? 'title',
    slugSourceField: tableOverride.slugSourceField ?? 'title',
    fields,
    visibleFields: fields.filter((f) => !f.hidden),
    bulkFields: fields.filter((f) => !f.hidden && !f.readOnly),
  };
}