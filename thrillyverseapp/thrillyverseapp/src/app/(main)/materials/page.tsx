// src/app/(main)/materials/page.tsx - BROWSE MATERIALS
'use client';

import { useEffect, useState } from 'react';
import { getDocuments } from '@/lib/firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Search, Download, FileText, Calendar, User, BookOpen, Upload } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  type: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploaderName: string;
  downloads: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}

export default function MaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials, searchQuery, classFilter, subjectFilter, typeFilter]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const materialsData = await getDocuments(
        'materials',
        [{ field: 'status', operator: '==', value: 'approved' }],
        'createdAt',
        'desc',
        1000
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedMaterials = materialsData.map((doc: any) => ({
        id: doc.id,
        ...doc.data,
      }));
      setMaterials(formattedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter((m) => m.class === classFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter((m) => m.subject === subjectFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((m) => m.type === typeFilter);
    }

    setFilteredMaterials(filtered);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const subjects = [...new Set(materials.map((m) => m.subject))];
  const classes = ['9', '10', '11', '12'];
  const types = ['Notes', 'Assignment', 'Question Paper', 'Reference', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
          <p className="text-indigo-100">
            Browse and download study materials shared by students
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Class Filter */}
            <div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600 mb-6">
              {materials.length === 0 
                ? 'Be the first to upload materials!'
                : 'Try adjusting your filters'
              }
            </p>
            {user && (
              <Link href="/upload" className="btn btn-primary">
                <Upload className="w-4 h-4" />
                Upload Material
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {material.description}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-primary">{material.class}</span>
                  <span className="badge badge-info">{material.subject}</span>
                  <span className="badge badge-success">{material.type}</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{material.uploaderName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {material.createdAt?.toDate && 
                        material.createdAt.toDate().toLocaleDateString()
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{material.downloads || 0} downloads • {formatFileSize(material.fileSize)}</span>
                  </div>
                </div>

                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}