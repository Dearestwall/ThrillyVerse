import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type ResourceRecord = {
  id: string
  created_at?: string
}

type UseCollectionOptions<T> = {
  table: string
  demoData: T[]
  orderBy?: string
  ascending?: boolean
}

export function useCollection<T extends ResourceRecord>({
  table,
  demoData,
  orderBy = 'created_at',
  ascending = false
}: UseCollectionOptions<T>) {
  const [items, setItems] = useState<T[]>(demoData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      setItems(demoData)
      setLoading(false)
      return
    }

    const response = await supabase.from(table).select('*').order(orderBy, { ascending })

    if (response.error) {
      setError(response.error.message)
      setLoading(false)
      return
    }

    setItems((response.data ?? []) as T[])
    setLoading(false)
  }, [ascending, demoData, orderBy, table])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createItem = useCallback(
    async (payload: Partial<T>) => {
      setSaving(true)
      setError(null)

      try {
        if (!isSupabaseConfigured) {
          const next = {
            id: crypto.randomUUID(),
            ...payload,
            created_at: new Date().toISOString()
          } as T

          setItems((prev) => [next, ...prev])
          return next
        }

        const response = await supabase
          .from(table)
          .insert([payload as any])
          .select()
          .single()

        if (response.error) throw new Error(response.error.message)

        const record = response.data as T
        setItems((prev) => [record, ...prev])
        return record
      } finally {
        setSaving(false)
      }
    },
    [table]
  )

  const updateItem = useCallback(
    async (id: string, payload: Partial<T>) => {
      setSaving(true)
      setError(null)

      try {
        if (!isSupabaseConfigured) {
          setItems((prev) =>
            prev.map((item) => (item.id === id ? ({ ...item, ...payload } as T) : item))
          )
          return
        }

        const response = await supabase
          .from(table)
          .update(payload as any)
          .eq('id', id)
          .select()
          .single()

        if (response.error) throw new Error(response.error.message)

        const updated = response.data as T
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      } finally {
        setSaving(false)
      }
    },
    [table]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      setSaving(true)
      setError(null)

      try {
        if (!isSupabaseConfigured) {
          setItems((prev) => prev.filter((item) => item.id !== id))
          return
        }

        const response = await supabase.from(table).delete().eq('id', id)

        if (response.error) throw new Error(response.error.message)

        setItems((prev) => prev.filter((item) => item.id !== id))
      } finally {
        setSaving(false)
      }
    },
    [table]
  )

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return items

    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(normalized)
    )
  }, [items, query])

  return {
    items,
    filteredItems,
    loading,
    saving,
    error,
    query,
    setQuery,
    refresh,
    createItem,
    updateItem,
    deleteItem,
    total: items.length
  }
}