'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';

interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  url: string;
  category: string;
  source: {
    name: string;
    url: string;
  };
  publishedAt: string;
  isAIGenerated?: boolean;
  credibility?: number;
  readCount?: number;
  status?: 'published' | 'draft' | 'archived';
}

interface FilterState {
  category: string;
  status: string;
  search: string;
  dateRange: string;
}

function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    status: 'all',
    search: '',
    dateRange: 'all'
  });
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockArticles: Article[] = [
      {
        id: 1,
        title: 'Malta Tourism Exceeds Pre-Pandemic Levels',
        content: 'Latest tourism statistics show Malta has surpassed pre-pandemic visitor numbers by 15%...',
        summary: 'Tourism recovery exceeds expectations with strong occupancy rates.',
        url: 'https://mediai.mt/tourism-2024',
        category: 'Tourism',
        source: { name: 'MediAI', url: 'https://mediai.mt' },
        publishedAt: '2024-12-04T10:30:00Z',
        isAIGenerated: true,
        credibility: 0.88,
        readCount: 1247,
        status: 'published'
      },
      {
        id: 2,
        title: 'Parliament Discusses Digital Economy Strategy',
        content: 'Malta\'s Parliament is currently debating comprehensive legislation aimed at strengthening...',
        summary: 'New digital economy strategy under parliamentary discussion.',
        url: 'https://mediai.mt/digital-economy',
        category: 'Politics',
        source: { name: 'Times of Malta', url: 'https://timesofmalta.com' },
        publishedAt: '2024-12-04T09:15:00Z',
        isAIGenerated: false,
        credibility: 0.92,
        readCount: 892,
        status: 'published'
      },
      {
        id: 3,
        title: 'Malta Financial Services Sector Expands',
        content: 'Malta\'s financial services sector is experiencing significant expansion...',
        summary: 'Financial services sector sees major expansion and international investment.',
        url: 'https://mediai.mt/financial-services',
        category: 'Business',
        source: { name: 'MediAI', url: 'https://mediai.mt' },
        publishedAt: '2024-12-04T08:45:00Z',
        isAIGenerated: true,
        credibility: 0.85,
        readCount: 756,
        status: 'published'
      }
    ];

    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredArticles = articles.filter(article => {
    if (filters.category !== 'all' && article.category !== filters.category) return false;
    if (filters.status !== 'all' && article.status !== filters.status) return false;
    if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(a => a.id));
    }
  };

  const handleSelectArticle = (id: number) => {
    setSelectedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(aid => aid !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (ids: number[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} article(s)?`)) {
      // In production, call API
      setArticles(prev => prev.filter(a => !ids.includes(a.id)));
      setSelectedArticles([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status?: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedArticles.length === filteredArticles.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              {selectedArticles.length} selected
            </span>
          </div>
          
          {selectedArticles.length > 0 && (
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Selected
              </button>
              <button 
                onClick={() => handleDelete(selectedArticles)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === filteredArticles.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredArticles.map(article => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => handleSelectArticle(article.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </div>
                    {article.summary && (
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {article.summary}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{article.source.name}</div>
                  {article.isAIGenerated && (
                    <div className="text-xs text-purple-600">AI Generated</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusBadge(article.status)}`}>
                      {article.status || 'published'}
                    </span>
                    {article.credibility && (
                      <span className="text-xs text-gray-500">
                        {Math.round(article.credibility * 100)}% credible
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {article.readCount?.toLocaleString() || '0'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(article.publishedAt)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete([article.id])}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No articles found</div>
          <div className="text-sm text-gray-400">Try adjusting your filters</div>
        </div>
      )}
    </div>
  );
}

export default function ArticlesManagement() {
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  return (
    <AdminLayout currentPath="/admin/articles">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Article Management</h1>
        <p className="text-gray-600">Manage and analyze news content</p>
      </div>
      
      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + New Article
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              📥 Import
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              📤 Export
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="Tourism">Tourism</option>
              <option value="Politics">Politics</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
            </select>
            
            <select 
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <input 
              type="text"
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64"
            />
          </div>
        </div>
      </div>
      
      {/* Articles Table */}
      <ArticleTable />
    </AdminLayout>
  );
}