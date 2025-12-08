'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Logo from '@/components/Logo';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'magic' | 'password'>('magic');
  const router = useRouter();
  const supabase = createClient();

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // After successful sign-in, fetch profile to check role
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Failed to retrieve profile. Please contact support.');
        await supabase.auth.signOut();
      } else if (profile.role === 'staff' || profile.role === 'admin' || profile.role === 'master_admin') {
        if (profile.role === 'master_admin') {
          router.push('/admin/master');
        } else {
          router.push('/staff/dashboard');
        }
      } else {
        setError('You do not have staff access. Please log in as a member.');
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md backdrop-blur-xl bg-glass-bg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl shadow-primary-900/20">
          {/* Logo / Header */}
          <header className="mb-6 sm:mb-8 text-center animate-fade-in">
            <div className="relative group mb-4 sm:mb-6 flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80 scale-110" />
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <Logo variant="icon" size={48} className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-widest uppercase text-white mb-2">South Flowers</h1>
            <p className="text-primary-300 text-sm tracking-widest text-center uppercase font-medium">Staff Portal</p>
          </header>
        
          <form onSubmit={loginMethod === 'magic' ? handleMagicLinkLogin : handlePasswordLogin} className="space-y-4 sm:space-y-6">
            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-glass-heavy rounded-xl">
              <button
                type="button"
                onClick={() => setLoginMethod('magic')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  loginMethod === 'magic'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-primary-300 hover:text-white'
                }`}
              >
                Magic Link
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  loginMethod === 'password'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-primary-300 hover:text-white'
                }`}
              >
                Password
              </button>
            </div>

            <div>
              <label htmlFor="email" className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
                placeholder={loginMethod === 'password' ? 'bundyglenn@gmail.com' : 'staff@southflowers.mt'}
                required
              />
            </div>

            {loginMethod === 'password' && (
              <div>
                <label htmlFor="password" className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}

            {error && (
              <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success ? (
              <div className="backdrop-blur-sm bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <p className="text-green-400 font-medium mb-2">Magic Link Sent</p>
                <p className="text-primary-300 text-sm">Check your email ({email}) for a secure login link.</p>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (loginMethod === 'magic' ? 'Sending Magic Link...' : 'Signing in...') : (loginMethod === 'magic' ? 'Send Magic Link' : 'Sign In')}
              </button>
            )}
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <a href="/login" className="text-primary-300 hover:text-white transition-colors text-sm">
              ← Back to Member Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
