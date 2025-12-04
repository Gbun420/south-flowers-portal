import { prisma } from './prisma';

export const newsSources = [
  {
    name: 'Times of Malta',
    url: 'https://timesofmalta.com/rss',
    type: 'rss' as const,
    language: 'en',
    country: 'MT'
  },
  {
    name: 'MaltaToday',
    url: 'https://www.maltatoday.com.mt/rss',
    type: 'rss' as const,
    language: 'en',
    country: 'MT'
  },
  {
    name: 'Newsbook',
    url: 'https://newsbook.com.mt/rss',
    type: 'rss' as const,
    language: 'en',
    country: 'MT'
  },
  {
    name: 'The Malta Independent',
    url: 'https://www.independent.com.mt/rss',
    type: 'rss' as const,
    language: 'en',
    country: 'MT'
  },
  {
    name: 'Lovin Malta',
    url: 'https://lovinmalta.com/rss',
    type: 'rss' as const,
    language: 'en',
    country: 'MT'
  },
  {
    name: 'TVM News',
    url: 'https://tvm.com.mt/rss',
    type: 'rss' as const,
    language: 'mt',
    country: 'MT'
  }
];

export async function initializeNewsSources() {
  try {
    for (const source of newsSources) {
      await prisma.newsSource.upsert({
        where: { url: source.url },
        update: source,
        create: source
      });
    }
    console.log('News sources initialized successfully');
  } catch (error) {
    console.error('Error initializing news sources:', error);
  }
}