// src/components/layout/Navbar.tsx - SIMPLIFIED NO AUTH
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ThrillyVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/materials" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Materials
            </Link>
            <Link href="/quizzes" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Quizzes
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Community
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              About
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/materials"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Materials
            </Link>
            <Link
              href="/quizzes"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Quizzes
            </Link>
            <Link
              href="/community"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/login"
              className="block px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}