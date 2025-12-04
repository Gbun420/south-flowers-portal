import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ArticleTemplate {
  category: string;
  prompt: string;
  keywords: string[];
}

const maltaTemplates: ArticleTemplate[] = [
  {
    category: 'Politics',
    prompt: 'Write a balanced news article about current Maltese political developments. Include perspectives from both major parties (PL and PN) and focus on issues affecting Maltese citizens. Be factual and impartial.',
    keywords: ['politics', 'government', 'parliament', 'PL', 'PN', 'Malta']
  },
  {
    category: 'Business',
    prompt: 'Write a business news article about Malta\'s economy, focusing on tourism, iGaming, or local businesses. Include relevant statistics and expert opinions.',
    keywords: ['business', 'economy', 'tourism', 'iGaming', 'finance', 'Malta']
  },
  {
    category: 'Culture',
    prompt: 'Write an article about Maltese culture, traditions, or cultural events. Highlight unique aspects of Maltese heritage and contemporary cultural developments.',
    keywords: ['culture', 'traditions', 'festas', 'heritage', 'arts', 'Malta']
  },
  {
    category: 'Technology',
    prompt: 'Write a technology news article relevant to Malta, covering digital transformation, startups, or tech initiatives in the country.',
    keywords: ['technology', 'digital', 'innovation', 'startups', 'AI', 'Malta']
  },
  {
    category: 'Environment',
    prompt: 'Write an environmental article about Malta\'s climate challenges, conservation efforts, or sustainability initiatives. Include local context and specific Maltese environmental issues.',
    keywords: ['environment', 'climate', 'conservation', 'sustainability', 'Malta']
  }
];

const demoArticles = [
  {
    category: 'Politics',
    title: 'Malta Parliament Discusses New Digital Economy Strategy',
    content: 'Members of Parliament from both major parties have come together to discuss a comprehensive digital economy strategy for Malta. The proposed initiative aims to strengthen the country\'s position as a tech hub while ensuring digital inclusion for all citizens. Opposition leader expressed support for the framework while calling for stronger safeguards for small businesses.'
  },
  {
    category: 'Business',
    title: 'Malta Tourism Sector Shows Strong Recovery Signs',
    content: 'Recent statistics from the Malta Tourism Authority indicate a significant rebound in visitor numbers, with arrivals exceeding pre-pandemic levels by 15%. Hotel occupancy rates have improved particularly in the northern and southern regions, with stakeholders expressing optimism for the upcoming winter season.'
  },
  {
    category: 'Culture',
    title: 'Traditional Maltese Festas Gain UNESCO Recognition',
    content: 'Several Maltese religious festas have been submitted for UNESCO Intangible Cultural Heritage recognition. The celebrations, featuring unique fireworks displays and traditional music, represent centuries-old community traditions that continue to thrive across the islands.'
  },
  {
    category: 'Technology',
    title: 'Malta Tech Startup Ecosystem Receives EU Funding Boost',
    content: 'The European Commission has allocated €20 million to support Malta\'s growing technology startup ecosystem. The funding will focus on artificial intelligence, blockchain, and sustainable technology initiatives, with local universities partnering with private sector to drive innovation.'
  },
  {
    category: 'Environment',
    title: 'New Marine Conservation Areas Announced for Maltese Waters',
    content: 'The Environment Ministry has designated three new marine protected areas around the Maltese islands. These zones will safeguard critical habitats for endangered species while supporting sustainable fishing practices. Environmental groups have welcomed the initiative as a step forward for marine conservation.'
  }
];

export class AIArticleGenerator {
  private model: any;
  private demoMode: boolean;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    const envDemo = process.env.DEMO_MODE === 'true';
    
    // DEMO_MODE=true forces demo content even if an API key exists.
    // Otherwise, we auto-enable demo mode when there is no usable key.
    this.demoMode = envDemo || !apiKey || apiKey === 'your_gemini_api_key_here';
    
    console.log(`[AI] Demo mode: ${this.demoMode}, Env demo: ${envDemo}, API key exists: ${!!apiKey}`);
    
    if (!this.demoMode) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    }
  }

  async generateArticle(category: string, customPrompt?: string) {
    if (this.demoMode) {
      return this.generateDemoArticle(category);
    }

    try {
      const template = maltaTemplates.find(
        (t) => t.category.toLowerCase() === category.toLowerCase(),
      );
      const prompt =
        customPrompt || template?.prompt || `Write a news article about ${category} in Malta.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return this.parseArticleResponse(text, category);
    } catch (error) {
      // On any API error (including 429 quota), gracefully fall back to demo content
      console.error('Error generating article, falling back to demo article:', error);
      return this.generateDemoArticle(category);
    }
  }

  async generateMultipleArticles(count: number = 5) {
    const articles = [];
    const categories = maltaTemplates.map(t => t.category);

    console.log(`Demo mode: ${this.demoMode}`);
    console.log(`API Key exists: ${!!process.env.GEMINI_API_KEY}`);

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      try {
        console.log(`Generating article for ${category}...`);
        const article = await this.generateArticle(category);
        console.log(`Generated: ${article.title}`);
        articles.push(article);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        // generateArticle already does a demo fallback, so we should rarely end up here.
        console.error(`Failed to generate article for ${category}, skipping:`, error);
      }
    }

    return articles;
  }

  private parseArticleResponse(text: string, category: string) {
    // Extract title (first line or before first paragraph)
    const lines = text.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^#+\s*/, '').trim() || `Malta ${category} Update`;
    
    // Remove title from content
    const content = lines.slice(1).join('\n').trim();

    return {
      id: Date.now() + Math.random(),
      title,
      content,
      url: `https://mediai.mt/article/${Date.now()}`,
      publishedAt: new Date().toISOString(),
      category,
      source: {
        name: 'MediAI',
        url: 'https://mediai.mt'
      },
      isAIGenerated: true,
      credibility: 0.85,
      tags: [category.toLowerCase(), 'malta', 'ai-generated']
    };
  }

  private generateDemoArticle(category: string) {
    const demo = demoArticles.find(d => d.category === category) || demoArticles[0];
    
    return {
      id: Date.now() + Math.random(),
      title: demo.title,
      content: demo.content,
      url: `https://mediai.mt/article/${Date.now()}`,
      publishedAt: new Date().toISOString(),
      category,
      source: {
        name: 'MediAI',
        url: 'https://mediai.mt'
      },
      isAIGenerated: true,
      credibility: 0.85,
      tags: [category.toLowerCase(), 'malta', 'ai-generated']
    };
  }

  async generateTrendingArticle() {
    const trendingTopics = [
      'Malta tourism recovery',
      'iGaming industry developments',
      'Property market trends',
      'Digital innovation in Malta',
      'Environmental conservation efforts'
    ];

    const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
    
    const prompt = `Write a trending news article about: "${randomTopic}". Make it specific to Malta, include recent developments, and provide valuable insights for Maltese readers. Use a journalistic tone with proper structure.`;

    return this.generateArticle('Trending', prompt);
  }
}

export const articleGenerator = new AIArticleGenerator();