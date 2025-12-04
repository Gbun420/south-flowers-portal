export interface NewsSource {
  id: number;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'scrape';
  language: string;
  country: string;
  isActive: boolean;
  lastFetched?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: number;
  title: string;
  content?: string;
  summary?: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  sourceId: number;
  source?: NewsSource;
  category?: string;
  tags: string[];
  language: string;
  sentiment?: number;
  credibility?: number;
  isFactChecked: boolean;
  factCheckResult?: string;
  readCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trend {
  id: number;
  keyword: string;
  count: number;
  category?: string;
  timeframe: 'hourly' | 'daily' | 'weekly';
  date: Date;
  articles: number[];
  createdAt: Date;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  preferences?: {
    categories: string[];
    sources: number[];
    languages: string[];
  };
  readHistory: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsAggregatorConfig {
  sources: NewsSource[];
  updateInterval: number; // minutes
  maxArticlesPerSource: number;
  enableTranslation: boolean;
  enableFactCheck: boolean;
  enableSentimentAnalysis: boolean;
}