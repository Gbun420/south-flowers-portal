'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'magic_link_expired':
        return 'Your magic link has expired. Please request a new one.';
      case 'invalid_magic_link':
        return 'This magic link is invalid or has already been used.';
      case 'access_denied':
        return 'Access was denied. Please try again.';
      case 'auth_exchange_failed':
        return 'Authentication failed. Please try logging in again.';
      case 'no_code_provided':
        return 'No authentication code provided. Please try again.';
      case 'no_user':
        return 'User not found. Please sign up first.';
      case 'profile_creation_failed':
        return 'Failed to create your profile. Please contact support.';
      case 'profile_fetch_failed':
        return 'Failed to load your profile. Please try again.';
      case 'unexpected_auth_error':
        return 'An unexpected error occurred. Please try again.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

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
        
        <h2 className="text-2xl font-bold text-center mb-3">Authentication Error</h2>
        <p className="text-gray-400 text-center mb-6">
          {getErrorMessage(error)}
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-6">
          You will be redirected to the login page in 10 seconds
        </p>
      </div>
    </div>
  );
}