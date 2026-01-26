// src/app/(admin)/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, FileText, BookOpen, MessageSquare, Trophy,
  BarChart3, Settings, Loader, Plus
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalMaterials: number;
  totalComments: number;
  totalQuizzes: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    totalMaterials: 0,
    totalComments: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    // Fetch stats from Firestore
    const fetchStats = async () => {
      // TODO: Implement Firestore queries
      setStats({
        totalUsers: 150,
        totalProjects: 12,
        totalMaterials: 45,
        totalComments: 234,
        totalQuizzes: 8,
      });
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500', link: '/admin/users' },
    { icon: FileText, label: 'Projects', value: stats.totalProjects, color: 'bg-green-500', link: '/admin/projects' },
    { icon: BookOpen, label: 'Materials', value: stats.totalMaterials, color: 'bg-purple-500', link: '/admin/materials' },
    { icon: MessageSquare, label: 'Comments', value: stats.totalComments, color: 'bg-yellow-500', link: '/admin/comments' },
    { icon: Trophy, label: 'Quizzes', value: stats.totalQuizzes, color: 'bg-pink-500', link: '/admin/quizzes' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Project', link: '/admin/projects/new', color: 'bg-indigo-600' },
    { icon: Plus, label: 'Add Material', link: '/admin/materials/new', color: 'bg-purple-600' },
    { icon: Plus, label: 'Create Quiz', link: '/admin/quizzes/new', color: 'bg-pink-600' },
    { icon: Settings, label: 'Settings', link: '/admin/settings', color: 'bg-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your ThrillyVerse platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link
                key={idx}
                href={stat.link}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.link}
                  className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link href="/admin/activity" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-600">john.doe@example.com joined the platform</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}