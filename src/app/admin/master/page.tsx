'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUserRole, deleteUser } from '@/app/admin/master/actions'; // Import server actions
import { createClient } from '@/lib/supabase/client';

// Custom Profile type matching the profiles table
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  monthly_limit_remaining: number;
  created_at: string;
}

export default function MasterAdminDashboard() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const router = useRouter();
  // const supabase = createClient(); // No longer needed for these operations

  const [newUser, setNewUser] = useState({
    email: '',
    role: 'member' as 'member' | 'staff' | 'admin',
    full_name: '',
    monthly_limit_remaining: 30
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers(); // Call server action
      setUsers(fetchedUsers || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      await createUser(newUser); // Call server action
      setShowAddUserModal(false);
      setNewUser({ email: '', role: 'member', full_name: '', monthly_limit_remaining: 30 });
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      await updateUserRole(userId, newRole); // Call server action
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    setLoading(true);
    try {
      await deleteUser(userId); // Call server action
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Logout is still a client-side action
    const supabase = createClient(); // Re-initialize client for logout
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Master Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-6 mb-8 border border-glass-border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Master Admin Dashboard</h1>
              <p className="text-primary-300">Complete control over South Flowers Portal</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300 font-medium"
              >
                Add New User
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-semantic-error to-semantic-error/80 text-white px-6 py-3 rounded-xl hover:from-semantic-error/80 hover:to-semantic-error transition-all duration-300 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="backdrop-blur-sm bg-semantic-error/10 border border-semantic-error/20 rounded-xl p-4 mb-6">
            <p className="text-semantic-error">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-6 border border-glass-border">
          <h2 className="text-2xl font-bold text-white mb-6">All Users ({users.length})</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Monthly Limit</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-glass-border/50">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.full_name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                        className="bg-glass-bg border border-glass-border rounded-lg px-3 py-1 text-sm"
                        disabled={user.role === 'master_admin'}
                      >
                        <option value="member">Member</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="master_admin">Master Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">{user.monthly_limit_remaining}</td>
                    <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditUserModal(true);
                          }}
                          className="bg-primary-600 hover:bg-primary-500 px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Edit
                        </button>
                        {user.role !== 'master_admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-semantic-error hover:bg-semantic-error/80 px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-6 border border-glass-border max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Add New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="user@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Full Name</label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as ('member' | 'staff' | 'admin')})}
                  className="block w-full glass-input text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="member">Member</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Monthly Limit</label>
                <input
                  type="number"
                  value={newUser.monthly_limit_remaining}
                  onChange={(e) => setNewUser({...newUser, monthly_limit_remaining: parseInt(e.target.value)})}
                  className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300 font-medium"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 bg-glass-heavy text-white px-6 py-3 rounded-xl hover:bg-glass-border transition-all duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
