import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

interface AuthValue {
  user: User | null
  role: string | null
  loading: boolean
  previewMode: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue>({
  user: null,
  role: null,
  loading: true,
  previewMode: true,
  signIn: async () => ({}),
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      setRole('admin')
      return
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)
      if (sessionUser) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', sessionUser.id).single()
        setRole(profile?.role ?? 'user')
      }
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      if (sessionUser) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', sessionUser.id).single()
        setRole(profile?.role ?? 'user')
      } else {
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {}
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  const value = useMemo(
    () => ({ user, role, loading, previewMode: !isSupabaseConfigured, signIn, signOut }),
    [user, role, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)