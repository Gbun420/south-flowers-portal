import Parser from 'rss-parser';
import { prisma } from './prisma';

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  pubDate: Date;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
  isoDate?: string;
}

export class NewsAggregator {
  async fetchFromSource(sourceId: number, url: string): Promise<NewsItem[]> {
    try {
      console.log(`Fetching news from: ${url}`);
      
      const feed = await parser.parseURL(url);
      const items: NewsItem[] = feed.items.map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        content: item.content,
        contentSnippet: item.contentSnippet,
        categories: item.categories || [],
        isoDate: item.isoDate
      }));

      console.log(`Fetched ${items.length} items from ${url}`);
      return items;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      return [];
    }
  }

  async saveArticle(item: NewsItem, sourceId: number) {
    try {
      // Check if article already exists
      const existingArticle = await prisma.article.findUnique({
        where: { url: item.link }
      });

      if (existingArticle) {
        return existingArticle;
      }

      // Create new article
      const article = await prisma.article.create({
        data: {
          title: item.title,
          url: item.link,
          content: item.contentSnippet || item.content,
          publishedAt: item.pubDate,
          sourceId: sourceId,
          tags: JSON.stringify(item.categories || []),
          category: item.categories?.[0] || 'general',
          language: 'en'
        }
      });

      console.log(`Saved article: ${article.title}`);
      return article;
    } catch (error) {
      console.error('Error saving article:', error);
      return null;
    }
  }

  async aggregateAllSources() {
    try {
      console.log('Starting news aggregation...');
      
      // Get all active sources
      const sources = await prisma.newsSource.findMany({
        where: { isActive: true }
      });

      console.log(`Found ${sources.length} active sources`);

      for (const source of sources) {
        console.log(`Processing source: ${source.name}`);
        
        const items = await this.fetchFromSource(source.id, source.url);
        
        for (const item of items) {
          await this.saveArticle(item, source.id);
        }

        // Update last fetched timestamp
        await prisma.newsSource.update({
          where: { id: source.id },
          data: { lastFetched: new Date() }
        });
      }

      console.log('News aggregation completed');
    } catch (error) {
      console.error('Error in aggregation:', error);
    }
  }

  async getLatestArticles(limit: number = 20) {
    return await prisma.article.findMany({
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        source: {
          select: {
            name: true,
            url: true
          }
        }
      }
    });
  }

  async getArticlesByCategory(category: string, limit: number = 10) {
    return await prisma.article.findMany({
      where: { category },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        source: {
          select: {
            name: true,
            url: true
          }
        }
      }
    });
  }
}