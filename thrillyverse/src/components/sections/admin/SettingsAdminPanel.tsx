'use client';
import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Users, Shield, User } from 'lucide-react';
import type { Profile } from '@/types';

export default function SettingsAdminPanel({ profile, allUsers }: { profile: Profile; allUsers: Profile[] }) {
  const [users, setUsers] = useState(allUsers);
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const updateName = async () => {
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);
    if (error) toast.error(error.message); else toast.success('Name updated!');
  };

  const changeRole = (userId: string, role: string) => {
    startTransition(async () => {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (error) { toast.error(error.message); return; }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u));
      toast.success('Role updated');
    });
  };

  const toggleActive = (userId: string, is_active: boolean) => {
    startTransition(async () => {
      const { error } = await supabase.from('profiles').update({ is_active: !is_active }).eq('id', userId);
      if (error) { toast.error(error.message); return; }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !is_active } as any : u));
      toast.success(is_active ? 'User deactivated' : 'User activated');
    });
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <h1 className="admin-page-title"><Shield size={20} className="admin-page-title-icon" /> Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="admin-section-card">
        <h2 className="admin-section-title"><User size={16} className="inline mr-2" />Your Profile</h2>
        <div className="form-grid-2 mt-4">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input type="text" className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input type="text" className="form-input" value={profile.role} disabled />
          </div>
        </div>
        <button onClick={updateName} className="btn btn-primary btn-sm mt-2">Save Changes</button>
      </div>

      {/* Users Table — super_admin only */}
      {profile.role === 'super_admin' && (
        <div className="admin-section-card">
          <h2 className="admin-section-title"><Users size={16} className="inline mr-2" />All Users</h2>
          <div className="table-wrapper mt-4">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-medium text-sm">{u.full_name ?? '—'}</td>
                    <td className="text-sm text-muted">{u.email}</td>
                    <td>
                      <select className="form-input text-xs py-1 px-2 h-auto"
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        disabled={u.id === profile.id || isPending}>
                        <option value="super_admin">super_admin</option>
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge text-xs ${(u as any).is_active ? 'badge-success' : 'badge-muted'}`}>
                        {(u as any).is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {u.id !== profile.id && (
                        <button onClick={() => toggleActive(u.id, (u as any).is_active)}
                          disabled={isPending} className="btn btn-ghost btn-sm text-xs">
                          {(u as any).is_active ? 'Deactivate' : 'Activate'}
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