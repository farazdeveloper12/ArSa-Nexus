import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import BackButton from '../../../components/ui/BackButton';

const SettingsManagement = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportEmail: '',
    companyAddress: '',
    phoneNumber: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: ''
    },
    seo: {
      defaultTitle: '',
      defaultDescription: '',
      keywords: '',
      ogImage: ''
    },
    features: {
      enableBlog: true,
      enableNewsletter: true,
      enableComments: true,
      enableAnalytics: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'contact', name: 'Contact Info', icon: '📞' },
    { id: 'social', name: 'Social Media', icon: '🌐' },
    { id: 'seo', name: 'SEO Settings', icon: '🔍' },
    { id: 'features', name: 'Features', icon: '🎛️' }
  ];

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data.settings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showNotification('Settings saved successfully!', 'success');
      } else {
        showNotification('Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || !['admin', 'manager'].includes(session.user?.role)) {
    router.push('/admin/login');
    return null;
  }

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateSetting('siteName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ArSa Nexus"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateSetting('contactEmail', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="info@arsanexus.com"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">Site Description</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => updateSetting('siteDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Professional training and development solutions..."
          />
        </div>
      </div>
    </div>
  );

  const ContactSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => updateSetting('supportEmail', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="support@arsanexus.com"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.phoneNumber}
              onChange={(e) => updateSetting('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">Company Address</label>
          <textarea
            value={settings.companyAddress}
            onChange={(e) => updateSetting('companyAddress', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="123 Tech Street, Innovation City, IC 12345"
          />
        </div>
      </div>
    </div>
  );

  const SocialSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Social Media Links</h3>
        <div className="space-y-4">
          {Object.entries(settings.socialMedia).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-gray-300 text-sm font-medium mb-2 capitalize">
                {platform} URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => updateSetting(`socialMedia.${platform}`, e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`https://${platform}.com/arsanexus`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SEOSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">SEO Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Default Page Title</label>
            <input
              type="text"
              value={settings.seo.defaultTitle}
              onChange={(e) => updateSetting('seo.defaultTitle', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ArSa Nexus | Professional Training"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Default Meta Description</label>
            <textarea
              value={settings.seo.defaultDescription}
              onChange={(e) => updateSetting('seo.defaultDescription', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Transform your career with cutting-edge professional training..."
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Keywords</label>
            <input
              type="text"
              value={settings.seo.keywords}
              onChange={(e) => updateSetting('seo.keywords', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="professional training, web development, AI, machine learning"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const FeatureSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Feature Toggles</h3>
        <div className="space-y-4">
          {Object.entries(settings.features).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-400 text-sm">
                  {feature === 'enableBlog' && 'Allow blog posts and articles'}
                  {feature === 'enableNewsletter' && 'Newsletter subscription functionality'}
                  {feature === 'enableComments' && 'User comments on content'}
                  {feature === 'enableAnalytics' && 'Website analytics tracking'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => updateSetting(`features.${feature}`, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettings />;
      case 'contact': return <ContactSettings />;
      case 'social': return <SocialSettings />;
      case 'seo': return <SEOSettings />;
      case 'features': return <FeatureSettings />;
      default: return <GeneralSettings />;
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Header */}
        <div className="bg-gray-800/40 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BackButton />
                <div>
                  <h1 className="text-3xl font-bold text-white">System Settings</h1>
                  <p className="text-gray-300">Configure your website settings and preferences</p>
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${saving
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25'
                  }`}
              >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  '💾 Save Settings'
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-1 overflow-x-auto py-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className={`p-4 rounded-xl shadow-2xl backdrop-blur-lg border ${notification.type === 'success'
                  ? 'bg-green-900/90 border-green-500/50 text-green-100'
                  : 'bg-red-900/90 border-red-500/50 text-red-100'
                }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">
                    {notification.type === 'success' ? '✅' : '❌'}
                  </span>
                  <p className="font-medium">{notification.message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default SettingsManagement;
