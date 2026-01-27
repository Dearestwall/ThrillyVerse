// src/app/(admin)/admin/page.tsx - ENHANCED ANIMATED VERSION
'use client';

import { useEffect, useState } from 'react';
import { getDocuments } from '@/lib/firebase/firestore';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  MessageSquare,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  BarChart3
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalMaterials: number;
  pendingMaterials: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalMaterials: 0,
    pendingMaterials: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, materials, messages] = await Promise.all([
        getDocuments('users', [], 'createdAt', 'desc', 1000),
        getDocuments('materials', [], 'createdAt', 'desc', 1000),
        getDocuments('messages', [], 'createdAt', 'desc', 1000),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pending = materials.filter((m: any) => m.data?.status === 'pending').length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unread = messages.filter((m: any) => !m.data?.read).length;

      setStats({
        totalUsers: users.length,
        totalMaterials: materials.length,
        pendingMaterials: pending,
        unreadMessages: unread,
      });

      setTimeout(() => setAnimateStats(true), 100);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Total Materials',
      value: stats.totalMaterials,
      icon: FileText,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-600',
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingMaterials,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      textColor: 'text-orange-600',
      change: stats.pendingMaterials > 0 ? 'Needs attention!' : 'All clear',
      changeColor: stats.pendingMaterials > 0 ? 'text-red-600' : 'text-green-600',
      pulse: stats.pendingMaterials > 0,
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-600',
      change: stats.unreadMessages > 0 ? 'New messages' : 'Up to date',
      changeColor: stats.unreadMessages > 0 ? 'text-blue-600' : 'text-gray-600',
      pulse: stats.unreadMessages > 0,
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all registered users',
      href: '/admin/users',
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      count: stats.totalUsers,
    },
    {
      title: 'Review Materials',
      description: 'Approve or reject uploaded materials',
      href: '/admin/materials',
      icon: FileText,
      gradient: 'from-purple-600 to-pink-600',
      count: stats.pendingMaterials,
      badge: stats.pendingMaterials > 0 ? 'Pending' : null,
    },
    {
      title: 'View Messages',
      description: 'Read and respond to user messages',
      href: '/admin/messages',
      icon: MessageSquare,
      gradient: 'from-green-600 to-emerald-600',
      count: stats.unreadMessages,
      badge: stats.unreadMessages > 0 ? 'New' : null,
    },
    {
      title: 'Analytics',
      description: 'View detailed platform analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      gradient: 'from-orange-600 to-red-600',
      count: '📊',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center animate-fade-in">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-primary-animated text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2 animate-slide-in-left">
            <Activity className="w-10 h-10 animate-pulse" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-indigo-100 animate-slide-in-left animate-delay-100">
            Monitor and manage platform activity • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className={`card-interactive overflow-hidden animate-slide-up animate-delay-${(index + 1) * 100} ${
              card.pulse ? 'animate-glow' : ''
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${card.bgColor} p-6 relative`}>
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                <div className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-full blur-2xl`}></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  {card.pulse && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-4xl font-bold ${card.textColor} mb-2 ${animateStats ? 'animate-pulse' : ''}`}>
                  {card.value}
                </p>

                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className={`w-4 h-4 ${card.changeColor}`} />
                  <span className={`font-semibold ${card.changeColor}`}>
                    {card.change}
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-3 h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000`}
                    style={{ width: animateStats ? '70%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-8 animate-slide-up animate-delay-300">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className={`card-interactive group border-2 border-gray-100 hover:border-transparent p-6 relative overflow-hidden animate-scale-in animate-delay-${(index + 1) * 100}`}
            >
              {/* Badge */}
              {action.badge && (
                <div className="absolute top-4 right-4">
                  <span className="badge badge-danger animate-bounce">
                    {action.badge}
                  </span>
                </div>
              )}

              <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl`}>
                <action.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gradient-static transition-all">
                {action.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {action.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}>
                  {action.count}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card p-6 animate-slide-in-left animate-delay-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Recent Users
            </h3>
            <Link href="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  U{i}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">User {i}</p>
                  <p className="text-xs text-gray-600">Joined {i} hours ago</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Pending Items */}
        <div className="card p-6 animate-slide-in-right animate-delay-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
              Pending Items
            </h3>
            <Link href="/admin/materials" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              Review
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.pendingMaterials > 0 ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Material {i}</p>
                    <p className="text-xs text-gray-600">Uploaded {i}h ago</p>
                  </div>
                  <span className="badge badge-warning">Pending</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">No pending approvals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}