'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const messageParam = urlParams.get('message');
    let newError: string | null = null;

    if (errorParam) {
      switch (errorParam) {
        case 'magic_link_expired':
          newError = 'Magic link has expired. Please request a new one.';
          break;
        case 'access_denied':
          newError = 'Access denied. Please try logging in again.';
          break;
        default:
          newError = 'Authentication failed. Please try again.';
          break;
      }
    } else if (messageParam === 'auth_received') {
      newError = 'Authentication received! You can now log in.';
    }

    if (newError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(newError);
      // Clean URL parameters to prevent re-triggering the effect
      // and ensure the error is shown only once without issues.
      router.replace(window.location.pathname);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isStaffLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      } else {
        router.push('/staff/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMagicLinkSent(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md backdrop-blur-xl bg-glass-bg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl shadow-primary-900/20">
          <header className="mb-6 sm:mb-8 text-center animate-fade-in">
            <div className="relative group mb-4 sm:mb-6 flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80 scale-110" />
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <Logo variant="icon" size={48} className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-widest uppercase text-white mb-2">South Flowers</h1>
          </header>
        
          {!magicLinkSent ? (
            <>
              <p className="text-primary-300 text-sm tracking-widest text-center mb-6 sm:mb-8 uppercase font-medium">
                {isStaffLogin ? 'Staff Portal' : 'Member Portal'}
              </p>
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
                    placeholder={isStaffLogin ? 'staff@southflowers.mt' : 'member@southflowers.mt'}
                    required
                  />
                </div>
                {isStaffLogin && (
                  <div>
                    <label htmlFor="password" className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}
                {error && (
                  <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 font-bold uppercase tracking-wider py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isStaffLogin ? 'Login' : 'Send Magic Link')}
                </button>
              </form>
              <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-primary-400">
                {isStaffLogin ? (
                  <a href="#" onClick={() => setIsStaffLogin(false)} className="text-primary-300 hover:text-white transition-colors">
                    Back to Member Portal
                  </a>
                ) : (
                  <>
                    New to South Flowers? Contact our staff to register. {' '}
                    <a href="#" onClick={() => setIsStaffLogin(true)} className="text-primary-300 hover:text-white transition-colors">
                      Staff Portal
                    </a>
                  </>
                )}
              </p>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Magic Link Sent</h2>
              <p className="text-primary-300 mb-6 text-sm sm:text-base">
                Check your email ({email}) for a secure login link.
              </p>
              <button
                onClick={() => {
                  setMagicLinkSent(false);
                  setLoading(false);
                  setError(null);
                }}
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
