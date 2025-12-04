'use client';

import { useState, useEffect } from 'react';
import { getNewsArticles } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock categories data
    const mockCategories = [
      { id: 1, name: 'General', slug: 'general', articleCount: 245 },
      { id: 2, name: 'Tourism', slug: 'tourism', articleCount: 89 },
      { id: 3, name: 'Politics', slug: 'politics', articleCount: 156 },
      { id: 4, name: 'Technology', slug: 'technology', articleCount: 134 },
      { id: 5, name: 'Business', slug: 'business', articleCount: 78 },
      { id: 6, name: 'Health', slug: 'health', articleCount: 45 }
    ];
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Category Management</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <span className="text-sm text-gray-500">{category.articleCount} articles</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Slug: /{category.slug}</p>
                  <p>Description: {category.name} news and updates</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}