'use client';

import { Sparkles, Shield, Leaf, TrendingUp, Users, Award } from 'lucide-react';

export default function GlassDemoPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional gradient background with mesh effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
      
      {/* Animated orbs with professional positioning */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-primary-600 rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-[40%] right-[10%] w-[32rem] h-[32rem] bg-primary-500 rounded-full mix-blend-normal filter blur-3xl opacity-25 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[15%] left-[40%] w-80 h-80 bg-primary-700 rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[60%] left-[5%] w-64 h-64 bg-semantic-success rounded-full mix-blend-normal filter blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-button px-6 py-2.5 rounded-full">
              <Sparkles className="w-4 h-4 text-primary-200" />
              <span className="text-sm font-semibold text-white">Professional Glassmorphism</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              South Flowers
              <span className="block text-primary-200 mt-2">Premium Experience</span>
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Refined glassmorphism design with professional depth, hierarchy, and visual polish
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {[
              { icon: Shield, title: 'Quality Assured', desc: 'Lab-tested premium strains with full transparency', color: 'text-semantic-success' },
              { icon: Leaf, title: 'Sustainable', desc: 'Eco-friendly cultivation practices and packaging', color: 'text-primary-300' },
              { icon: Award, title: 'Premium Service', desc: 'Exceptional member experience and support', color: 'text-primary-200' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group glass-card rounded-3xl p-8 hover:glass-card-hover transition-all duration-500 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${idx * 100 + 200}ms` }}
              >
                <div className="space-y-4">
                  <div className="inline-flex p-4 glass-button rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-primary-100 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Panel */}
          <div className="glass-panel rounded-3xl p-10 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Users, label: 'Active Members', value: '2,500+', trend: '+12%' },
                { icon: Leaf, label: 'Premium Strains', value: '45+', trend: '+8%' },
                { icon: TrendingUp, label: 'Satisfaction', value: '98%', trend: '+3%' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center space-y-3">
                  <div className="inline-flex p-3 glass-button rounded-xl">
                    <stat.icon className="w-6 h-6 text-primary-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-primary-200">{stat.label}</div>
                    <div className="inline-flex items-center gap-1 text-xs text-semantic-success font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend} this month
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="glass-panel rounded-3xl p-12 text-center space-y-8 animate-scale-in" style={{ animationDelay: '600ms' }}>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Ready to Experience Premium?</h2>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto">
                Join our exclusive community of cannabis connoisseurs and discover the difference
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl font-semibold text-white shadow-lg shadow-primary-900/25 hover:shadow-xl hover:shadow-primary-900/40 hover:scale-105 transition-all duration-300">
                <span className="relative z-10">Become a Member</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button className="px-8 py-4 glass-button rounded-2xl font-semibold text-white hover:glass-card-hover transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Design System Showcase */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <h3 className="text-3xl font-bold text-white text-center mb-8">Design System Elements</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Buttons */}
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <h4 className="text-xl font-bold text-white mb-4">Button Variants</h4>
                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    Primary Action
                  </button>
                  <button className="w-full px-6 py-3 glass-button rounded-xl font-semibold text-white hover:glass-card-hover transition-all duration-300">
                    Secondary Action
                  </button>
                  <button className="w-full px-6 py-3 glass-input rounded-xl font-medium text-primary-100 hover:text-white border border-primary-700/30 hover:border-primary-600/50 transition-all duration-300">
                    Tertiary Action
                  </button>
                </div>
              </div>

              {/* Inputs */}
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <h4 className="text-xl font-bold text-white mb-4">Input Fields</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Email address"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                  />
                  <textarea
                    placeholder="Your message"
                    rows={3}
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8 space-y-4 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <div className="inline-flex items-center gap-2 glass-button px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-semantic-success rounded-full animate-pulse" />
              <span className="text-sm text-primary-200">Professional Design System v2.0</span>
            </div>
            <p className="text-sm text-primary-300">
              Built with precision, crafted for excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}