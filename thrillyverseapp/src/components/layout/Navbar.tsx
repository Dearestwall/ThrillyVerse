// src/components/layout/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, userData, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/materials', label: 'ICSE Material' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="ThrillyVerse Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
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
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/20'
                )}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg font-medium bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-all"
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30"
                >
                  <User className="w-4 h-4" />
                  <span>{userData?.displayName || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/20"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg font-medium bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    pathname === link.href
                      ? 'bg-white text-indigo-600'
                      : 'text-white hover:bg-white/20'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium bg-yellow-500 text-gray-900"
                >
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-white/20 pt-2 mt-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-lg text-white hover:bg-white/20"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 rounded-lg text-white hover:bg-red-500"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-lg text-white hover:bg-white/20"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-lg bg-white text-indigo-600"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}