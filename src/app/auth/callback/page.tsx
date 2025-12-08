'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
          setError(errorDescription || errorParam);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code provided');
          setStatus('error');
          return;
        }

        // PKCE flow: Exchange code for session
        const supabase = createClient();
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError);
          setError(exchangeError.message);
          setStatus('error');
          return;
        }

        if (!data.user) {
          setError('No user found after code exchange');
          setStatus('error');
          return;
        }

        // Get user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              role: 'member'
            });

          if (insertError) {
            console.error('Profile creation error:', insertError);
            setError('Failed to create user profile');
            setStatus('error');
            return;
          }

          // New member, redirect to dashboard
          setStatus('success');
          router.push('/dashboard');
          return;
        }

        // Redirect based on role
        setStatus('success');
        if (profile?.role === 'staff' || profile?.role === 'master_admin') {
          router.push('/staff/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('Unexpected error occurred');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-primary-300 mb-4">{error || 'An error occurred during authentication'}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Login
            </button>
            <button
              onClick={() => router.push('/auth/error')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Error Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Authenticating...</h2>
        <p className="text-primary-300">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}