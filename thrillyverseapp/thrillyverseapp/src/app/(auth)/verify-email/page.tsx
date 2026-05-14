// src/app/(auth)/verify-email/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { resendVerificationEmail } from '@/lib/firebase/auth';
import { Mail, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if already verified
    if (user.emailVerified) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleResendEmail = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    setResendSuccess(false);

    const { error: sendError } = await resendVerificationEmail(user);

    if (sendError) {
      setError(sendError);
    } else {
      setResendSuccess(true);
    }

    setLoading(false);
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    setLoading(true);
    await user.reload();

    if (user.emailVerified) {
      router.push('/dashboard');
    } else {
      setError('Email not verified yet. Please check your inbox.');
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email 📬
          </h1>

          <p className="text-gray-600 mb-6">
            We&apos;ve sent a verification link to <strong>{user.email}</strong>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800 mb-2">📌 Next steps:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Return here and click &quot;I&apos;ve Verified&quot;</li>
            </ol>
          </div>

          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
              <CheckCircle className="inline w-4 h-4 mr-2" />
              Verification email sent!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  I&apos;ve Verified My Email
                </>
              )}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Resend Email
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Didn&apos;t receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
}