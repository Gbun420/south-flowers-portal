'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-md w-full backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">SF</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-primary-300 text-sm">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300 font-medium"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="block w-full bg-glass-heavy text-white border border-glass-border px-6 py-3 rounded-xl hover:border-glass-heavy hover:bg-glass-heavy transition-all duration-300 font-medium text-center"
          >
            Return home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-primary-400 cursor-pointer hover:text-primary-300">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-primary-500 bg-primary-900/50 rounded p-2 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
