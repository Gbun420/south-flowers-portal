import { NextResponse } from 'next/server';
import { articleStorage } from '../../../../lib/storage';

export async function GET() {
  try {
    const stats = articleStorage.getStats();

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stats'
    }, { status: 500 });
  }
}