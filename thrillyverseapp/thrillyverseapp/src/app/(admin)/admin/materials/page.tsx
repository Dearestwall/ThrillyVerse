// src/app/(admin)/admin/materials/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Download, Search, Filter, Loader } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Material {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  fileType: string;
  downloads: number;
  uploadedBy: string;
  uploadedDate: string;
  status: 'published' | 'draft';
}

export default function AdminMaterialsPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    // Fetch materials from Firestore
    const mockMaterials: Material[] = [
      {
        id: '1',
        title: 'Biology Chapter 1 - Cell Structure',
        subject: 'Biology',
        chapter: 'Chapter 1',
        fileType: 'PDF',
        downloads: 450,
        uploadedBy: 'Admin',
        uploadedDate: '2024-01-20',
        status: 'published',
      },
      {
        id: '2',
        title: 'Chemistry Revision Notes',
        subject: 'Chemistry',
        chapter: 'All Chapters',
        fileType: 'PDF',
        downloads: 320,
        uploadedBy: 'Admin',
        uploadedDate: '2024-01-18',
        status: 'published',
      },
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaterials(mockMaterials);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      // TODO: Delete from Firestore and Storage
      setMaterials(materials.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || material.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['all', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Materials</h1>
            <p className="text-gray-600 mt-2">Upload and manage study materials</p>
          </div>
          <Link
            href="/admin/materials/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Material
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{material.title}</p>
                      <p className="text-sm text-gray-600">{material.chapter}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      {material.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{material.fileType}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Download className="w-4 h-4" />
                      <span>{material.downloads}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        material.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/materials/edit/${material.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}