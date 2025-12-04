import cron from 'node-cron';
import Parser from 'rss-parser';
import { articleStorage, Article } from '../lib/storage';

const newsSources = [
  {
    name: 'Times of Malta',
    url: 'https://timesofmalta.com/rss'
  },
  {
    name: 'MaltaToday',
    url: 'https://www.maltatoday.com.mt/feed'
  },
  {
    name: 'Newsbook',
    url: 'https://newsbook.com.mt/feed'
  },
  {
    name: 'The Malta Independent',
    url: 'https://www.independent.com.mt/feed'
  },
  {
    name: 'TVM News',
    url: 'https://tvm.com.mt/news/rss'
  }
];

const parser = new Parser();

class NewsAggregatorService {
  private static instance: NewsAggregatorService;
  private isRunning: boolean = false;

  private constructor() {}

  static getInstance(): NewsAggregatorService {
    if (!NewsAggregatorService.instance) {
      NewsAggregatorService.instance = new NewsAggregatorService();
    }
    return NewsAggregatorService.instance;
  }

  async fetchFromSource(sourceName: string, url: string): Promise<Article[]> {
    try {
      console.log(`[AUTO] Fetching from: ${sourceName}`);
      
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 10); // Limit to 10 articles per source
      
      const articles: Article[] = [];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.title && item.link) {
          const article: Article = {
            id: Date.now() + Math.random(),
            title: item.title,
            url: item.link,
            content: item.contentSnippet || item.content,
            publishedAt: item.pubDate || new Date().toISOString(),
            category: item.categories?.[0] || 'general',
            source: {
              name: sourceName,
              url: url
            }
          };
          articles.push(article);
        }
      }
      
      console.log(`[AUTO] Fetched ${articles.length} items from ${sourceName}`);
      return articles;
    } catch (error) {
      console.error(`[AUTO] Error fetching from ${sourceName}:`, error);
      return [];
    }
  }

  async aggregateAllSources(): Promise<void> {
    if (this.isRunning) {
      console.log('[AUTO] Aggregation already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('[AUTO] Starting scheduled news aggregation...');
    
    try {
      const allNewArticles: Article[] = [];
      
      for (const source of newsSources) {
        const articles = await this.fetchFromSource(source.name, source.url);
        allNewArticles.push(...articles);
        
        // Add small delay between sources to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Sort by publication date and keep latest 50
      const sortedArticles = allNewArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 50);
      
      // Add to storage
      articleStorage.addArticles(sortedArticles);
      
      console.log(`[AUTO] Aggregation completed. Total new articles: ${sortedArticles.length}`);
      console.log(`[AUTO] Total articles in storage: ${articleStorage.getArticles().length}`);
      
    } catch (error) {
      console.error('[AUTO] Aggregation error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  startScheduler(): void {
    console.log('[AUTO] Starting news aggregation scheduler (every 30 minutes)');
    
    // Run immediately on start
    this.aggregateAllSources();
    
    // Schedule to run every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      console.log('[AUTO] Running scheduled news aggregation...');
      this.aggregateAllSources();
    });
    
    // Also run every hour at minute 0 for redundancy
    cron.schedule('0 * * * *', () => {
      console.log('[AUTO] Running hourly news aggregation...');
      this.aggregateAllSources();
    });
  }

  stopScheduler(): void {
    console.log('[AUTO] Stopping news aggregation scheduler');
    cron.getTasks().forEach(task => task.stop());
  }
}

// Start the scheduler when this module is imported
const aggregator = NewsAggregatorService.getInstance();
aggregator.startScheduler();

export default aggregator;