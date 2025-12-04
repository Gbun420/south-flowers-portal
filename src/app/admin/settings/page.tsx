'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/Admin/AdminLayout'
import { SafeHydrate } from '@/components/SafeHydrate'

interface SystemSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  socialLinks: {
    twitter: string
    facebook: string
    linkedin: string
  }
  aiSettings: {
    enabled: boolean
    apiKey: string
    model: string
    maxArticles: number
  }
  monetization: {
    adsEnabled: boolean
    adProvider: string
    subscriptionEnabled: boolean
    subscriptionPrice: number
  }
  notifications: {
    emailNotifications: boolean
    newArticleAlert: boolean
    systemAlerts: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'MaltaIntelliNews',
    siteDescription: 'Intelligent news aggregation for Malta',
    contactEmail: 'admin@maltaintellinews.com',
    socialLinks: {
      twitter: 'https://twitter.com/maltaintellinews',
      facebook: 'https://facebook.com/maltaintellinews',
      linkedin: 'https://linkedin.com/company/maltaintellinews',
    },
    aiSettings: {
      enabled: true,
      apiKey: '',
      model: 'gpt-4',
      maxArticles: 50,
    },
    monetization: {
      adsEnabled: true,
      adProvider: 'google',
      subscriptionEnabled: false,
      subscriptionPrice: 9.99,
    },
    notifications: {
      emailNotifications: true,
      newArticleAlert: true,
      systemAlerts: true,
    },
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateSocialLink = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  return (
    <AdminLayout>
      <SafeHydrate>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-8">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={settings.socialLinks.facebook}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={settings.socialLinks.linkedin}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* AI Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">AI Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ai-enabled"
                    checked={settings.aiSettings.enabled}
                    onChange={(e) => updateSetting('aiSettings', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ai-enabled" className="ml-2 block text-sm text-gray-900">
                    Enable AI Features
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    value={settings.aiSettings.apiKey}
                    onChange={(e) => updateSetting('aiSettings', 'apiKey', e.target.value)}
                    placeholder="Enter your AI API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                  <select
                    value={settings.aiSettings.model}
                    onChange={(e) => updateSetting('aiSettings', 'model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Articles per Day</label>
                  <input
                    type="number"
                    value={settings.aiSettings.maxArticles}
                    onChange={(e) => updateSetting('aiSettings', 'maxArticles', parseInt(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Monetization Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Monetization</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ads-enabled"
                    checked={settings.monetization.adsEnabled}
                    onChange={(e) => updateSetting('monetization', 'adsEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ads-enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Ads
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Provider</label>
                  <select
                    value={settings.monetization.adProvider}
                    onChange={(e) => updateSetting('monetization', 'adProvider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="google">Google AdSense</option>
                    <option value="carbon">Carbon Ads</option>
                    <option value="media">Media.net</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="subscription-enabled"
                    checked={settings.monetization.subscriptionEnabled}
                    onChange={(e) => updateSetting('monetization', 'subscriptionEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="subscription-enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Subscriptions
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Price (€/month)</label>
                  <input
                    type="number"
                    value={settings.monetization.subscriptionPrice}
                    onChange={(e) => updateSetting('monetization', 'subscriptionPrice', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="new-article-alert"
                    checked={settings.notifications.newArticleAlert}
                    onChange={(e) => updateSetting('notifications', 'newArticleAlert', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="new-article-alert" className="ml-2 block text-sm text-gray-900">
                    New Article Alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="system-alerts"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="system-alerts" className="ml-2 block text-sm text-gray-900">
                    System Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SafeHydrate>
    </AdminLayout>
  )
}