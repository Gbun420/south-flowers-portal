'use client';

import React, { useState, useEffect } from 'react';

interface AdPlacementProps {
  type?: 'banner' | 'rectangle' | 'native' | 'sidebar';
  position: string;
  className?: string;
}

export function AdPlacement({ type = 'banner', position, className = '' }: AdPlacementProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  const adConfig = {
    banner: { class: 'h-20 md:h-24', refresh: 30000 },
    rectangle: { class: 'w-300 h-250', refresh: 60000 },
    native: { class: 'w-full h-auto', refresh: 0 },
    sidebar: { class: 'w-full h-600', refresh: 45000 }
  };

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAdError = () => {
    setAdError(true);
    console.error(`Ad failed to load: ${position}-${type}`);
  };

  return (
    <div className={`ad-unit ${adConfig[type].class} bg-gray-100 rounded-lg 
                    border border-gray-200 flex items-center justify-center overflow-hidden 
                    relative ${className}`}>
      
      {/* Ad Loading State */}
      {!adLoaded && !adError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Ad Error State */}
      {adError && (
        <div className="text-center p-4">
          <div className="text-gray-500 text-sm mb-2">Ad unavailable</div>
          <button 
            onClick={() => setAdError(false)}
            className="text-blue-600 text-xs hover:underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Real Ad Content */}
      {adLoaded && !adError && (
        <div className="text-center p-4 w-full">
          {/* Ad Label */}
          <div className="text-xs text-gray-500 mb-2">Advertisement</div>
          
          {/* Ad Slot */}
          <div 
            id={`ad-${position}-${type}`} 
            className="ad-slot w-full h-full flex items-center justify-center"
          >
            {/* Simulated Ad Content */}
            <div className="bg-white rounded border border-gray-300 p-3 w-full">
              <div className="text-xs text-gray-600 mb-1">Sponsored Content</div>
              <div className="text-sm font-medium text-blue-600">
                {type === 'banner' && '🏨 Malta Tourism Deals'}
                {type === 'rectangle' && '🛍️ Shop Local Products'}
                {type === 'native' && '📰 Premium News Insights'}
                {type === 'sidebar' && '🎯 Targeted Recommendations'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {type === 'banner' && 'Book your Malta holiday today'}
                {type === 'rectangle' && 'Support local businesses'}
                {type === 'native' && 'Get AI-powered insights'}
                {type === 'sidebar' && 'Personalized for you'}
              </div>
              <button className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Ad Network Script Placeholder */}
          <script 
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Ad network integration (Google AdSense, etc.)
                  console.log('Ad loaded: ${position}-${type}');
                  // Real implementation would load actual ad content
                })();
              `
            }}
          />
        </div>
      )}
      
      {/* Fallback Content */}
      {!adLoaded && !adError && (
        <div className="ad-fallback text-xs text-gray-400 text-center p-2">
          <p>Support MaltaIntelliNews</p>
          <p>Quality AI-powered journalism</p>
        </div>
      )}
    </div>
  );
}

interface MonetizedLayoutProps {
  children: React.ReactNode;
}

export function MonetizedLayout({ children }: MonetizedLayoutProps) {
  const [showAds, setShowAds] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Ad */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <AdPlacement type="banner" position="header" />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
            
            {/* In-Article Native Ad */}
            <div className="my-8">
              <AdPlacement type="native" position="article-mid" />
            </div>
          </main>
          
          {/* Sidebar with Multiple Ads */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Ad Toggle for Premium Users */}
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Advertisements</span>
                <button
                  onClick={() => setShowAds(!showAds)}
                  className={`text-xs px-2 py-1 rounded ${
                    showAds ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {showAds ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {showAds ? 'Supporting our journalism' : 'Ads hidden'}
              </p>
            </div>
            
            {showAds && (
              <>
                <AdPlacement type="sidebar" position="sidebar-top" />
                <AdPlacement type="rectangle" position="sidebar-mid" />
                
                {/* Newsletter Signup */}
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold mb-2">Premium Newsletter</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Get exclusive AI insights and Malta news analysis
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                    Subscribe Free
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
      
      {/* Footer Ad */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4">
          <AdPlacement type="banner" position="footer" />
        </div>
      </div>
    </div>
  );
}