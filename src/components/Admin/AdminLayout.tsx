'use client';

import React from 'react';
import { SafeHydrate } from '@/components/SafeHydrate';
import { BrandName } from '@/components/Logo';

interface AdminHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <BrandName showTagline={false} />
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-lg">⚙️</span>
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 
                            rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.name || 'Administrator'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.role || 'admin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

interface AdminSidebarProps {
  currentPath?: string;
}

export function AdminSidebar({ currentPath = '/admin' }: AdminSidebarProps) {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊', 
      href: '/admin',
      description: 'System overview'
    },
    { 
      id: 'articles', 
      label: 'Articles', 
      icon: '📰', 
      href: '/admin/articles',
      description: 'Content management'
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      icon: '🏷️', 
      href: '/admin/categories',
      description: 'Category management'
    },
    { 
      id: 'ai-analysis', 
      label: 'AI Analysis', 
      icon: '🤖', 
      href: '/admin/ai',
      description: 'AI performance'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: '👥', 
      href: '/admin/users',
      description: 'User management'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: '📈', 
      href: '/admin/analytics',
      description: 'Reports & insights'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      href: '/admin/settings',
      description: 'System configuration'
    },
  ];

  const isActive = (href: string) => {
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen border-r">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg 
                  transition-all duration-200 group
                  ${isActive(item.href) 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                {isActive(item.href) && (
                  <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
                )}
              </a>
            </li>
          ))}
        </ul>
        
        {/* System Status */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">System Online</span>
          </div>
          <p className="text-xs text-green-600">All services operational</p>
          <div className="mt-2 text-xs text-gray-600">
            <div>Uptime: 99.9%</div>
            <div>Last check: Just now</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Stats</h4>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex justify-between">
              <span>Articles:</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span>AI Analysis:</span>
              <span className="font-medium">89%</span>
            </div>
            <div className="flex justify-between">
              <span>Users:</span>
              <span className="font-medium">2,458</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
  };
  currentPath?: string;
}

export function AdminLayout({ children, user, currentPath }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SafeHydrate>
        <AdminHeader user={user} />
        <div className="flex">
          <AdminSidebar currentPath={currentPath} />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </SafeHydrate>
    </div>
  );
}