import { useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

export interface FieldConfig<T> {
  key: keyof T
  label: string
  type?: 'text' | 'textarea' | 'url' | 'number' | 'checkbox'
  required?: boolean
}

interface AdminResourcePageProps<T extends { id: string }> {
  title: string
  description: string
  items: T[]
  loading: boolean
  fields: FieldConfig<T>[]
  onCreate: (payload: Partial<T>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<T>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function buildInitialValues<T>(fields: FieldConfig<T>[]) {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    values[String(field.key)] = field.type === 'checkbox' ? false : ''
  }
  return values as Partial<T>
}

function validateFields<T>(values: Partial<T>, fields: FieldConfig<T>[]) {
  for (const field of fields) {
    if (field.type === 'checkbox') continue
    if (field.required === false) continue

    const raw = values[field.key]
    const value = typeof raw === 'string' ? raw.trim() : raw

    if (value === '' || value === undefined || value === null) {
      return `${field.label} is required`
    }
  }
  return null
}

export function AdminResourcePage<T extends { id: string }>({
  title,
  description,
  items,
  loading,
  fields,
  onCreate,
  onUpdate,
  onDelete
}: AdminResourcePageProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Partial<T>>(buildInitialValues(fields))
  const [saving, setSaving] = useState(false)

  const itemCount = useMemo(() => items.length, [items])

  const handleEdit = (item: T) => {
    setEditingId(item.id)
    setFormValues(item)
  }

  const handleReset = () => {
    setEditingId(null)
    setFormValues(buildInitialValues(fields))
  }

  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      const validationError = validateFields(formValues, fields)

      if (validationError) {
        toast.error(validationError)
        return
      }

      if (editingId) {
        await onUpdate(editingId, formValues)
        toast.success('Item updated')
      } else {
        await onCreate(formValues)
        toast.success('Item created')
      }

      handleReset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this item?')) return

    try {
      await onDelete(id)
      toast.success('Item deleted')

      if (editingId === id) {
        handleReset()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete item')
    }
  }

  return (
    <div className="admin-grid-layout">
      <section className="card admin-list-card">
        <div className="admin-section-head">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <span className="badge">{itemCount} items</span>
        </div>

        {loading ? (
          <p className="muted-text">Loading...</p>
        ) : items.length === 0 ? (
          <p className="muted-text">No items yet.</p>
        ) : (
          <div className="admin-grid-cards">
            {items.map(item => {
              const displayTitle =
                (item as Record<string, unknown>).title ||
                (item as Record<string, unknown>).subject ||
                (item as Record<string, unknown>).name ||
                'Untitled'

              const displayText =
                (item as Record<string, unknown>).description ||
                (item as Record<string, unknown>).excerpt ||
                (item as Record<string, unknown>).email ||
                'No description yet.'

              return (
                <article key={item.id} className="mini-card">
                  <div>
                    <h3>{String(displayTitle)}</h3>
                    <p>{String(displayText)}</p>
                  </div>

                  <div className="mini-actions">
                    <button
                      type="button"
                      className="button button-ghost button-small"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-danger button-small"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="card admin-form-card">
        <div className="admin-section-head">
          <div>
            <h2>{editingId ? 'Edit item' : 'Create item'}</h2>
            <p>Manage content without editing source files.</p>
          </div>
        </div>

        <form className="field-grid" onSubmit={handleSubmit}>
          {fields.map(field => {
            const rawValue = formValues[field.key]
            const stringValue =
              typeof rawValue === 'string' || typeof rawValue === 'number'
                ? String(rawValue)
                : ''

            return (
              <label key={String(field.key)}>
                <span>{field.label}</span>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={5}
                    value={stringValue}
                    onChange={e => handleChange(field.key, e.target.value as T[keyof T])}
                  />
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={Boolean(rawValue)}
                    onChange={e => handleChange(field.key, e.target.checked as T[keyof T])}
                  />
                ) : (
                  <input
                    type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
                    value={stringValue}
                    onChange={e =>
                      handleChange(
                        field.key,
                        (field.type === 'number'
                          ? (e.target.value === '' ? '' : Number(e.target.value))
                          : e.target.value) as T[keyof T]
                      )
                    }
                  />
                )}
              </label>
            )
          })}

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update item' : 'Create item'}
            </button>
            <button type="button" className="button button-ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}