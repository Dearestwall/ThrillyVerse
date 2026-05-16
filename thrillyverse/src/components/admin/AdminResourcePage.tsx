import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  Grid2X2,
  List,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { uploadImageToCloudinary } from '../../lib/cloudinary'
import { AdminEmptyState } from './AdminEmptyState'

export interface FieldConfig<T> {
  key: keyof T
  label: string
  type?: 'text' | 'textarea' | 'url' | 'number' | 'checkbox' | 'image'
  required?: boolean
  placeholder?: string
  helperText?: string
  accept?: string
}

interface AdminResourcePageProps<T extends { id: string }> {
  icon?: ReactNode
  title: string
  description: string
  resourceName?: string
  items: T[]
  filteredItems?: T[]
  loading: boolean
  saving?: boolean
  error?: string | null
  query?: string
  setQuery?: (value: string) => void
  total?: number
  fields: FieldConfig<T>[]
  onRefresh?: () => Promise<void> | void
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

function getDisplayTitle<T>(item: T) {
  const record = item as Record<string, unknown>
  return (
    record.title ||
    record.subject ||
    record.name ||
    record.slug ||
    'Untitled'
  )
}

function getDisplayText<T>(item: T) {
  const record = item as Record<string, unknown>
  return (
    record.description ||
    record.excerpt ||
    record.email ||
    record.category ||
    'No description yet.'
  )
}

function getImageValue<T>(item: Partial<T>) {
  const record = item as Record<string, unknown>
  return (
    record.cover_url ||
    record.poster_url ||
    record.logo_url ||
    ''
  )
}

export function AdminResourcePage<T extends { id: string }>({
  icon,
  title,
  description,
  resourceName = 'item',
  items,
  filteredItems,
  loading,
  saving: externalSaving = false,
  error,
  query = '',
  setQuery,
  total,
  fields,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete
}: AdminResourcePageProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Partial<T>>(buildInitialValues(fields))
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'table'>('table')

  const dataset = filteredItems ?? items
  const itemCount = useMemo(() => total ?? items.length, [items.length, total])
  const visibleCount = dataset.length
  const activeSaving = saving || externalSaving

  useEffect(() => {
    if (editingId && !items.find((item) => item.id === editingId)) {
      setEditingId(null)
      setFormValues(buildInitialValues(fields))
    }
  }, [editingId, fields, items])

  const handleEdit = (item: T) => {
    setEditingId(item.id)
    setFormValues(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setEditingId(null)
    setFormValues(buildInitialValues(fields))
  }

  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleImageUpload = async <K extends keyof T>(key: K, file: File | null) => {
    if (!file) return

    try {
      setUploadingField(String(key))
      const uploaded = await uploadImageToCloudinary(file, 'thrillyverse/admin')
      handleChange(key, uploaded.url as T[K])
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed')
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSaving(true)

      const validationError = validateFields(formValues, fields)

      if (validationError) {
        toast.error(validationError)
        return
      }

      if (editingId) {
        await onUpdate(editingId, formValues)
        toast.success(`${resourceName} updated`)
      } else {
        await onCreate(formValues)
        toast.success(`${resourceName} created`)
      }

      handleReset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to save ${resourceName}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(`Delete this ${resourceName}? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await onDelete(id)
      toast.success(`${resourceName} deleted`)

      if (editingId === id) {
        handleReset()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to delete ${resourceName}`)
    }
  }

  const tableColumns = useMemo(() => {
    return fields.slice(0, 4)
  }, [fields])

  return (
    <div className="admin-resource-layout">
      <section className="card admin-resource-main">
        <div className="admin-section-head">
          <div className="admin-section-title-wrap">
            <div className="admin-section-title-icon">{icon}</div>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>

          <div className="admin-resource-head-actions">
            <span className="badge">{itemCount} total</span>
            <span className="badge badge-soft">{visibleCount} visible</span>
          </div>
        </div>

        <div className="admin-resource-toolbar">
          {setQuery ? (
            <label className="admin-search-wrap">
              <Search size={16} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
              />
            </label>
          ) : (
            <div />
          )}

          <div className="admin-resource-toolbar-actions">
            {onRefresh ? (
              <button
                type="button"
                className="button button-secondary button-small"
                onClick={() => void onRefresh()}
                disabled={activeSaving}
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            ) : null}

            <div className="admin-view-toggle">
              <button
                type="button"
                className={layout === 'table' ? 'admin-view-btn active' : 'admin-view-btn'}
                onClick={() => setLayout('table')}
                aria-label="Table view"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className={layout === 'grid' ? 'admin-view-btn active' : 'admin-view-btn'}
                onClick={() => setLayout('grid')}
                aria-label="Grid view"
              >
                <Grid2X2 size={16} />
              </button>
            </div>

            <button
              type="button"
              className="button button-primary button-small"
              onClick={handleReset}
              disabled={activeSaving}
            >
              <Plus size={16} />
              New {resourceName}
            </button>
          </div>
        </div>

        {error ? <div className="admin-inline-status error">{error}</div> : null}

        {loading ? (
          <p className="muted-text">Loading {title.toLowerCase()}...</p>
        ) : dataset.length === 0 ? (
          <AdminEmptyState
            title={`No ${title.toLowerCase()} yet`}
            text={`Create your first ${resourceName} to start populating this section.`}
            action={
              <button type="button" className="button button-primary" onClick={handleReset}>
                Create {resourceName}
              </button>
            }
          />
        ) : layout === 'table' ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {tableColumns.map((field) => (
                    <th key={String(field.key)}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataset.map((item) => (
                  <tr key={item.id}>
                    {tableColumns.map((field) => {
                      const value = item[field.key]
                      const imageLike =
                        field.type === 'image' ||
                        String(field.key).includes('cover') ||
                        String(field.key).includes('poster') ||
                        String(field.key).includes('logo')

                      return (
                        <td key={String(field.key)}>
                          {field.type === 'checkbox' ? (
                            <span className={value ? 'badge badge-success' : 'badge badge-soft'}>
                              {value ? 'Yes' : 'No'}
                            </span>
                          ) : imageLike && typeof value === 'string' && value ? (
                            <div className="admin-table-media-cell">
                              <img src={value} alt="" />
                              <span>{value}</span>
                            </div>
                          ) : (
                            <span>{String(value ?? '—')}</span>
                          )}
                        </td>
                      )
                    })}
                    <td>
                      <div className="mini-actions">
                        <button
                          type="button"
                          className="button button-ghost button-small"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button button-danger button-small"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-grid-cards">
            {dataset.map((item) => {
              const imageValue = getImageValue(item)

              return (
                <article key={item.id} className="mini-card admin-resource-card">
                  {imageValue ? (
                    <div className="admin-resource-card-media">
                      <img src={String(imageValue)} alt="" />
                    </div>
                  ) : null}

                  <div className="admin-resource-card-body">
                    <div>
                      <h3>{String(getDisplayTitle(item))}</h3>
                      <p>{String(getDisplayText(item))}</p>
                    </div>

                    <div className="mini-actions">
                      <button
                        type="button"
                        className="button button-ghost button-small"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button button-danger button-small"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="card admin-resource-form-card">
        <div className="admin-section-head">
          <div>
            <h2>{editingId ? `Edit ${resourceName}` : `Create ${resourceName}`}</h2>
            <p>Manage content without editing source files.</p>
          </div>

          {editingId ? (
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={handleReset}
            >
              <X size={14} />
              Cancel edit
            </button>
          ) : null}
        </div>

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const rawValue = formValues[field.key]
            const stringValue =
              typeof rawValue === 'string' || typeof rawValue === 'number'
                ? String(rawValue)
                : ''

            return (
              <label key={String(field.key)} className="admin-field">
                <span>{field.label}</span>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={5}
                    value={stringValue}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.key, e.target.value as T[keyof T])}
                  />
                ) : field.type === 'checkbox' ? (
                  <label className="admin-checkbox-row">
                    <input
                      type="checkbox"
                      checked={Boolean(rawValue)}
                      onChange={(e) => handleChange(field.key, e.target.checked as T[keyof T])}
                    />
                    <span>Enable {field.label.toLowerCase()}</span>
                  </label>
                ) : field.type === 'image' ? (
                  <div className="admin-image-field">
                    <div className="admin-image-field-row">
                      <input
                        type="url"
                        value={stringValue}
                        placeholder={field.placeholder || 'Paste image URL or upload below'}
                        onChange={(e) => handleChange(field.key, e.target.value as T[keyof T])}
                      />
                      <label className="button button-secondary button-small admin-upload-btn">
                        <Upload size={14} />
                        {uploadingField === String(field.key) ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept={field.accept || 'image/*'}
                          hidden
                          onChange={(e) => void handleImageUpload(field.key, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>

                    {stringValue ? (
                      <div className="admin-image-preview">
                        <img src={stringValue} alt="" />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <input
                    type={
                      field.type === 'url'
                        ? 'url'
                        : field.type === 'number'
                          ? 'number'
                          : 'text'
                    }
                    value={stringValue}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      handleChange(
                        field.key,
                        (field.type === 'number'
                          ? (e.target.value === '' ? '' : Number(e.target.value))
                          : e.target.value) as T[keyof T]
                      )
                    }
                  />
                )}

                {field.helperText ? (
                  <small className="admin-field-help">{field.helperText}</small>
                ) : null}
              </label>
            )
          })}

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={activeSaving}>
              {activeSaving ? 'Saving...' : editingId ? `Update ${resourceName}` : `Create ${resourceName}`}
            </button>

            <button
              type="button"
              className="button button-ghost"
              onClick={handleReset}
              disabled={activeSaving}
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}