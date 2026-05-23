import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useCollection<T extends { id: string }>(table: string, demoData: T[]) {
  const [items, setItems] = useState<T[]>(demoData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      setItems(demoData)
      setLoading(false)
      return
    }

    const tableRef: any = supabase.from(table)
    const { data, error } = await tableRef.select('*').order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setItems((data ?? []) as T[])
    }

    setLoading(false)
  }, [demoData, table])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createItem = async (payload: Partial<T>) => {
    if (!isSupabaseConfigured) {
      const next = {
        id: crypto.randomUUID(),
        ...payload
      } as T

      setItems(prev => [next, ...prev])
      return next
    }

    const tableRef: any = supabase.from(table)
    const { data, error } = await tableRef.insert(payload).select().single()

    if (error) throw new Error(error.message)

    setItems(prev => [data as T, ...prev])
    return data as T
  }

  const updateItem = async (id: string, payload: Partial<T>) => {
    if (!isSupabaseConfigured) {
      setItems(prev => prev.map(item => (item.id === id ? ({ ...item, ...payload } as T) : item)))
      return
    }

    const tableRef: any = supabase.from(table)
    const { data, error } = await tableRef.update(payload).eq('id', id).select().single()

    if (error) throw new Error(error.message)

    setItems(prev => prev.map(item => (item.id === id ? (data as T) : item)))
  }

  const deleteItem = async (id: string) => {
    if (!isSupabaseConfigured) {
      setItems(prev => prev.filter(item => item.id !== id))
      return
    }

    const tableRef: any = supabase.from(table)
    const { error } = await tableRef.delete().eq('id', id)

    if (error) throw new Error(error.message)

    setItems(prev => prev.filter(item => item.id !== id))
  }

  return { items, loading, error, refresh, createItem, updateItem, deleteItem }
}