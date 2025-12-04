'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  url: string;
  content?: string;
  publishedAt: string;
  category?: string;
  source: {
    name: string;
    url: string;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchArticles();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [category]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?category=${encodeURIComponent(category)}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCategoryTitle = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MediAI</h1>
              <p className="text-sm text-gray-600">AI-Powered Malta News Portal</p>
            </div>
            <div className="flex gap-2">
              <a
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Home
              </a>
              <a
                href="/admin/login"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Admin
              </a>
              <a
                href="/admin/intelligent-workflow"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                🧠 AI Workflow
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold mb-2">{getCategoryTitle(category)} News</h2>
          <p className="text-blue-100">Latest {getCategoryTitle(category)} updates from Malta</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading latest {getCategoryTitle(category)} news...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No {getCategoryTitle(category)} articles found at the moment.</div>
            <div className="animate-pulse text-blue-600 text-sm">Auto-refreshing content...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {article.category || 'general'}
                      </span>
                      {(article as any).isAIGenerated && (
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {article.source.name}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {article.title}
                    </a>
                  </h3>
                  
                  {article.content && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {article.content.substring(0, 150)}...
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}