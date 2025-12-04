'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/Admin/AdminLayout'
import { SafeHydrate } from '@/components/SafeHydrate'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'subscriber'
  status: 'active' | 'inactive' | 'suspended'
  subscription?: {
    plan: string
    status: 'active' | 'cancelled' | 'expired'
    expiresAt: string
  }
  createdAt: string
  lastLogin?: string
  articleCount: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@maltaintellinews.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-12-04T09:30:00Z',
      articleCount: 0,
    },
    {
      id: '2',
      email: 'editor@maltaintellinews.com',
      name: 'Editor User',
      role: 'editor',
      status: 'active',
      createdAt: '2024-02-20T14:30:00Z',
      lastLogin: '2024-12-03T16:45:00Z',
      articleCount: 25,
    },
    {
      id: '3',
      email: 'subscriber@example.com',
      name: 'John Subscriber',
      role: 'subscriber',
      status: 'active',
      subscription: {
        plan: 'Premium',
        status: 'active',
        expiresAt: '2025-01-15T00:00:00Z',
      },
      createdAt: '2024-03-10T08:15:00Z',
      lastLogin: '2024-12-04T07:20:00Z',
      articleCount: 0,
    },
    {
      id: '4',
      email: 'inactive@example.com',
      name: 'Inactive User',
      role: 'subscriber',
      status: 'inactive',
      createdAt: '2024-01-05T12:00:00Z',
      lastLogin: '2024-10-15T11:30:00Z',
      articleCount: 0,
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers(mockUsers)
    } catch (err) {
      setError('Failed to load users')
      console.error('Users fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as User['role'] } : user
      ))
      setMessage({ type: 'success', text: 'User role updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user role' })
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as User['status'] } : user
      ))
      setMessage({ type: 'success', text: 'User status updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'subscriber': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow">
              <div className="h-12 bg-gray-200 rounded-t-lg"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <SafeHydrate>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add User
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="subscriber">Subscriber</option>
                </select>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(user.role)} border-0 focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="subscriber">Subscriber</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(user.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.subscription ? (
                          <div>
                            <div className="text-sm text-gray-900">{user.subscription.plan}</div>
                            <div className={`text-xs px-1 py-0.5 rounded-full inline-block ${
                              user.subscription.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.subscription.status}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.articleCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No users found matching your criteria</div>
            </div>
          )}
        </div>
      </SafeHydrate>
    </AdminLayout>
  )
}