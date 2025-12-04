import { NextResponse } from 'next/server';
import { intelligentWorkflow } from '../../../../lib/intelligent-workflow';
import { articleStorage } from '../../../../lib/storage';

export async function GET() {
  try {
    const status = await intelligentWorkflow.getWorkflowStatus();
    
    return NextResponse.json({
      success: true,
      status: status.active,
      data: status
    });
  } catch (error) {
    console.error('Workflow status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get workflow status'
    }, { status: 500 });
  }
}