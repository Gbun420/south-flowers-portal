'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '../../../lib/storage';

export default function IntelligentWorkflowDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('Malta');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);

  const categories = [
    { value: 'Malta', label: '🇲 Malta Local', color: 'blue' },
    { value: 'International', label: '🌍 International', color: 'green' },
    { value: 'Financial', label: '💰 Financial', color: 'yellow' },
    { value: 'Sports', label: '⚽ Sports', color: 'purple' }
  ];

  const workflowStages = [
    { name: 'News Aggregation', icon: '📡', status: 'active' },
    { name: 'Context Analysis', icon: '🧠', status: 'active' },
    { name: 'Article Generation', icon: '✍️', status: 'active' },
    { name: 'Compliance Check', icon: '⚖️', status: 'active' },
    { name: 'AI Verification', icon: '🤖', status: 'active' }
  ];

  useEffect(() => {
    fetchWorkflowStatus();
    fetchArticles();
  }, []);

  const fetchWorkflowStatus = async () => {
    try {
      const response = await fetch('/api/workflow/status');
      const data = await response.json();
      if (data.success) {
        setWorkflowStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch workflow status:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const generateIntelligentArticle = async () => {
    setIsGenerating(true);
    setGeneratedArticle(null);

    try {
      const response = await fetch('/api/intelligent-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          customPrompt: customPrompt || undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedArticle(data.data);
        await fetchArticles(); // Refresh articles list
        await fetchWorkflowStatus(); // Refresh workflow status
      }
    } catch (error) {
      console.error('Failed to generate intelligent article:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteArticle = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchArticles();
        await fetchWorkflowStatus();
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🧠 MediAI Intelligence</h1>
              <span className="ml-4 text-sm text-gray-500">Advanced Workflow Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                Simple Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Workflow Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔄 Workflow Status</h2>
              
              {workflowStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workflowStatus.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflowStatus.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last run: {workflowStatus.lastRun ? new Date(workflowStatus.lastRun).toLocaleString() : 'Never'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Version: {workflowStatus.version}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Loading workflow status...
                </div>
              )}

              {/* Workflow Stages */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Active Stages</h3>
                <div className="space-y-2">
                  {workflowStages.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{stage.icon}</span>
                        <span className="text-sm font-medium">{stage.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stage.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Intelligent Article Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🤖 Intelligent Article Generator</h2>
              
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    News Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Prompt (Optional)
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter custom instructions for article generation..."
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateIntelligentArticle}
                  disabled={isGenerating}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                    isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : `bg-${getCategoryColor(selectedCategory)}-600 hover:bg-${getCategoryColor(selectedCategory)}-700`
                  }`}
                >
                  {isGenerating ? '🔄 Generating...' : '🚀 Generate Intelligent Article'}
                </button>
              </div>

              {/* Generated Article Preview */}
              {generatedArticle && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">📄 Generated Article</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-blue-700">Title:</span>
                      <p className="text-sm text-blue-900 mt-1">{generatedArticle.title}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-700">Category:</span>
                      <p className="text-sm text-blue-900 mt-1">{generatedArticle.category}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-700">AI Confidence:</span>
                      <p className="text-sm text-blue-900 mt-1">{generatedArticle.aiConfidence}%</p>
                    </div>
                    {generatedArticle.workflow && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <h4 className="text-xs font-medium text-blue-700 mb-2">🔍 Workflow Analysis</h4>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Sentiment:</span>
                            <span>{generatedArticle.workflow.analysis?.sentiment}</span>
                          </div>
                          <div>
                            <span className="font-medium">Bias:</span>
                            <span>{generatedArticle.workflow.analysis?.bias}</span>
                          </div>
                          <div>
                            <span className="font-medium">Legal:</span>
                            <span className={generatedArticle.workflow.compliance?.isLegal ? 'text-green-600' : 'text-red-600'}>
                              {generatedArticle.workflow.compliance?.isLegal ? '✅ Compliant' : '⚠️ Review Needed'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Verified:</span>
                            <span className={generatedArticle.workflow.verification?.verified ? 'text-green-600' : 'text-red-600'}>
                              {generatedArticle.workflow.verification?.verified ? '✅ Verified' : '❌ Issues Found'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Articles Management */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                📰 All Articles ({articles.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AI Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.slice(0, 20).map((article) => (
                      <tr key={article.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {article.title}
                            {article.isAIGenerated && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                AI
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.category === 'Malta' ? 'bg-blue-100 text-blue-800' :
                            article.category === 'International' ? 'bg-green-100 text-green-800' :
                            article.category === 'Financial' ? 'bg-yellow-100 text-yellow-800' :
                            article.category === 'Sports' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.source?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.aiConfidence ? `${article.aiConfidence}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => window.open(article.url, '_blank')}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          {article.isAIGenerated && (
                            <button
                              onClick={() => deleteArticle(article.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}