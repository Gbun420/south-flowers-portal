import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js'; // Import User for typing

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get messages for current user
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      from_profile:profiles!messages_from_id_fkey(id, full_name, avatar_url), // Added id to from_profile
      to_profile:profiles!messages_to_id_fkey(id, full_name, avatar_url) // Added id to to_profile
    `)
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to_id, subject, content } = await request.json();

  if (!to_id || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert([{ from_id: user.id, to_id, subject, content }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(message);
}
