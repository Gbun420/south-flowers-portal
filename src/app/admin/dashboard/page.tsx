'use client';

import React from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

function StatCard({ title, value, trend, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className="text-sm mt-1 font-medium">
              {trend.startsWith('+') ? (
                <span className="text-green-600">↑ {trend}</span>
              ) : trend.startsWith('-') ? (
                <span className="text-red-600">↓ {trend}</span>
              ) : (
                <span className="text-gray-600">→ {trend}</span>
              )}
            </p>
          )}
        </div>
        <div className="text-3xl opacity-50">{icon}</div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function QuickAction({ title, description, icon, href, color }: QuickActionProps) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  return (
    <a
      href={href}
      className={`
        block p-4 rounded-lg text-white transition-all duration-200
        hover:scale-105 hover:shadow-lg
        ${colorClasses[color]}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </a>
  );
}

interface RecentActivity {
  id: string;
  type: 'article' | 'user' | 'ai' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

function RecentActivityTable() {
  const activities: RecentActivity[] = [
    {
      id: '1',
      type: 'article',
      title: 'New article published',
      description: 'Malta Tourism Exceeds Pre-Pandemic Levels',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      user: 'AI System'
    },
    {
      id: '2',
      type: 'ai',
      title: 'AI analysis completed',
      description: 'Analyzed 15 articles for tourism category',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: 'AI Engine'
    },
    {
      id: '3',
      type: 'user',
      title: 'New user registered',
      description: 'User from Valletta joined platform',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      user: 'Registration'
    },
    {
      id: '4',
      type: 'system',
      title: 'System backup completed',
      description: 'Daily backup successful',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      user: 'System'
    }
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      article: '📰',
      user: '👥',
      ai: '🤖',
      system: '⚙️'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y">
        {activities.map(activity => (
          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="text-xl mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  {activity.user && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIPerformanceChart() {
  const metrics = [
    { label: 'Analysis Accuracy', value: 94, color: 'bg-green-500' },
    { label: 'Processing Speed', value: 87, color: 'bg-blue-500' },
    { label: 'Content Quality', value: 91, color: 'bg-purple-500' },
    { label: 'User Satisfaction', value: 88, color: 'bg-yellow-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">AI Performance Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map(metric => (
          <div key={metric.label} className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(metric.value / 100) * 176} 176`}
                  className={metric.color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{metric.value}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>
      
      <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-sm">Performance trend chart</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const user = {
    name: 'Administrator',
    email: 'admin@mediai.mt',
    role: 'admin'
  };

  return (
    <AdminLayout user={user} currentPath="/admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your Malta AI News Portal.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Articles"
          value="1,247"
          trend="+12%"
          icon="📰"
          color="blue"
        />
        <StatCard
          title="AI Analysis"
          value="89%"
          trend="+5%"
          icon="🤖"
          color="purple"
        />
        <StatCard
          title="Active Users"
          value="2,458"
          trend="+8%"
          icon="👥"
          color="green"
        />
        <StatCard
          title="System Health"
          value="100%"
          trend="Stable"
          icon="✅"
          color="green"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            title="New Article"
            description="Create a new article"
            icon="✍️"
            href="/admin/articles/new"
            color="blue"
          />
          <QuickAction
            title="AI Analysis"
            description="Run AI analysis"
            icon="🤖"
            href="/admin/ai"
            color="purple"
          />
          <QuickAction
            title="Import Content"
            description="Bulk import articles"
            icon="📥"
            href="/admin/articles/import"
            color="green"
          />
          <QuickAction
            title="View Analytics"
            description="Detailed reports"
            icon="📊"
            href="/admin/analytics"
            color="orange"
          />
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityTable />
        <AIPerformanceChart />
      </div>
    </AdminLayout>
  );
}