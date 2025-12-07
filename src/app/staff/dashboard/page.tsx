'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createMember } from '../dashboard/actions';

interface Member {
  id: string;
  email: string;
  full_name: string;
  residence_id_number?: string;
  membership_expiry?: string;
  monthly_limit_remaining: number;
  role: string;
  created_at: string;
}

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated: () => void;
}

function CreateMemberModal({ isOpen, onClose, onMemberCreated }: CreateMemberModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [residenceIdNumber, setResidenceIdNumber] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState(30);
  const [membershipExpiry, setMembershipExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createMember(email, fullName, residenceIdNumber, monthlyLimit, membershipExpiry);

    if (result.error) {
      setError(result.error);
    } else {
      onMemberCreated();
      onClose();
      // Reset form
      setEmail('');
      setFullName('');
      setResidenceIdNumber('');
      setMonthlyLimit(30);
      setMembershipExpiry('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
          Add New Member
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="member@example.com"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="residenceIdNumber" className="block text-sm font-medium text-gray-300 mb-2">Residence ID Number</label>
            <input
              type="text"
              id="residenceIdNumber"
              value={residenceIdNumber}
              onChange={(e) => setResidenceIdNumber(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="Optional: MT123456"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="monthlyLimit" className="block text-sm font-medium text-gray-300 mb-2">Monthly Limit (g)</label>
              <input
                type="number"
                id="monthlyLimit"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(parseInt(e.target.value))}
                min="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="membershipExpiry" className="block text-sm font-medium text-gray-300 mb-2">Membership Expiry</label>
              <input
                type="date"
                id="membershipExpiry"
                value={membershipExpiry}
                onChange={(e) => setMembershipExpiry(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:bg-white/10 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-semibold rounded-2xl hover:from-amber-500 hover:to-emerald-500 transition-all transform hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/staff/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (profileError || !profile || (profile.role !== 'staff' && profile.role !== 'admin')) {
        router.push('/dashboard');
        return;
      }

      setUser(authUser);
      fetchMembers();
    };

    checkAuth();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching members:', fetchError.message);
      setError('Failed to fetch members.');
      setMembers([]);
    } else {
      setMembers(data as Member[]);
    }
    setLoading(false);
  };

  const handleSendMagicLink = async (email: string) => {
    console.log(`Sending magic link to: ${email}`);
    console.log('This would call Supabase Admin API to send magic link');
    
    // For now, we'll use the client-side API
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(`Failed to send magic link: ${error.message}`);
    } else {
      alert(`Magic link sent to ${email}. The member can now set up their account.`);
    }
  };

  if (loading && !user) return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
  </div>;

  if (error && !user) return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                  Staff Dashboard
                </h1>
                <p className="text-gray-300">Manage members, inventory, and operations</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/staff/inventory')}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:bg-white/10 transition-all"
                >
                  Inventory
                </button>
                <button
                  onClick={() => router.push('/staff/orders')}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:bg-white/10 transition-all"
                >
                  Orders
                </button>
                <button
                  onClick={() => router.push('/staff/members')}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:bg-white/10 transition-all"
                >
                  Members
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Members</p>
                  <p className="text-3xl font-bold text-white">{members.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-amber-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Active Today</p>
                  <p className="text-3xl font-bold text-white">{members.filter(m => m.role === 'member').length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-400/20 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Staff Members</p>
                  <p className="text-3xl font-bold text-white">{members.filter(m => m.role === 'staff' || m.role === 'admin').length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-400/20 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">New This Month</p>
                  <p className="text-3xl font-bold text-white">
                    {members.filter(m => {
                      const createdAt = new Date(m.created_at);
                      const thisMonth = new Date();
                      return createdAt.getMonth() === thisMonth.getMonth() && 
                             createdAt.getFullYear() === thisMonth.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-400/20 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Member Management</h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-semibold rounded-2xl hover:from-amber-500 hover:to-emerald-500 transition-all transform hover:scale-105"
              >
                Add New Member
              </button>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-300">No members found. Add your first member to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Name</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Role</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Monthly Limit</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Member Since</th>
                      <th className="text-left py-4 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b border-white/5">
                        <td className="py-4 px-4 text-white">{member.full_name || 'Not set'}</td>
                        <td className="py-4 px-4 text-gray-300">{member.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.role === 'admin' 
                              ? 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                              : member.role === 'staff'
                              ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                              : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{member.monthly_limit_remaining}g</td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(member.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSendMagicLink(member.email)}
                              className="px-3 py-1 bg-amber-400/20 text-amber-300 rounded-lg hover:bg-amber-400/30 transition-all text-sm"
                            >
                              Send Magic Link
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateMemberModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMemberCreated={fetchMembers}
      />
    </div>
  );
}
