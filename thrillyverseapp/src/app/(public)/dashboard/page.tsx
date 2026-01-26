// src/app/(public)/dashboard/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Mail, User, Calendar, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/lib/firebase/auth';
import { Loader } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userData, isAdmin, loading } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
      setSigningOut(false);
    }
  };

  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {userData?.displayName || 'User'}!</h1>
          <p className="text-gray-600 mt-2">Manage your ThrillyVerse account</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-indigo-600" />
                  Profile Information
                </h2>
              </div>
              <Link
                href="/dashboard/edit-profile"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            <div className="space-y-4">
              {/* Display Name */}
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Display Name
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {userData?.displayName || 'Not set'}
                </p>
              </div>

              {/* Email */}
              <div className="pb-4 border-b border-gray-200">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <Mail className="w-4 h-4" />
                  Email Address
                </p>
                <p className="text-lg text-gray-900 mt-1">{user.email}</p>
              </div>

              {/* Account Type */}
              <div className="pb-4">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <Shield className="w-4 h-4" />
                  Account Type
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg text-gray-900">
                    {isAdmin ? 'Administrator' : 'User'}
                  </span>
                  {isAdmin && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Join Date */}
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </p>
                <p className="text-lg text-gray-900 mt-1">{joinDate}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/materials"
                className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Browse Materials
              </Link>
              <Link
                href="/projects"
                className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
              >
                Contact Us
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block w-full text-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Security</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/change-password"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-center"
            >
              Change Password
            </Link>
            <Link
              href="/dashboard/privacy-settings"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-center"
            >
              Privacy Settings
            </Link>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {signingOut ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}