'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('Auth callback:', { code: !!code, error, errorDescription });

        if (error) {
          console.error('Auth error:', error, errorDescription);
          setError(errorDescription || error);
          setStatus('error');
          return;
        }

        if (!code) {
          console.error('No code provided');
          setError('No authentication code provided');
          setStatus('error');
          return;
        }

        const supabase = createClient();
        
        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError);
          setError(exchangeError.message);
          setStatus('error');
          return;
        }

        if (!data.user) {
          console.error('No user in response');
          setError('Authentication failed - no user found');
          setStatus('error');
          return;
        }

        console.log('Auth successful for user:', data.user.email);

        // Check if user has a profile, create one if needed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
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
            setError('Failed to create user profile');
            setStatus('error');
            return;
          }

          // Redirect to member dashboard
          router.push('/dashboard');
          return;
        }

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setError('Failed to load user profile');
          setStatus('error');
          return;
        }

        // Redirect based on role
        switch (profile.role) {
          case 'master_admin':
            router.push('/admin/master');
            break;
          case 'staff':
          case 'admin':
            router.push('/staff/dashboard');
            break;
          default:
            router.push('/dashboard');
        }

      } catch (err) {
        console.error('Callback error:', err);
        setError('Unexpected error during authentication');
        setStatus('error');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-glass-bg rounded-2xl p-8 border border-glass-border backdrop-blur-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Failed</h2>
            <p className="text-primary-300 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-glass-heavy text-white border border-glass-border font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
