// src/app/dashboard/page.tsx - ENHANCED ANIMATED VERSION
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  BookOpen, 
  Upload, 
  Award, 
  TrendingUp, 
  Settings,
  Shield,
  Sparkles,
  LogOut,
  Calendar,
  Clock,
  Target,
  Zap,
  Star,
  Trophy
} from 'lucide-react';
import { signOut } from '@/lib/firebase/auth';

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useAuth() as any;
  const { user, userData, loading } = auth;
  const router = useRouter();
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setTimeout(() => setAnimateStats(true), 100);
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center animate-fade-in">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = userData?.role === 'admin' || userData?.role === 'superadmin';

  const stats = [
    {
      label: 'Materials Downloaded',
      value: userData?.stats?.materialsDownloaded || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+12%',
    },
    {
      label: 'Materials Uploaded',
      value: userData?.stats?.materialsUploaded || 0,
      icon: Upload,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+8%',
    },
    {
      label: 'Quizzes Completed',
      value: userData?.stats?.quizzesTaken || 0,
      icon: Award,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+15%',
    },
    {
      label: 'Total Points',
      value: userData?.stats?.totalPoints || 0,
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      trend: '+20%',
    },
  ];

  const quickLinks = [
    {
      title: 'Browse Materials',
      description: 'Explore study resources',
      href: '/materials',
      icon: BookOpen,
      gradient: 'from-blue-600 to-cyan-600',
      delay: '100',
    },
    {
      title: 'Upload Material',
      description: 'Share your notes',
      href: '/upload',
      icon: Upload,
      gradient: 'from-purple-600 to-pink-600',
      delay: '200',
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      href: '/quizzes',
      icon: Award,
      gradient: 'from-green-600 to-emerald-600',
      delay: '300',
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      href: '/settings',
      icon: Settings,
      gradient: 'from-gray-600 to-slate-600',
      delay: '400',
    },
  ];

  const achievements = [
    { name: 'First Upload', icon: Star, color: 'text-yellow-500', unlocked: true },
    { name: '10 Downloads', icon: Target, color: 'text-blue-500', unlocked: true },
    { name: 'Quiz Master', icon: Trophy, color: 'text-purple-500', unlocked: false },
    { name: 'Speed Learner', icon: Zap, color: 'text-green-500', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Header */}
      <div className="bg-gradient-primary-animated text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-10 h-10 animate-bounce" />
                <h1 className="text-4xl font-bold">
                  Welcome back, {userData?.displayName || 'Student'}!
                </h1>
              </div>
              <p className="text-indigo-100 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {userData?.class ? `Class ${userData.class}` : 'Ready to learn?'} • 
                <Clock className="w-5 h-5 ml-2" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Admin Button with Animation */}
            {isAdmin && (
              <Link
                href="/admin"
                className="btn bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl animate-scale-in animate-glow"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card - Animated */}
        <div className="card p-6 mb-8 animate-fade-in hover-lift">
          <div className="flex items-center gap-4">
            <div className="relative">
              {userData?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userData.photoURL}
                  alt={userData.displayName}
                  className="w-20 h-20 rounded-full ring-4 ring-indigo-100 hover:ring-indigo-300 transition-all"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-4 ring-indigo-100 animate-pulse">
                  <span className="text-3xl font-bold text-white">
                    {userData?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{userData?.displayName}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <span>{userData?.email}</span>
              </p>
              <div className="flex gap-2 mt-2">
                <span className="badge badge-primary animate-scale-in">
                  {userData?.role || 'user'}
                </span>
                {userData?.class && (
                  <span className="badge badge-info animate-scale-in animate-delay-100">
                    Class {userData.class}
                  </span>
                )}
                <span className="badge badge-success animate-scale-in animate-delay-200">
                  ⭐ Active
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary hover-lift"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid - Animated */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`stat-card animate-slide-up animate-delay-${(index + 1) * 100}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-xl ${stat.bgColor} bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent ${animateStats ? 'animate-pulse' : ''}`}>
                {stat.value}
              </p>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                  style={{ width: animateStats ? `${Math.min((stat.value / 100) * 100, 100)}%` : '0%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links - Animated */}
        <div className="card p-6 mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={`card-interactive p-6 border-2 border-gray-100 hover:border-transparent group animate-scale-in animate-delay-${link.delay}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gradient-static transition-all">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Achievements Section - NEW */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="card p-6 animate-slide-in-left">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.name}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-md'
                      : 'bg-gray-50 opacity-50'
                  } animate-fade-in animate-delay-${(index + 1) * 100}`}
                >
                  <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-white shadow-sm' : 'bg-gray-200'}`}>
                    <achievement.icon className={`w-5 h-5 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{achievement.name}</p>
                    {achievement.unlocked && (
                      <p className="text-xs text-green-600">✓ Unlocked</p>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <span className="text-2xl animate-bounce">🎉</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6 animate-slide-in-right">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-500" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-500 rounded-full">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Downloaded &quot;Physics Notes&quot;</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                <div className="p-2 bg-green-500 rounded-full">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Completed &quot;Math Quiz&quot;</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Uploaded &quot;Chemistry Notes&quot;</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}