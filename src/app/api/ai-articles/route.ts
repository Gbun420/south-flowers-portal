import { articleGenerator } from '../../../lib/ai-generator';
import { articleStorage } from '../../../lib/storage';

export async function GET() {
  try {
    console.log('Starting AI article generation...');
    const newArticles = await articleGenerator.generateMultipleArticles(3);
    console.log(`Generated ${newArticles.length} articles`);
    
    // Add to shared storage
    articleStorage.addArticles(newArticles);
    
    return Response.json({
      success: true,
      data: newArticles,
      count: newArticles.length,
      message: 'AI-generated articles created successfully'
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return Response.json(
      { success: false, error: 'Failed to generate AI articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { category, customPrompt } = await request.json();
    
    const article = await articleGenerator.generateArticle(category, customPrompt);
    
    return Response.json({
      success: true,
      data: article,
      message: 'AI article generated successfully'
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return Response.json(
      { success: false, error: 'Failed to generate AI article' },
      { status: 500 }
    );
  }
}