'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('Auth error from URL:', error, errorDescription);
        setStatus('error');
        
        // Handle specific error types
        if (error === 'access_denied') {
          if (errorDescription?.includes('expired')) {
            router.push('/login?error=magic_link_expired');
          } else {
            router.push('/login?error=access_denied');
          }
        } else {
          router.push('/login?error=authentication_failed');
        }
        return;
      }

      if (!code) {
        console.error('No code in URL');
        setStatus('error');
        router.push('/login?error=no_code_provided');
        return;
      }

      try {
        const supabase = createClient();
        
        // Try to get session directly instead of code exchange
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (!sessionError && sessionData.session?.user) {
          console.log('Found existing session:', sessionData.session.user.id);
          await handleSuccessfulAuth(sessionData.session.user, supabase, router);
          return;
        }
        
        // If no session, try code exchange as fallback
        console.log('No existing session, trying code exchange...');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Auth exchange error:', exchangeError);
          setStatus('error');
          
          // Handle specific exchange errors
          if (exchangeError.message?.includes('expired')) {
            router.push('/login?error=magic_link_expired');
          } else if (exchangeError.message?.includes('invalid')) {
            router.push('/login?error=invalid_magic_link');
          } else {
            console.log('PKCE error, trying alternative approach...');
            // For PKCE issues, wait a bit and try to get session again
            setTimeout(async () => {
              const { data: retryData } = await supabase.auth.getSession();
              if (retryData.session?.user) {
                await handleSuccessfulAuth(retryData.session.user, supabase, router);
              } else {
                router.push('/login?error=auth_exchange_failed');
              }
            }, 1000);
            return;
          }
          return;
        }

        if (!data.user) {
          console.error('No user in response');
          setStatus('error');
          router.push('/login?error=no_user');
          return;
        }

        console.log('User authenticated successfully:', data.user.id, data.user.email);
        await handleSuccessfulAuth(data.user, supabase, router);
        
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        router.push('/login?error=unexpected_error');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Authentication failed</p>
          <button 
            onClick={() => router.push('/login')}
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}

async function handleSuccessfulAuth(user: any, supabase: any, router: any) {
  // Create profile if needed
  const profileData = {
    id: user.id,
    email: user.email || '',
    role: 'member',
    monthly_limit_remaining: 30,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown'
  };

  const { error: insertError } = await supabase
    .from('profiles')
    .insert(profileData);

  if (insertError && !insertError.message.includes('duplicate')) {
    console.error('Profile creation error:', insertError);
    router.push('/login?error=profile_creation_failed');
    return;
  }

  console.log('Authentication successful - redirecting to dashboard');
  router.push('/dashboard');
}
