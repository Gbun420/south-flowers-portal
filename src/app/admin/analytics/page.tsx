'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/Admin/AdminLayout'
import { getNewsArticles } from '@/lib/api'
import { SafeHydrate } from '@/components/SafeHydrate'

interface AnalyticsData {
  totalArticles: number
  totalViews: number
  totalUsers: number
  revenue: number
  articlesByCategory: { [key: string]: number }
  viewsOverTime: { date: string; views: number }[]
  topArticles: { id: string; title: string; views: number }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock analytics data for now - replace with real API call
      const articles = await getNewsArticles()
      const mockAnalytics: AnalyticsData = {
        totalArticles: articles.length,
        totalViews: Math.floor(Math.random() * 10000) + 5000,
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        articlesByCategory: {
          politics: Math.floor(Math.random() * 50) + 10,
          business: Math.floor(Math.random() * 40) + 8,
          technology: Math.floor(Math.random() * 30) + 5,
          sports: Math.floor(Math.random() * 45) + 12,
          entertainment: Math.floor(Math.random() * 35) + 7,
        },
        viewsOverTime: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000) + 500,
        })),
        topArticles: articles.slice(0, 5).map(article => ({
          id: article.id.toString(),
          title: article.title,
          views: Math.floor(Math.random() * 1000) + 100,
        })),
      }
      setAnalytics(mockAnalytics)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/stats?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !analytics) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error || 'No analytics data available'}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.totalArticles.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.totalViews.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.totalUsers.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-lg p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">${analytics.revenue.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Articles by Category */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Articles by Category</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(analytics.articlesByCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / analytics.totalArticles) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Articles */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Articles</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.topArticles.map((article, index) => (
                    <div key={article.id} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                        <p className="text-sm text-gray-500">{article.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Views Over Time */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Views Over Time</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Chart visualization would go here</p>
                <p className="text-sm mt-2">Data points: {analytics.viewsOverTime.length}</p>
              </div>
            </div>
          </div>
        </div>
      </SafeHydrate>
    </AdminLayout>
  )
}