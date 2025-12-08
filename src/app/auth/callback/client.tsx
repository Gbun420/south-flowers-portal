'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SupabaseClient, User } from '@supabase/supabase-js';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing) return;
      setIsProcessing(true);
      
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('Auth callback started:', { 
        code: !!code, 
        error, 
        errorDescription,
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing'
        }
      });

      if (error) {
        console.error('Auth error from URL:', error, errorDescription);
        setStatus('error');
        
        // Handle specific error types
        if (error === 'access_denied') {
          if (errorDescription?.includes('expired')) {
            router.push('/auth/error?error=magic_link_expired');
          } else {
            router.push('/auth/error?error=access_denied');
          }
        } else {
          router.push('/auth/error?error=authentication_failed');
        }
        return;
      }

      if (!code) {
        console.error('No code in URL');
        setStatus('error');
        router.push('/auth/error?error=no_code_provided');
        return;
      }

      try {
        setProgressStep(1);
        console.log('Environment check:', {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing'
        });
        
        const supabase = createClient();
        console.log('Supabase client created:', !!supabase);
        
        // For PKCE issues, try getting session first (Supabase handles PKCE automatically)
        setProgressStep(2);
        console.log('Checking for existing session...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (!sessionError && sessionData.session?.user) {
          console.log('Found existing session:', sessionData.session.user.id);
          setProgressStep(3);
          await handleSuccessfulAuth(sessionData.session.user, supabase, router);
          return;
        }
        
        // If no session, try code exchange
        console.log('No existing session, trying code exchange...');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        console.log('Code exchange result:', { 
          data: !!data, 
          error: exchangeError?.message,
          errorCode: exchangeError?.code,
          errorStatus: exchangeError?.status
        });
        
        if (exchangeError) {
          console.error('Auth exchange error:', exchangeError);
          setStatus('error');
          
          // Handle specific exchange errors
          if (exchangeError.message?.includes('expired')) {
            router.push('/auth/error?error=magic_link_expired');
          } else if (exchangeError.message?.includes('invalid') || exchangeError.message?.includes('bad_jwt')) {
            router.push('/auth/error?error=invalid_magic_link');
          } else {
            console.log('Auth error details:', {
              message: exchangeError.message,
              status: exchangeError.status,
              code: exchangeError.code
            });
            router.push('/auth/error?error=auth_exchange_failed');
          }
          return;
        }

        if (!data.user) {
          console.error('No user in response');
          setStatus('error');
          router.push('/auth/error?error=no_user');
          return;
        }

        console.log('User authenticated successfully:', data.user.id, data.user.email);
        setProgressStep(3);
        await handleSuccessfulAuth(data.user, supabase, router);
        
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        router.push('/login?error=unexpected_error');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-3">Authentication Failed</h2>
          <p className="text-gray-400 text-center mb-6">We couldn&apos;t complete your authentication. Please try again.</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const progressSteps = [
    'Initializing authentication...',
    'Verifying your credentials...',
    'Completing authentication...',
    'Setting up your profile...',
    'Almost there...'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center">
              <div className={`w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full ${isProcessing ? 'animate-spin' : ''}`}></div>
            </div>
            {isProcessing && (
              <div className="absolute inset-0 w-20 h-20 bg-blue-600/20 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Authenticating</h2>
        <p className="text-gray-400 text-center mb-6">
          {progressSteps[Math.min(progressStep, progressSteps.length - 1)]}
        </p>
        
        <div className="space-y-3">
          {progressSteps.slice(0, -1).map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                index < progressStep 
                  ? 'bg-green-600 text-white' 
                  : index === progressStep 
                  ? 'bg-blue-600 text-white animate-pulse' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {index < progressStep ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                index < progressStep ? 'text-green-400' : index === progressStep ? 'text-white' : 'text-gray-500'
              }`}>
                {step.replace('...', '')}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Please wait while we secure your session
          </p>
        </div>
      </div>
    </div>
  );
}

async function handleSuccessfulAuth(user: User, supabase: SupabaseClient, router: ReturnType<typeof useRouter>) {
  try {
    // Check if user profile exists and get role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create one for members
    if (profileError && profileError.code === 'PGRST116') {
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

      if (insertError) {
        console.error('Profile creation error:', insertError);
        // Clean up session on profile creation failure
        await supabase.auth.signOut();
        router.push('/auth/error?error=profile_creation_failed');
        return;
      }

      // Use the created profile data
      const newProfile = { role: 'member' };
      console.log('Authentication successful - redirecting based on role:', newProfile.role);
      
      if (newProfile.role === 'master_admin') {
        router.push('/admin/master');
      } else if (newProfile.role === 'staff' || newProfile.role === 'admin') {
        router.push('/staff/dashboard');
      } else {
        router.push('/dashboard');
      }
      return;
    } else if (profileError) {
      console.error('Profile fetch error:', profileError);
      await supabase.auth.signOut();
      router.push('/auth/error?error=profile_fetch_failed');
      return;
    }

    // Get the final profile data
    const { data: finalProfile, error: finalProfileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (finalProfileError || !finalProfile) {
      console.error('Final profile fetch error:', finalProfileError);
      await supabase.auth.signOut();
      router.push('/auth/error?error=profile_fetch_failed');
      return;
    }

    // Redirect based on role
    console.log('Authentication successful - redirecting based on role:', finalProfile.role);
    
    if (finalProfile.role === 'master_admin') {
      router.push('/admin/master');
    } else if (finalProfile.role === 'staff' || finalProfile.role === 'admin') {
      router.push('/staff/dashboard');
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Unexpected error in handleSuccessfulAuth:', error);
    await supabase.auth.signOut();
    router.push('/auth/error?error=unexpected_auth_error');
  }
}
