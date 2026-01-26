// src/app/(public)/materials/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download, BookOpen, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Material {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'image';
  downloads: number;
  uploadedBy: string;
  uploadedDate: string;
}

const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Biology Chapter 1 - Cell Structure',
    subject: 'Biology',
    chapter: 'Chapter 1',
    description: 'Comprehensive notes on cell structure and functions',
    fileType: 'pdf',
    downloads: 234,
    uploadedBy: 'Dr. Smith',
    uploadedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Chemistry Revision Guide',
    subject: 'Chemistry',
    chapter: 'All Chapters',
    description: 'Quick revision guide for all chemistry chapters',
    fileType: 'pdf',
    downloads: 456,
    uploadedBy: 'Prof. Johnson',
    uploadedDate: '2024-01-10',
  },
  {
    id: '3',
    title: 'Physics Important Questions',
    subject: 'Physics',
    chapter: 'Chapter 5-8',
    description: 'Collection of important questions from chapters 5-8',
    fileType: 'doc',
    downloads: 189,
    uploadedBy: 'Mr. Patel',
    uploadedDate: '2024-01-08',
  },
  {
    id: '4',
    title: 'Mathematics Formula Sheet',
    subject: 'Mathematics',
    chapter: 'All Chapters',
    description: 'All important formulas for Class 10 Mathematics',
    fileType: 'pdf',
    downloads: 678,
    uploadedBy: 'Ms. Singh',
    uploadedDate: '2024-01-05',
  },
];

const subjects = ['All', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English', 'History'];

export default function MaterialsPage() {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [materials] = useState<Material[]>(mockMaterials);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📋';
      case 'image':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">ICSE Materials</h1>
              <p className="text-gray-600 mt-2">
                Access comprehensive study materials for ICSE Class 10
              </p>
            </div>
            {isAdmin && (
              <Link
                href="/materials/upload"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                Upload Material
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-700">Filter by Subject:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSubject === subject
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                  <span className="text-3xl">{getFileIcon(material.fileType)}</span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-semibold">
                    {material.fileType.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{material.title}</h3>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Subject:</span> {material.subject}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Chapter:</span> {material.chapter}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{material.description}</p>

                  {/* Meta Info */}
                  <div className="border-t border-gray-200 pt-4 pb-4 text-sm text-gray-600">
                    <p>📤 Uploaded by {material.uploadedBy}</p>
                    <p>📅 {new Date(material.uploadedDate).toLocaleDateString()}</p>
                    <p>⬇️ {material.downloads} downloads</p>
                  </div>

                  {/* Download Button */}
                  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Upload CTA */}
        {!isAdmin && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Want to share your materials?</h3>
            <p className="text-lg mb-6 opacity-90">
              If you&apos;re an educator, you can upload materials to help other students learn.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Request Admin Access
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}