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
    const url = category ? `${API_BASE}/news?category=${category}` : `${API_BASE}/news`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Get single article by ID
 */
export async function getArticle(id: number): Promise<Article | null> {
  try {
    const response = await fetch(`${API_BASE}/news/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data.article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
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
 * Get admin analytics
 */
export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    const response = await fetch(`${API_BASE}/admin/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

/**
 * Get AI-generated articles
 */
export async function getAIArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE}/ai-articles`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch AI articles: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data.articles || [];
  } catch (error) {
    console.error('Error fetching AI articles:', error);
    return [];
  }
}

/**
 * Generate AI article
 */
export async function generateAIArticle(prompt: string): Promise<Article> {
  try {
    const response = await fetch(`${API_BASE}/ai-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate AI article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating AI article:', error);
    throw error;
  }
}

/**
 * Get intelligent workflow articles
 */
export async function getIntelligentArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE}/intelligent-articles`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch intelligent articles: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data.articles || [];
  } catch (error) {
    console.error('Error fetching intelligent articles:', error);
    return [];
  }
}

/**
 * Get workflow status
 */
export async function getWorkflowStatus(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/workflow/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workflow status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching workflow status:', error);
    throw error;
  }
}

/**
 * Get scheduler status
 */
export async function getSchedulerStatus(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/scheduler/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scheduler status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching scheduler status:', error);
    throw error;
  }
}

/**
 * Admin login
 */
export async function adminLogin(credentials: { email: string; password: string }): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
}