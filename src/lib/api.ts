/**
 * API Integration Layer
 * Connects to existing API endpoints
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  url: string;
  publishedAt: string;
  category: string;
  source: {
    name: string;
    url: string;
  };
  isAIGenerated?: boolean;
  credibility?: number;
  readCount?: number;
  status?: 'published' | 'draft' | 'archived';
  imageUrl?: string;
  externalUrl?: string;
}

export interface AdminAnalytics {
  totalArticles: number;
  aiUsage: number;
  activeUsers: number;
  systemHealth: string;
  lastUpdate: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  category: string;
  source: string;
  status: 'published' | 'draft' | 'archived';
  imageUrl?: string;
  externalUrl?: string;
}

/**
 * Get all news articles with optional filtering
 */
export async function getNewsArticles(category?: string): Promise<Article[]> {
  try {
    const url = category ? `${API_BASE}/news?category=${encodeURIComponent(category)}` : `${API_BASE}/news`;
    
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

/**
 * Get single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_BASE}/news`);
    const articles = await response.json();
    
    return articles.articles?.find((article: Article) => 
      generateArticleSlug(article.title) === slug
    ) || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * Get admin analytics data
 */
export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    const response = await fetch(`${API_BASE}/admin/stats`);
    const articlesResponse = await fetch(`${API_BASE}/news`);
    
    const analytics = await response.json();
    const articles = await articlesResponse.json();
    
    return {
      totalArticles: analytics?.totalArticles || articles.articles?.length || 0,
      aiUsage: analytics?.aiUsage || 0,
      activeUsers: analytics?.activeUsers || 0,
      systemHealth: analytics?.systemHealth || '100%',
      lastUpdate: analytics?.lastUpdate || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalArticles: 0,
      aiUsage: 0,
      activeUsers: 0,
      systemHealth: '0%',
      lastUpdate: new Date().toISOString()
    };
  }
}

/**
 * Create new article
 */
export async function createArticle(articleData: CreateArticleRequest): Promise<Article> {
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}
  try {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

/**
 * Update existing article
 */
export async function updateArticle(id: number, articleData: Partial<CreateArticleRequest>): Promise<Article> {
  try {
    const response = await fetch(`${API_BASE}/admin/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Delete article
 */
export async function deleteArticle(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/admin/articles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

/**
 * Get intelligent AI analysis
 */
export async function getIntelligentAnalysis(category: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/intelligent-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get AI analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    return null;
  }
}

/**
 * Generate article slug from title
 */
export function generateArticleSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}