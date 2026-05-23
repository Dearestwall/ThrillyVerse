import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type Role = 'guest' | 'admin'

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

type ActionResult = {
  error: string | null
}

type AuthContextValue = {
  user: User | null
  session: Session | null
  profile: ProfileRow | null
  role: Role
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<ActionResult>
  signOut: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<ActionResult>
  updatePassword: (password: string) => Promise<ActionResult>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function deriveRole(profile: ProfileRow | null): Role {
  if (!profile) return 'guest'
  if (profile.is_active === false) return 'guest'
  return profile.role === 'admin' ? 'admin' : 'guest'
}

function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`Timed out after ${ms}ms`))
    }, ms)

    promise
      .then((value) => {
        window.clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        window.clearTimeout(timer)
        reject(error)
      })
  })
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  try {
    const result = await withTimeout(
      Promise.resolve(
        supabase
          .from('profiles')
          .select('id,email,full_name,avatar_url,role,is_active,created_at,updated_at')
          .eq('id', userId)
          .single()
      ),
      2500
    )

    const { data, error } = result

    if (error) {
      console.error('[Auth] Profile fetch error:', error.message)
      return null
    }

    return data as ProfileRow
  } catch (error) {
    console.error('[Auth] Profile fetch failed:', error)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const mounted = useRef(true)

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [role, setRole] = useState<Role>('guest')
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const applySession = useCallback(async (nextSession: Session | null) => {
    const nextUser = nextSession?.user ?? null

    setSession(nextSession)
    setUser(nextUser)

    if (!nextUser) {
      setProfile(null)
      setRole('guest')
      return 'guest'
    }

    const nextProfile = await fetchProfile(nextUser.id)
    const nextRole = deriveRole(nextProfile)

    setProfile(nextProfile)
    setRole(nextRole)

    return nextRole
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return

    const nextProfile = await fetchProfile(user.id)
    const nextRole = deriveRole(nextProfile)
    setProfile(nextProfile)
    setRole(nextRole)
  }, [user])

  useEffect(() => {
    mounted.current = true

    if (!isSupabaseConfigured) {
      setUser(null)
      setSession(null)
      setProfile(null)
      setRole('guest')
      setLoading(false)
      setInitialized(true)
      return () => {
        mounted.current = false
      }
    }

    const hardRelease = window.setTimeout(() => {
      if (!mounted.current) return
      console.warn('[Auth] Hard release fired')
      setLoading(false)
      setInitialized(true)
    }, 3000)

    const boot = async () => {
      try {
        const {
          data: { session: currentSession },
          error
        } = await withTimeout(supabase.auth.getSession(), 2500)

        if (error) {
          console.error('[Auth] getSession error:', error.message)
          setUser(null)
          setSession(null)
          setProfile(null)
          setRole('guest')
        } else {
          await applySession(currentSession ?? null)
        }

        if (window.location.hash.includes('access_token=')) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
        }
      } catch (error) {
        console.error('[Auth] Boot failed:', error)
        setUser(null)
        setSession(null)
        setProfile(null)
        setRole('guest')
      } finally {
        if (mounted.current) {
          window.clearTimeout(hardRelease)
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    boot()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted.current) return

      try {
        setLoading(true)
        await applySession(nextSession ?? null)

        if (window.location.hash.includes('access_token=')) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
        }
      } catch (error) {
        console.error('[Auth] onAuthStateChange failed:', error)
        setUser(null)
        setSession(null)
        setProfile(null)
        setRole('guest')
      } finally {
        if (mounted.current) {
          setLoading(false)
          setInitialized(true)
        }
      }
    })

    return () => {
      mounted.current = false
      window.clearTimeout(hardRelease)
      subscription.unsubscribe()
    }
  }, [applySession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      role,
      loading,
      initialized,

      signIn: async (email: string, password: string) => {
        try {
          setLoading(true)

          const { data, error } = await withTimeout(
            supabase.auth.signInWithPassword({
              email: email.trim(),
              password
            }),
            5000
          )

          if (error) {
            setLoading(false)
            return { error: error.message }
          }

          const nextRole = await applySession(data.session ?? null)

          if (nextRole !== 'admin') {
            await supabase.auth.signOut()
            setUser(null)
            setSession(null)
            setProfile(null)
            setRole('guest')
            setLoading(false)
            return { error: 'This account does not have admin access.' }
          }

          setLoading(false)
          return { error: null }
        } catch (error) {
          console.error('[Auth] signIn failed:', error)
          setLoading(false)
          return {
            error: error instanceof Error ? error.message : 'Unable to sign in.'
          }
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut()
        } catch (error) {
          console.error('[Auth] signOut failed:', error)
        } finally {
          setUser(null)
          setSession(null)
          setProfile(null)
          setRole('guest')
          setLoading(false)
          setInitialized(true)
        }
      },

      sendPasswordReset: async (email: string) => {
        try {
          const { error } = await withTimeout(
            supabase.auth.resetPasswordForEmail(email.trim(), {
              redirectTo: `${window.location.origin}/reset-password`
            }),
            5000
          )

          return { error: error?.message ?? null }
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : 'Could not send reset email.'
          }
        }
      },

      updatePassword: async (password: string) => {
        try {
          const { error } = await withTimeout(
            supabase.auth.updateUser({ password }),
            5000
          )

          return { error: error?.message ?? null }
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : 'Could not update password.'
          }
        }
      },

      refreshProfile
    }),
    [user, session, profile, role, loading, initialized, applySession, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return ctx
}