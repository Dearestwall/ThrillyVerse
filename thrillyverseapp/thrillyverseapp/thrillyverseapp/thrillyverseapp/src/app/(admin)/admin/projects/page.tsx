// src/app/(admin)/admin/projects/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  isAdmin: boolean;
  loading: boolean;
};

/**
 * Minimal local useAuth stub to remove build-time error.
 * Replace this with your real auth hook implementation.
 */
function useAuth(): AuthState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = React.useState<AuthState>({
    user: null,
    isAdmin: true,
    loading: false,
  });

  useEffect(() => {
    // Optionally perform real auth lookup here and call setState(...)
    // Example:
    // setState({ user: { name: 'Admin' }, isAdmin: true, loading: false });
  }, []);

  return state;
}
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search, Filter, Loader } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  status: 'active' | 'coming-soon';
  tags: string[];
  icon: string;
  createdAt: string;
  views: number;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'coming-soon'>('all');

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    // Fetch projects from Firestore
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Calculator',
        description: 'Simple arithmetic calculator',
        link: '/projects/calculator',
        status: 'active',
        tags: ['Tool', 'Math'],
        icon: '🧮',
        createdAt: '2024-01-15',
        views: 450,
      },
      {
        id: '2',
        title: 'Tic Tac Toe',
        description: 'Classic game with AI',
        link: '/projects/tic-tac-toe',
        status: 'active',
        tags: ['Game', 'AI'],
        icon: '🎮',
        createdAt: '2024-01-10',
        views: 320,
      },
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(mockProjects);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      // TODO: Delete from Firestore
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
            <p className="text-gray-600 mt-2">Create and manage your projects</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Project
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
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{project.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{project.title}</p>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {project.status === 'active' ? 'Active' : 'Coming Soon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{project.views}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={project.link}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/projects/edit/${project.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
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