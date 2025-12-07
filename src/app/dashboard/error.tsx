'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-semantic-error/20 rounded-full animate-pulse-slow" />
            <div className="relative w-16 h-16 bg-semantic-error/20 border-2 border-semantic-error rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-semantic-error" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-primary-300 mb-6">
            We encountered an error loading your dashboard. Please try again.
          </p>

          {error.message && (
            <div className="backdrop-blur-sm bg-semantic-error/10 border border-semantic-error/20 rounded-xl p-3 mb-6">
              <p className="text-semantic-error text-sm">{error.message}</p>
            </div>
          )}

          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <a
            href="/"
            className="mt-4 inline-block text-primary-300 hover:text-white transition-colors text-sm"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}