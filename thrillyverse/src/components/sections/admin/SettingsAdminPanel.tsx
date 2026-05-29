'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Users, Shield, User } from 'lucide-react';
import type { Profile } from '@/types';

export default function SettingsAdminPanel({
  profile,
  allUsers,
}: {
  profile: Profile;
  allUsers: Profile[];
}) {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>(allUsers);
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [isPending, startTransition] = useTransition();

  const updateName = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id);

    if (error) {
      toast.error(error.message || 'Failed to update profile');
      return;
    }

    toast.success('Profile updated');
  };

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    startTransition(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);

      if (error) {
        toast.error(error.message || 'Failed to update user');
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                is_active: !isActive,
              }
            : u
        )
      );

      toast.success(isActive ? 'User deactivated' : 'User activated');
    });
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          <Shield size={20} className="admin-page-title-icon" /> Settings
        </h1>
      </div>

      <div className="admin-section-card">
        <h2 className="admin-section-title">
          <User size={16} className="inline mr-2" />
          Your Profile
        </h2>

        <div className="form-grid-2 mt-4">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={profile.email ?? ''} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input type="text" className="form-input" value={profile.role ?? ''} disabled />
          </div>
        </div>

        <button onClick={updateName} className="btn btn-primary btn-sm mt-2">
          Save Changes
        </button>
      </div>

      {profile.role === 'super_admin' && (
        <div className="admin-section-card">
          <h2 className="admin-section-title">
            <Users size={16} className="inline mr-2" />
            All Users
          </h2>

          <div className="table-wrapper mt-4">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name || '—'}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-success' : 'badge-muted'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      {u.id !== profile.id && (
                        <button
                          type="button"
                          onClick={() => toggleUserActive(u.id, !!u.is_active)}
                          disabled={isPending}
                          className="btn btn-ghost btn-sm text-xs"
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}