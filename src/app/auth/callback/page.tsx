import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; error?: string; error_description?: string };
}) {
  const supabase = createClient();

  console.log('Auth callback started:', { 
    code: !!searchParams.code, 
    error: searchParams.error, 
    errorDescription: searchParams.error_description 
  });

  // Handle errors from URL
  if (searchParams.error) {
    console.error('Auth error from URL:', searchParams.error, searchParams.error_description);
    
    if (searchParams.error === 'access_denied') {
      if (searchParams.error_description?.includes('expired')) {
        redirect('/auth/error?error=magic_link_expired');
      } else {
        redirect('/auth/error?error=access_denied');
      }
    } else {
      redirect('/auth/error?error=authentication_failed');
    }
  }

  if (!searchParams.code) {
    console.error('No code in URL');
    redirect('/auth/error?error=no_code_provided');
  }

  try {
    // Try to exchange code for session
    console.log('Exchanging code for session...');
    const { data, error } = await supabase.exchangeCodeForSession(searchParams.code!);
    
    if (error) {
      console.error('Auth exchange error:', error);
      
      if (error.message?.includes('expired')) {
        redirect('/auth/error?error=magic_link_expired');
      } else if (error.message?.includes('invalid') || error.message?.includes('bad_jwt')) {
        redirect('/auth/error?error=invalid_magic_link');
      } else {
        redirect('/auth/error?error=auth_exchange_failed');
      }
    }

    if (!data.user) {
      console.error('No user in response');
      redirect('/auth/error?error=no_user');
    }

    console.log('Authentication successful:', data.user.id, data.user.email);
    
    // Get or create user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      console.log('Profile not found, creating new profile...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email || '',
          role: 'member',
          monthly_limit_remaining: 30,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Unknown'
        });

      if (insertError) {
        console.error('Profile creation error:', insertError);
        await supabase.auth.signOut();
        redirect('/auth/error?error=profile_creation_failed');
      }
    }

    const userRole = profile?.role || 'member';
    console.log('Redirecting based on role:', userRole);
    
    // Redirect based on role
    if (userRole === 'master_admin') {
      redirect('/admin/master');
    } else if (userRole === 'staff' || userRole === 'admin') {
      redirect('/staff/dashboard');
    } else {
      redirect('/dashboard');
    }
    
  } catch (error) {
    console.error('Callback error:', error);
    redirect('/auth/error?error=unexpected_error');
  }
}