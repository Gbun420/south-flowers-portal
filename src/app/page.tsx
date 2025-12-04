'use client';

import { useState, useEffect } from 'react';
import { getNewsArticles } from '@/lib/api';
import { SafeHydrate } from '@/components/SafeHydrate';
import { Article } from '@/lib/api';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    
    // Auto-refresh every 30 seconds to get latest articles
    const interval = setInterval(() => {
      fetchArticles();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articles = await getNewsArticles();
      setArticles(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };





  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <SafeHydrate>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MaltaIntelliNews</h1>
              <p className="text-sm text-gray-600">Intelligent News Aggregation for Malta</p>
            </div>
            <div className="flex gap-2">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading latest news...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Welcome to MediAI! Loading your personalized Malta news...</div>
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
    </SafeHydrate>
  );
}
