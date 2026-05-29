'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/common/Logo';
import { Eye, EyeOff, Loader2, ShieldAlert, LockKeyhole, Mail } from 'lucide-react';

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
        // ignore
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
    <div className="min-h-screen flex items-center justify-center auth-grid-bg p-6">
      <div className="admin-card auth-card w-full max-w-md p-8 page-enter relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.4),transparent_30%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_32%)]" />

        <div className="relative">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full grid place-items-center bg-violet-500/15 border border-violet-500/25 shadow-lg">
              <ShieldAlert size={22} className="text-violet-300" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-sm text-text-muted text-center mb-6">
            Sign in to manage ThrillyVerse securely.
          </p>

          {checkingSession ? (
            <div className="flex items-center justify-center py-10 text-text-muted gap-2">
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
                    className="form-input pl-9"
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
                    className="form-input pl-9 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}