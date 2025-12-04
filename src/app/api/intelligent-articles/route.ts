import { NextResponse } from 'next/server';
import { intelligentWorkflow } from '../../../lib/intelligent-workflow';
import { articleStorage } from '../../../lib/storage';

export async function POST(request: Request) {
  try {
    const { category, customPrompt } = await request.json();
    
    console.log(`[WORKFLOW] Generating intelligent article for category: ${category}`);
    
    // Get current articles for context
    const currentArticles = articleStorage.getArticles();
    const recentArticles = currentArticles.slice(-10); // Last 10 articles for context
    
    const article = await intelligentWorkflow.generateIntelligentArticle(category, recentArticles);
    
    // Add to storage
    articleStorage.addArticles([article]);
    
    return NextResponse.json({
      success: true,
      data: article,
      message: 'Intelligent article generated successfully',
      workflow: {
        stage: 'completed',
        analysis: article.analysis,
        compliance: article.complianceCheck,
        verification: article.verificationResult
      }
    });
  } catch (error) {
    console.error('[WORKFLOW] Intelligent generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate intelligent article'
    }, { status: 500 });
  }
}