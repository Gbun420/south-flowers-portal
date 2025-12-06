'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo / Header with 2026 design */}
        <header className="mb-12 text-center animate-fade-in">
          <div className="relative group mb-6 flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80 scale-110" />
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <Logo variant="icon" size={80} />
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-widest uppercase text-white mb-4">South Flowers</h1>
          <p className="text-sm tracking-[0.2em] text-primary-300 text-center">Cannabis Harm Reduction Association</p>
        </header>

        {/* Main Content */}
        <main className='w-full max-w-md space-y-12 text-center animate-slide-up'>
          
          {/* Login Section with 2026 glassmorphism */}
          <div className="grid grid-cols-2 gap-6">
            <Link href='/login' className='group relative block overflow-hidden rounded-xl border border-glass-border bg-glass-bg backdrop-blur-xl px-6 py-4 text-center font-medium text-primary-200 transition-all duration-300 hover:border-glass-heavy hover:bg-glass-heavy hover:text-white hover:shadow-lg hover:shadow-primary-900/25'>
              <span className="relative z-10 uppercase tracking-widest text-sm">Member Portal</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            </Link>
            <Link href='/staff/login' className='group relative block overflow-hidden rounded-xl border border-glass-border bg-glass-bg backdrop-blur-xl px-6 py-4 text-center font-medium text-primary-200 transition-all duration-300 hover:border-glass-heavy hover:bg-glass-heavy hover:text-white hover:shadow-lg hover:shadow-primary-900/25'>
              <span className="relative z-10 uppercase tracking-widest text-sm">Staff Portal</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            </Link>
          </div>

          {/* Info Section with 2026 glass cards */}
          <div className="space-y-6 text-sm font-light">
            <div className="backdrop-blur-xl bg-glass-bg rounded-2xl p-6 border border-glass-border shadow-lg shadow-primary-900/10">
              <h2 className="text-primary-400 uppercase text-xs font-bold tracking-widest mb-3">Location</h2>
              <p className="text-primary-200">Triq San Tumas 268<br />Fgura, FGR 1609</p>
            </div>

            <div className="backdrop-blur-xl bg-glass-bg rounded-2xl p-6 border border-glass-border shadow-lg shadow-primary-900/10">
              <h2 className="text-primary-400 uppercase text-xs font-bold tracking-widest mb-3">Hours</h2>
              <p className="text-primary-200">Mon - Fri: 10:00 - 20:00</p>
              <p className="text-primary-200">Sat: 10:00 - 13:00</p>
              <p className="text-primary-400">Sunday Closed</p>
            </div>

            <div className="backdrop-blur-xl bg-glass-bg rounded-2xl p-6 border border-glass-border shadow-lg shadow-primary-900/10">
              <h2 className="text-primary-400 uppercase text-xs font-bold tracking-widest mb-3">Contact</h2>
              <p className="text-primary-200">+356 2034 1508</p>
              <p className="text-primary-200">info@southflowers.mt</p>
            </div>

            <div className="pt-4">
              <Link href="/login" className="text-primary-300 border-b border-primary-600 hover:text-white hover:border-primary-400 transition-colors pb-1 inline-block">
                Join Waiting List
              </Link>
            </div>
          </div>
        </main>

        {/* Legal Footer */}
        <footer className="relative z-10 my-8 max-w-lg text-[10px] text-primary-400 uppercase tracking-wide leading-relaxed text-center backdrop-blur-sm bg-glass-bg/30 rounded-xl p-4 border border-glass-border">
          <p className="mb-2">South Flowers - Cannabis Harm Reduction Association</p>
          <p>Membership requires Maltese residency. Valid government-issued ID or residence card must be presented.</p>
        </footer>
      </div>
    </div>
  );
}