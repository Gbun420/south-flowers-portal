import { createClient } from '@/lib/supabase/server';
import { createOrUpdateProfile } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    const result = await createOrUpdateProfile(user);

    if (!result.success) {
      return NextResponse.json({ error: (result.error as any)?.message || 'Profile creation failed' }, { status: 500 });
    }

    return NextResponse.json({ profile: result.profile });
  } catch (error) {
    console.error('Error in create-profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}