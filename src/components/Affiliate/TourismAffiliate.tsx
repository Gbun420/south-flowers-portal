'use client';

import React, { useState } from 'react';

interface AffiliateLink {
  text: string;
  url: string;
  price: string;
  commission?: string;
}

interface AffiliatePartner {
  name: string;
  commission: string;
  category: string;
  links: AffiliateLink[];
}

export function TourismAffiliate({ location = 'malta' }: { location?: string }) {
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

  const affiliatePartners: AffiliatePartner[] = [
    {
      name: 'Malta Hotels',
      commission: '8%',
      category: 'Accommodation',
      links: [
        { text: 'Luxury Hotels', url: '#', price: '€150+', commission: '8%' },
        { text: 'Budget Stays', url: '#', price: '€50-€100', commission: '8%' },
        { text: 'Family Resorts', url: '#', price: '€120+', commission: '8%' },
        { text: 'Boutique Hotels', url: '#', price: '€80-€200', commission: '8%' }
      ]
    },
    {
      name: 'Tour Operators', 
      commission: '12%',
      category: 'Experiences',
      links: [
        { text: 'Blue Lagoon Tours', url: '#', price: '€45', commission: '12%' },
        { text: 'Historical Walks', url: '#', price: '€25', commission: '12%' },
        { text: 'Wine Tasting', url: '#', price: '€60', commission: '12%' },
        { text: 'Jeep Safaris', url: '#', price: '€75', commission: '12%' },
        { text: 'Boat Excursions', url: '#', price: '€55', commission: '12%' }
      ]
    },
    {
      name: 'Transport',
      commission: '5%', 
      category: 'Travel',
      links: [
        { text: 'Car Rental', url: '#', price: '€30/day', commission: '5%' },
        { text: 'Airport Transfer', url: '#', price: '€25', commission: '5%' },
        { text: 'Public Transport', url: '#', price: '€21/week', commission: '5%' },
        { text: 'Scooter Rental', url: '#', price: '€15/day', commission: '5%' }
      ]
    },
    {
      name: 'Dining & Entertainment',
      commission: '10%', 
      category: 'Activities',
      links: [
        { text: 'Fine Dining', url: '#', price: '€60-€120', commission: '10%' },
        { text: 'Local Restaurants', url: '#', price: '€25-€50', commission: '10%' },
        { text: 'Nightlife Tours', url: '#', price: '€35', commission: '10%' },
        { text: 'Cultural Shows', url: '#', price: '€40', commission: '10%' }
      ]
    }
  ];

  const handleAffiliateClick = (partnerName: string, linkText: string) => {
    // Track affiliate click
    console.log(`Affiliate click: ${partnerName} - ${linkText}`);
    
    // In production, send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        partner_name: partnerName,
        link_text: linkText,
        location: location
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Malta Travel Deals</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Partner Offers
          </span>
          <span className="text-xs text-gray-500">
            Up to 12% commission
          </span>
        </div>
      </div>
      
      {/* Partner Categories */}
      <div className="space-y-8">
        {affiliatePartners.map(partner => (
          <div key={partner.name} className="border rounded-lg p-4">
            {/* Partner Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                <p className="text-sm text-gray-600">{partner.category}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {partner.commission} commission
                </span>
              </div>
            </div>
            
            {/* Expand/Collapse Toggle */}
            <button
              onClick={() => setExpandedPartner(
                expandedPartner === partner.name ? null : partner.name
              )}
              className="w-full flex items-center justify-between text-left text-sm text-blue-600 
                       hover:text-blue-800 mb-4"
            >
              <span>
                {expandedPartner === partner.name ? 'Hide' : 'Show'} {partner.links.length} deals
              </span>
              <svg 
                className={`w-4 h-4 transform transition-transform ${
                  expandedPartner === partner.name ? 'rotate-180' : ''
                }`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 001.414 0l-4-4a1 1 0 00-1.414 0L5.293 7.293z" />
              </svg>
            </button>
            
            {/* Links Grid */}
            {expandedPartner === partner.name && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {partner.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    onClick={() => handleAffiliateClick(partner.name, link.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center p-3 rounded-lg border border-gray-200 
                             hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {link.text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {link.commission && `• ${link.commission} commission`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">
                        {link.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        from €{Math.floor(Math.random() * 50) + 100}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Trust Indicators */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-4">Why Book Through MaltaIntelliNews?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600">✓</span>
              </div>
              <div className="font-medium text-gray-900">Verified Partners</div>
              <div className="text-gray-600">All partners vetted and approved</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600">€</span>
              </div>
              <div className="font-medium text-gray-900">Best Prices</div>
              <div className="text-gray-600">Guaranteed lowest rates</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600">🛡️</span>
              </div>
              <div className="font-medium text-gray-900">Secure Booking</div>
              <div className="text-gray-600">Protected transactions</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p className="mb-2">
            We may earn commission from these links. Prices subject to change and availability.
          </p>
          <p>
            By booking through our partners, you support MaltaIntelliNews's independent journalism.
          </p>
        </div>
      </div>
    </div>
  );
}

interface AffiliateStatsProps {
  clicks: number;
  conversions: number;
  revenue: string;
  commission: string;
}

export function AffiliateStats({ clicks, conversions, revenue, commission }: AffiliateStatsProps) {
  const conversionRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Affiliate Performance</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{clicks.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Clicks</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{conversions}</div>
          <div className="text-sm text-gray-600">Conversions</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{revenue}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Average Commission Rate
          </div>
          <div className="text-lg font-bold text-green-600">{commission}</div>
        </div>
      </div>
    </div>
  );
}