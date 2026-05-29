'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  LockKeyhole,
  Mail,
  Sparkles,
  ShieldCheck,
  Home,
} from 'lucide-react';

function LoginBrand() {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className="w-12 h-12 rounded-2xl grid place-items-center bg-[color:var(--color-primary)]/15 border border-[color:var(--color-primary)]/20 shadow-lg">
        <Home size={20} style={{ color: 'var(--color-primary)' }} />
      </div>
      <div className="leading-none">
        <div className="font-display text-xl font-black tracking-tight">
          <span style={{ color: 'var(--color-primary)' }}>Thrilly</span>
          <span style={{ color: 'var(--color-gold)' }}>Verse</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted mt-1">
          Admin Access
        </div>
      </div>
    </div>
  );
}

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const redirectTo = searchParams.get('redirectTo') || '/admin';

  useEffect(() => {
    let mounted = true;

    const clear = async () => {
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
      } finally {
        if (mounted) setCheckingSession(false);
      }
    };

    clear();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail || !password) {
        toast.error('Please fill in both fields');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Welcome back');
      router.replace(redirectTo);
      router.refresh();
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden auth-grid-bg px-4 py-8 sm:px-6">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_15%_20%,rgba(1,105,111,0.18),transparent_22%),radial-gradient(circle_at_85%_18%,rgba(209,153,0,0.14),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.14),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden lg:flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            <div>
              <LoginBrand />
            </div>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-text-muted">
                <Sparkles size={14} />
                Secure control center
              </div>

              <h1 className="font-display text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight">
                Manage <span style={{ color: 'var(--color-primary)' }}>Thrilly</span>
                <span style={{ color: 'var(--color-gold)' }}>Verse</span> with confidence.
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-text-muted leading-7">
                Access the private admin dashboard for blogs, movies, materials, announcements,
                projects, reviews, and platform updates from one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck size={16} />
                  Protected access
                </div>
                <p className="text-sm text-text-muted">
                  Session-aware login flow with secure admin-only access.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <LockKeyhole size={16} />
                  Unified controls
                </div>
                <p className="text-sm text-text-muted">
                  Manage content, resources, announcements, and settings faster.
                </p>
              </div>
            </div>
          </section>

          <section className="admin-card auth-card w-full max-w-xl mx-auto rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.35),transparent_28%),radial-gradient(circle_at_top_right,rgba(1,105,111,0.28),transparent_28%),radial-gradient(circle_at_bottom,rgba(209,153,0,0.15),transparent_32%)]" />

            <div className="relative">
              <div className="mb-6 flex justify-center lg:hidden">
                <LoginBrand />
              </div>

              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl grid place-items-center bg-violet-500/15 border border-violet-500/20 shadow-lg">
                  <ShieldAlert size={24} className="text-violet-300" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="font-display text-3xl font-black tracking-tight mb-2">Admin Login</h2>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                  Sign in to access the private ThrillyVerse dashboard and manage platform content securely.
                </p>
              </div>

              {checkingSession ? (
                <div className="flex items-center justify-center py-12 text-text-muted gap-3">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Preparing secure session...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="form-label" htmlFor="admin-email">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        id="admin-email"
                        className="form-input pl-10"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@thrillyverse.com"
                        autoComplete="email"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="admin-password">
                      Password
                    </label>
                    <div className="relative">
                      <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        id="admin-password"
                        className="form-input pl-10 pr-11"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-[var(--color-text)] transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In to Admin'
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-white/10 bg-black/5 px-3 py-3 text-center">
                      <div className="text-xs uppercase tracking-[0.18em] text-text-muted">Security</div>
                      <div className="mt-1 text-sm font-semibold">Protected</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/5 px-3 py-3 text-center">
                      <div className="text-xs uppercase tracking-[0.18em] text-text-muted">Access</div>
                      <div className="mt-1 text-sm font-semibold">Admin Only</div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}