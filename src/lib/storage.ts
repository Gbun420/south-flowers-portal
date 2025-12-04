// Shared in-memory storage for demo purposes
// In production, this would be replaced with a proper database

export interface Article {
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
  isAIGenerated?: boolean;
  credibility?: number;
  aiConfidence?: number;
  tags?: string[];
  workflow?: any;
  complianceCheck?: any;
  verificationResult?: any;
}

class ArticleStorage {
  private static instance: ArticleStorage;
  private articles: Article[] = [];

  private constructor() {}

  static getInstance(): ArticleStorage {
    if (!ArticleStorage.instance) {
      ArticleStorage.instance = new ArticleStorage();
    }
    return ArticleStorage.instance;
  }

  addArticles(newArticles: Article[]): void {
    this.articles.push(...newArticles);
  }

  getArticles(): Article[] {
    return this.articles;
  }

  getArticlesByCategory(category: string): Article[] {
    return this.articles.filter(article => 
      article.category?.toLowerCase() === category.toLowerCase()
    );
  }

  deleteArticle(id: number): boolean {
    const initialLength = this.articles.length;
    this.articles = this.articles.filter(article => article.id !== id);
    return this.articles.length < initialLength;
  }

  getStats() {
    const totalArticles = this.articles.length;
    const aiArticles = this.articles.filter(a => a.isAIGenerated).length;
    const rssArticles = totalArticles - aiArticles;
    const lastUpdate = this.articles.length > 0 
      ? new Date(Math.max(...this.articles.map(a => new Date(a.publishedAt).getTime()))).toLocaleString()
      : '';

    return {
      totalArticles,
      aiArticles,
      rssArticles,
      lastUpdate
    };
  }

  clear(): void {
    this.articles = [];
  }
}

export const articleStorage = ArticleStorage.getInstance();