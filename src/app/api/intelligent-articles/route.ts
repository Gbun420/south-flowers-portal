import { NextResponse } from 'next/server';
import { AIService } from '../../../lib/services/aiService';
import { articleStorage } from '../../../lib/storage';

export async function POST(request: Request) {
  try {
    const { category } = await request.json();
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category parameter is required'
      }, { status: 400 });
    }
    
    console.log(`[AI_SERVICE] Generating intelligent article for category: ${category}`);
    
    // Get current articles for context
    const currentArticles = articleStorage.getArticles();
    const recentArticles = currentArticles.slice(-10); // Last 10 articles for context
    
    const aiService = AIService.getInstance();
    const article = await aiService.generateIntelligentArticle(category, recentArticles);
    
    // Add to storage
    articleStorage.addArticles([article]);
    
    return NextResponse.json({
      success: true,
      data: article,
      message: 'Intelligent article generated successfully',
      aiService: aiService.getStatus(),
      workflow: {
        stage: 'completed',
        analysis: article.analysis,
        compliance: article.complianceCheck,
        verification: article.verificationResult,
        demoMode: article.demoMode || false
      }
    });
  } catch (error: any) {
    console.error('[AI_SERVICE] Intelligent generation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate intelligent article',
      fallback: true
    }, { status: 500 });
  }
}