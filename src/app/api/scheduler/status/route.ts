import { NextResponse } from 'next/server';
import { articleStorage } from '../../../../lib/storage';

export async function GET() {
  try {
    const stats = articleStorage.getStats();
    const now = new Date();
    const lastUpdate = stats.lastUpdate ? new Date(stats.lastUpdate) : null;
    const minutesSinceLastUpdate = lastUpdate ? Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60)) : -1;

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        schedulerActive: true,
        minutesSinceLastUpdate,
        nextUpdateIn: minutesSinceLastUpdate >= 0 ? 30 - (minutesSinceLastUpdate % 30) : 30
      }
    });
  } catch (error) {
    console.error('Scheduler status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get scheduler status'
    }, { status: 500 });
  }
}