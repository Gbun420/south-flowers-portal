'use client';

import React, { useState, useEffect } from 'react';

interface RevenueStream {
  name: string;
  amount: string;
  percent: number;
  trend: string;
}

interface ConversionMetrics {
  freeToPremium: string;
  visitorToSubscriber: string;
  adClickRate: string;
  affiliateConversion: string;
}

export default function MonetizationDashboard() {
  const [revenueData, setRevenueData] = useState({
    monthlyRevenue: '€8,247',
    growth: '+23%',
    streams: [
      { name: 'Subscriptions', amount: '€4,125', percent: 50, trend: '+15%' },
      { name: 'Advertising', amount: '€2,589', percent: 31, trend: '+8%' },
      { name: 'Affiliate', amount: '€983', percent: 12, trend: '+45%' },
      { name: 'Services', amount: '€550', percent: 7, trend: '+62%' }
    ] as RevenueStream[],
    conversion: {
      freeToPremium: '3.2%',
      visitorToSubscriber: '1.8%',
      adClickRate: '2.1%',
      affiliateConversion: '8.7%'
    } as ConversionMetrics
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRevenueData(prev => ({
        ...prev,
        monthlyRevenue: `€${(Math.random() * 5000 + 8000).toFixed(0)}`,
        streams: prev.streams.map(stream => ({
          ...stream,
          amount: `€${(Math.random() * 1000 + 2000).toFixed(0)}`,
          trend: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 20 + 5)}%` : `-${Math.floor(Math.random() * 10 + 2)}%`
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: string) => {
    return amount.replace('€', '€');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Monetization Dashboard</h1>
        <p className="text-gray-600">Track revenue streams and optimize monetization strategy</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
          <div className="flex space-x-2">
            {(['month', 'quarter', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.monthlyRevenue)}</div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
          <div className="text-green-600 text-sm font-medium mt-1">{revenueData.growth} growth</div>
        </div>
        
        {revenueData.streams.map((stream, index) => (
          <div key={stream.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-lg font-bold text-gray-900">{formatCurrency(stream.amount)}</div>
            <div className="text-sm text-gray-600">{stream.name}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stream.percent}%` }}
                ></div>
              </div>
              <span className="text-green-600 text-sm font-medium ml-2">{stream.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-blue-600">{revenueData.conversion.freeToPremium}</div>
          <div className="text-sm text-gray-600">Free → Premium</div>
          <div className="text-xs text-gray-500 mt-1">Conversion rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-green-600">{revenueData.conversion.visitorToSubscriber}</div>
          <div className="text-sm text-gray-600">Visitor → Subscriber</div>
          <div className="text-xs text-gray-500 mt-1">Conversion rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-purple-600">{revenueData.conversion.adClickRate}</div>
          <div className="text-sm text-gray-600">Ad Click Rate</div>
          <div className="text-xs text-gray-500 mt-1">Click-through rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-2xl font-bold text-orange-600">{revenueData.conversion.affiliateConversion}</div>
          <div className="text-sm text-gray-600">Affiliate Conversion</div>
          <div className="text-xs text-gray-500 mt-1">Booking rate</div>
        </div>
      </div>

      {/* Revenue Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Projections</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Next Month</span>
              <span className="font-bold text-green-600">€9,500-€12,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quarter</span>
              <span className="font-bold text-blue-600">€28,000-€35,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Year Target</span>
              <span className="font-bold text-purple-600">€120,000-€150,000</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Growth Opportunities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-800">Premium Subscriptions</div>
                <div className="text-sm text-green-600">+45% potential</div>
              </div>
              <div className="text-green-600 font-bold">€2,250/mo</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-800">Business Services</div>
                <div className="text-sm text-blue-600">+120% potential</div>
              </div>
              <div className="text-blue-600 font-bold">€1,100/mo</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-purple-800">Affiliate Expansion</div>
                <div className="text-sm text-purple-600">+80% potential</div>
              </div>
              <div className="text-purple-600 font-bold">€650/mo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend Analysis</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Revenue growth visualization</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Subscriptions: Strong growth</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Advertising: Steady performance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Affiliate: Rapid expansion</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Services: High potential</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-yellow-800 font-bold">!</span>
            </div>
            <div>
              <div className="font-medium text-yellow-800">Optimize Ad Placements</div>
              <div className="text-sm text-yellow-600">A/B test banner positions for 15% CTR improvement</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-800 font-bold">✓</span>
            </div>
            <div>
              <div className="font-medium text-green-800">Expand Affiliate Network</div>
              <div className="text-sm text-green-600">Add 5 new Malta tourism partners</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-800 font-bold">↑</span>
            </div>
            <div>
              <div className="font-medium text-blue-800">Launch Business Intelligence</div>
              <div className="text-sm text-blue-600">Premium analytics service ready for deployment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}