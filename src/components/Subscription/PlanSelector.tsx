'use client';

import React, { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export function PlanSelector() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free Reader',
      price: '€0',
      period: 'forever',
      features: [
        'Basic news access',
        'Standard AI analysis',
        'Limited articles/day (5)',
        'With advertisements'
      ],
      cta: 'Start Reading',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Member',
      price: billingCycle === 'yearly' ? '€90' : '€9',
      period: billingCycle === 'yearly' ? 'year' : 'month',
      features: [
        'Ad-free experience',
        'Advanced AI insights',
        'Unlimited articles',
        'Exclusive content',
        'Priority support',
        'Trend predictions',
        'Malta business insights'
      ],
      cta: 'Subscribe Now',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro Business',
      price: billingCycle === 'yearly' ? '€490' : '€49',
      period: billingCycle === 'yearly' ? 'year' : 'month',
      features: [
        'All Premium features',
        'Business intelligence',
        'API access (10,000 calls/month)',
        'Custom reports',
        'Dedicated account manager',
        'White-label options',
        'Priority AI processing',
        'Advanced analytics'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // In production, integrate with payment processor
    console.log(`Subscribe to plan: ${planId}, billing: ${billingCycle}`);
  };

  const getYearlySavings = (monthlyPrice: string, yearlyPrice: string) => {
    const monthly = parseFloat(monthlyPrice.replace('€', ''));
    const yearly = parseFloat(yearlyPrice.replace('€', ''));
    const monthlyTotal = monthly * 12;
    const savings = ((monthlyTotal - yearly) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your MaltaIntelliNews Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get AI-powered Malta news insights with advanced analysis and exclusive content
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-200 hover:scale-105 ${
                plan.popular
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                
                {/* Yearly Savings */}
                {billingCycle === 'yearly' && plan.id !== 'free' && (
                  <div className="text-green-600 text-sm font-medium mt-1">
                    Save {getYearlySavings('€9', plan.price)}% vs monthly
                  </div>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  plan.id === 'free'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {plan.cta}
              </button>

              {/* Plan Comparison */}
              {plan.id === 'premium' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Compare with Free plan:
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Articles/day:</span>
                        <span className="font-medium">5 → Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advertisements:</span>
                        <span className="font-medium">Yes → None</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Insights:</span>
                        <span className="font-medium">Basic → Advanced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Why Choose Premium?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚫</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Ad-Free Reading</h4>
              <p className="text-sm text-gray-600">Focus on content without distractions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h4>
              <p className="text-sm text-gray-600">Advanced analysis and trend predictions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏃</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Malta Focus</h4>
              <p className="text-sm text-gray-600">Local business and tourism insights</p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 inline-block">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A1.999 1.999 0 004.165 6.66h11.67A1.999 1.999 0 0017.835 4.999L12 14.667V7.833l5.835 5.835zm-1.414 1.414L12 11.667V19.5h-5.835L4.752 17.413z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-green-800">30-Day Money Back Guarantee</span>
            </div>
            <p className="text-sm text-green-700">
              Not satisfied? Get a full refund, no questions asked.
            </p>
          </div>
        </div>

        {/* Selected Plan Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-md mx-4 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Subscription
              </h3>
              <p className="text-gray-600 mb-6">
                You've selected the <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong> plan
                ({billingCycle} billing).
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Integrate with payment processor here
                    console.log(`Process payment for ${selectedPlan}`);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}