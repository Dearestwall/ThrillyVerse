// src/components/layout/Navbar.tsx - COMPLETE VERSION
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  // Close menus on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/materials', label: 'Materials' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-xl">ThrillyVerse</h1>
              <p className="text-gray-200 text-xs">Think Beyond The Verse</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  pathname === link.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                  pathname?.startsWith('/admin')
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">
                      {user.displayName?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:inline text-white font-medium">
                    {user.displayName || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-2 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user.displayName}</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Settings</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-indigo-600" />
                          <span className="text-indigo-600 font-semibold">Admin Panel</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-2 rounded-lg font-medium transition-all',
                    pathname === link.href
                      ? 'bg-white/20 text-white'
                      : 'text-white/90 hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded-lg font-medium text-white/90 hover:bg-white/10"
                >
                  Admin Panel
                </Link>
              )}

              {!user && (
                <div className="space-y-2 pt-4 border-t border-white/20">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-center bg-white/10 text-white rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-center bg-white text-indigo-600 rounded-lg font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}