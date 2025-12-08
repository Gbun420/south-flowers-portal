import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; error?: string; error_description?: string };
}) {
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
    // Use client-side Supabase for auth callback
    const supabase = createClient();
    console.log('Supabase client created:', !!supabase);
    
    // Try to exchange code for session
    console.log('Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(searchParams.code!);
    
    console.log('Code exchange result:', { 
      data: !!data, 
      error: error?.message,
      user: data?.user?.id 
    });
    
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
    
    // For now, just redirect to login with a success message
    console.log('Auth callback completed - redirecting to login');
    redirect('/login?message=auth_received');
    
  } catch (error) {
    console.error('Callback error:', error);
    redirect('/auth/error?error=unexpected_error');
  }
}