// src/app/(user)/profile/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateDocument } from '@/lib/firebase/firestore';
import { uploadImageWithTransform, deleteFromCloudinary } from '@/lib/utils/uploadToCloudinary';
import { getAuth, updateProfile } from 'firebase/auth';
import { Camera, User, Mail, Book, School, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    class: user?.class || '',
    school: user?.school || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user?.subjects || []);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History', 'Geography'];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      let avatarUrl = user.avatar;

      // Upload new avatar if selected
      if (avatarFile) {
        setUploadingAvatar(true);

        // Delete old avatar if exists
        if (user.avatar) {
          const publicId = user.avatar.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteFromCloudinary(`thrillyverse/avatars/${publicId}`);
          }
        }

        // Upload new avatar
        const uploadResult = await uploadImageWithTransform(avatarFile, 'thrillyverse/avatars');
        if (uploadResult) {
          avatarUrl = uploadResult.secure_url;
        }
        setUploadingAvatar(false);
      }

      // Update Firestore
      await updateDocument('users', user.uid, {
        displayName: formData.displayName,
        bio: formData.bio,
        class: formData.class,
        school: formData.school,
        phoneNumber: formData.phoneNumber,
        subjects: selectedSubjects,
        avatar: avatarUrl,
      });

      // Update Firebase Auth profile
      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: avatarUrl,
        });
      }

      // Refresh user data
      await refreshUser();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
            <p className="text-indigo-100 mt-1">Update your information and preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                  {avatarPreview || user.avatar ? (
                    <Image
                      src={avatarPreview || user.avatar || ''}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                      <User className="w-12 h-12 text-indigo-600" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-600">JPG, PNG or WEBP. Max 5MB.</p>
                {uploadingAvatar && (
                  <p className="text-sm text-indigo-600 mt-1 flex items-center">
                    <Loader2 className="animate-spin w-4 h-4 mr-1" />
                    Uploading...
                  </p>
                )}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Class & School */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <div className="relative">
                  <Book className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select class</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your school name"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Subjects You&apos;re Studying
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedSubjects.includes(subject)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Profile updated successfully!
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}