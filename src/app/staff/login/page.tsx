'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
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
        await supabase.auth.signOut(); // Log out if profile lookup fails
                } else if (profile.role === 'staff' || profile.role === 'admin') {
                  router.push('/staff/orders');      } else {
        setError('You do not have staff access. Please log in as a member.');
        await supabase.auth.signOut(); // Log out if not staff
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20">
          {/* Logo / Header */}
          <header className="mb-8 text-center animate-fade-in">
            <div className="relative group mb-6 flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80 scale-110" />
              <div className="relative w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/25 transition-transform duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-2xl">SF</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-widest uppercase text-white mb-2">South Flowers</h1>
            <p className="text-primary-300 text-sm tracking-widest text-center uppercase font-medium">Staff Portal</p>
          </header>
        
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
                placeholder="staff@southflowers.mt"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs text-primary-400 uppercase tracking-wider mb-2 block font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full glass-input text-white px-4 py-3 rounded-xl placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="backdrop-blur-sm bg-semantic-error/10 border border-semantic-error/20 rounded-xl p-3">
                <p className="text-semantic-error text-sm">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-primary-300 hover:text-white transition-colors text-sm">
              ← Back to Member Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
