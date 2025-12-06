'use client';

import { QrCode, UserCircle, CalendarCheck, Leaf, Sparkles, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function MemberCardPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock member data
  const memberData = {
    name: 'Alex Thompson',
    memberId: 'SF-2024-1337',
    memberSince: '2024',
    expiryDate: 'Dec 31, 2025',
    monthlyAllowance: 50,
    remaining: 32,
    status: 'Premium',
  };

  const usedPercentage = ((memberData.monthlyAllowance - memberData.remaining) / memberData.monthlyAllowance) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-glass-bg rounded-full px-4 py-2 border border-glass-border">
            <ShieldCheck className="w-4 h-4 text-semantic-success" />
            <span className="text-sm text-primary-200 font-medium">Verified Member</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Digital Member Card</h1>
          <p className="text-primary-300 text-sm">South Flowers C.H.R.A.</p>
        </div>

        {/* Member Card - 3D Flip Effect */}
        <div 
          className="relative w-full max-w-sm h-[480px] perspective-1000 animate-slide-up"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="relative h-full backdrop-blur-xl bg-glass-bg rounded-3xl border border-glass-border shadow-2xl shadow-primary-900/20 overflow-hidden">
                {/* Card gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-glass-light via-transparent to-glass-blur opacity-60" />
                
                {/* Premium badge */}
                <div className="absolute top-6 right-6 z-10">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full px-3 py-1.5 shadow-lg shadow-primary-900/25">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{memberData.status}</span>
                  </div>
                </div>

                {/* Card content */}
                <div className="relative h-full p-8 flex flex-col justify-between">
                  {/* Top section - Logo & Member Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80" />
                        <div className="relative w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/25">
                          <span className="text-white font-bold text-xl">SF</span>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{memberData.name}</h2>
                        <p className="text-primary-300 text-sm font-mono">{memberData.memberId}</p>
                      </div>
                    </div>

                    {/* Member details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <UserCircle className="w-4 h-4 text-primary-400" />
                        <span className="text-primary-200">Member since {memberData.memberSince}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <CalendarCheck className="w-4 h-4 text-primary-400" />
                        <span className="text-primary-200">Valid until {memberData.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle section - Monthly Allowance */}
                  <div className="space-y-4">
                    <div className="backdrop-blur-sm bg-glass-heavy rounded-2xl p-4 border border-glass-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-semantic-success" />
                          <span className="text-xs text-primary-400 uppercase tracking-wider font-medium">Monthly Allowance</span>
                        </div>
                        <span className="text-xs text-primary-300">{memberData.monthlyAllowance}g total</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-bold text-white">{memberData.remaining}g</span>
                          <span className="text-sm text-primary-300">remaining</span>
                        </div>
                        
                        <div className="w-full bg-glass-bg rounded-full h-2 overflow-hidden border border-glass-border">
                          <div 
                            className="bg-gradient-to-r from-semantic-success to-primary-500 h-2 transition-all duration-700 ease-out relative overflow-hidden"
                            style={{ width: `${100 - usedPercentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-primary-400">
                          <span>Used: {memberData.monthlyAllowance - memberData.remaining}g</span>
                          <span>{Math.round(100 - usedPercentage)}% left</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom section - QR Code */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="backdrop-blur-sm bg-white/95 rounded-2xl p-4 border border-glass-border shadow-lg">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-primary-400 text-center">Scan at club entrance</p>
                  </div>
                </div>

                {/* Tap to flip hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="backdrop-blur-sm bg-glass-bg rounded-full px-3 py-1 border border-glass-border">
                    <p className="text-xs text-primary-400">Tap to flip</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 backface-hidden rotate-y-180"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="relative h-full backdrop-blur-xl bg-glass-bg rounded-3xl border border-glass-border shadow-2xl shadow-primary-900/20 overflow-hidden">
                {/* Card gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-glass-light via-transparent to-glass-blur opacity-60" />
                
                {/* Back content */}
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Member Benefits</h3>
                      <p className="text-sm text-primary-300">Premium Cannabis Club</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { icon: ShieldCheck, title: 'Quality Assured', desc: 'Lab-tested premium strains' },
                        { icon: Leaf, title: '50g Monthly', desc: 'Generous monthly allowance' },
                        { icon: Sparkles, title: 'Priority Access', desc: 'New strain early access' },
                        { icon: CalendarCheck, title: 'Flexible Pickup', desc: 'Reserve & collect anytime' },
                      ].map((benefit, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 backdrop-blur-sm bg-glass-heavy rounded-xl p-3 border border-glass-border"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
                            <benefit.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">{benefit.title}</h4>
                            <p className="text-xs text-primary-300">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="backdrop-blur-sm bg-glass-heavy rounded-xl p-4 border border-glass-border">
                      <h4 className="text-xs text-primary-400 uppercase tracking-wider mb-2 font-medium">Club Location</h4>
                      <p className="text-sm text-white font-medium">Triq San Tumas 268</p>
                      <p className="text-sm text-primary-200">Fgura, FGR 1609</p>
                    </div>

                    <div className="backdrop-blur-sm bg-glass-heavy rounded-xl p-4 border border-glass-border">
                      <h4 className="text-xs text-primary-400 uppercase tracking-wider mb-2 font-medium">Opening Hours</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-primary-200">Mon - Fri</span>
                          <span className="text-white font-medium">10:00 - 20:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary-200">Saturday</span>
                          <span className="text-white font-medium">10:00 - 13:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary-200">Sunday</span>
                          <span className="text-semantic-error">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tap to flip hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="backdrop-blur-sm bg-glass-bg rounded-full px-3 py-1 border border-glass-border">
                    <p className="text-xs text-primary-400">Tap to flip back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40 hover:from-primary-500 hover:to-primary-400 transition-all duration-300 active:scale-95">
            View Available Strains
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="backdrop-blur-xl bg-glass-bg border border-glass-border text-primary-200 font-medium py-3 rounded-xl hover:bg-glass-heavy hover:text-white transition-all duration-300">
              Order History
            </button>
            <button className="backdrop-blur-xl bg-glass-bg border border-glass-border text-primary-200 font-medium py-3 rounded-xl hover:bg-glass-heavy hover:text-white transition-all duration-300">
              Messages
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-primary-400 max-w-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p>This digital card is for identification purposes only.</p>
          <p className="mt-1">Valid only with government-issued ID.</p>
        </div>
      </div>
    </div>
  );
}