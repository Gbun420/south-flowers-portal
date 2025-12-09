'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, Package, MessageSquare, BarChart3, 
  Calendar, AlertTriangle, TrendingUp, CreditCard 
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/staff/StatCard';
import QuickActionsCard from '@/components/staff/QuickActionsCard';
import AlertsCard from '@/components/staff/AlertsCard';
import ActivityFeedCard from '@/components/staff/ActivityFeedCard'; // Import ActivityFeedCard

interface DashboardStats {
  totalMembers: number;
  activeToday: number;
  totalStaff: number;
  newThisMonth: number;
  pendingOrders: number;
  lowStockItems: number;
  unreadMessages: number;
  monthlyRevenue: number;
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeToday: 0,
    totalStaff: 0,
    newThisMonth: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    unreadMessages: 0,
    monthlyRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch all data in parallel
    const [
      membersData,
      ordersData,
      messagesData,
      strainsData,
      revenueData
    ] = await Promise.all([
      fetchMemberStats(),
      fetchOrderStats(),
      fetchMessageStats(),
      fetchStrainStats(),
      fetchRevenueData()
    ]);

    setStats({
      totalMembers: membersData.total,
      activeToday: membersData.activeToday,
      totalStaff: membersData.staffCount,
      newThisMonth: membersData.newThisMonth,
      pendingOrders: ordersData.pending,
      lowStockItems: strainsData.lowStock,
      unreadMessages: messagesData.unread,
      monthlyRevenue: revenueData.total
    });

    setRecentActivity(await fetchRecentActivity());
    setLoading(false);
  };

  // --- Data Fetching Functions ---

  const fetchMemberStats = useCallback(async () => {
    // Placeholder implementation
    return { total: 0, activeToday: 0, staffCount: 0, newThisMonth: 0 };
  }, []);

  const fetchOrderStats = useCallback(async () => {
    // Placeholder implementation
    return { pending: 0 };
  }, []);

  const fetchMessageStats = useCallback(async () => {
    // Placeholder implementation
    return { unread: 0 };
  }, []);

  const fetchStrainStats = useCallback(async () => {
    // Placeholder implementation
    return { lowStock: 0 };
  }, []);

  const fetchRevenueData = useCallback(async () => {
    // Placeholder implementation
    return { total: 0 };
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    // Placeholder implementation
    return [];
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading premium dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Staff Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your business overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Quick Actions
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">S</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Total Members"
            value={stats.totalMembers}
            trend="+12%"
            color="blue"
          />
          <StatCard
            icon={<Package className="h-6 w-6" />}
            title="Pending Orders"
            value={stats.pendingOrders}
            trend="+5"
            color="amber"
          />
          <StatCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Unread Messages"
            value={stats.unreadMessages}
            trend="+3"
            color="green"
          />
          <StatCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            trend="+8.2%"
            color="emerald"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActionsCard />
            <AlertsCard lowStockCount={stats.lowStockItems} />
          </div>

          {/* Middle Column - Activity & Performance */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeedCard activities={recentActivity} />
            <PerformanceChartCard />
          </div>
        </div>
      </div>
    </div>
  );
}