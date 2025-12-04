import { NextResponse } from 'next/server';
import { articleStorage } from '../../../../../lib/storage';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Remove article from storage
    const deleted = articleStorage.deleteArticle(id);
    
    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Article deleted successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete article'
    }, { status: 500 });
  }
}