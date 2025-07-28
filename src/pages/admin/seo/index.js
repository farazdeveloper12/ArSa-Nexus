import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import toast from 'react-hot-toast';

const SEOSettingsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [seoData, setSeoData] = useState({
    meta: {
      title: 'Arsa Nexus LLC - Professional Training and Development',
      description: 'Professional training and development services to enhance your skills and advance your career.',
      keywords: 'training, development, AI, programming, skills, education, career',
      author: 'Arsa Nexus LLC',
      ogImage: '',
      twitterCard: 'summary_large_image'
    },
    analytics: {
      googleAnalyticsId: '',
      googleTagManagerId: '',
      facebookPixelId: '',
      linkedInInsightTag: '',
      hotjarId: ''
    },
    sitemap: {
      enabled: true,
      lastGenerated: new Date().toISOString()
    },
    robots: {
      allowAll: true,
      customRules: ''
    },
    schema: {
      organizationName: 'Arsa Nexus LLC',
      organizationType: 'EducationalOrganization',
      website: 'https://arsanexus.com',
      logo: '',
      socialProfiles: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      }
    }
  });

  // Redirect if not authenticated or not admin/manager
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
  }, [session, status, router]);

  // Fetch SEO settings
  useEffect(() => {
    if (session) {
      fetchSEOSettings();
    }
  }, [session]);

  const fetchSEOSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo');
      const data = await response.json();

      if (data.success && data.settings) {
        setSeoData(data.settings);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSeoData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, parent, field, value) => {
    setSeoData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('SEO settings saved successfully!');
      } else {
        throw new Error(data.message || 'Failed to save SEO settings');
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const generateSitemap = async () => {
    try {
      const response = await fetch('/api/admin/seo/sitemap', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Sitemap generated successfully!');
        setSeoData(prev => ({
          ...prev,
          sitemap: {
            ...prev.sitemap,
            lastGenerated: new Date().toISOString()
          }
        }));
      } else {
        throw new Error(data.message || 'Failed to generate sitemap');
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast.error('Failed to generate sitemap');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading SEO Settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>SEO Settings | Arsa Nexus Admin</title>
        <meta name="description" content="Manage SEO settings and optimization" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Settings</h1>
              <p className="text-gray-600">Manage your website's search engine optimization settings</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <motion.button
                onClick={generateSitemap}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🗺️ Generate Sitemap
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                {saving ? 'Saving...' : '💾 Save Settings'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meta Settings */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏷️</span>
              Meta Tags
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoData.meta.title}
                  onChange={(e) => handleInputChange('meta', 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your website title"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.meta.title.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoData.meta.description}
                  onChange={(e) => handleInputChange('meta', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your website description"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.meta.description.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={seoData.meta.keywords}
                  onChange={(e) => handleInputChange('meta', 'keywords', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={seoData.meta.ogImage}
                  onChange={(e) => handleInputChange('meta', 'ogImage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yoursite.com/og-image.jpg"
                />
              </div>
            </div>
          </motion.div>

          {/* Analytics */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📊</span>
              Analytics & Tracking
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={seoData.analytics.googleAnalyticsId}
                  onChange={(e) => handleInputChange('analytics', 'googleAnalyticsId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={seoData.analytics.googleTagManagerId}
                  onChange={(e) => handleInputChange('analytics', 'googleTagManagerId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={seoData.analytics.facebookPixelId}
                  onChange={(e) => handleInputChange('analytics', 'facebookPixelId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789012345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotjar Site ID
                </label>
                <input
                  type="text"
                  value={seoData.analytics.hotjarId}
                  onChange={(e) => handleInputChange('analytics', 'hotjarId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234567"
                />
              </div>
            </div>
          </motion.div>

          {/* Schema & Social */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏢</span>
              Organization Schema
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={seoData.schema.organizationName}
                  onChange={(e) => handleInputChange('schema', 'organizationName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={seoData.schema.website}
                  onChange={(e) => handleInputChange('schema', 'website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={seoData.schema.socialProfiles.facebook}
                  onChange={(e) => handleNestedInputChange('schema', 'socialProfiles', 'facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={seoData.schema.socialProfiles.linkedin}
                  onChange={(e) => handleNestedInputChange('schema', 'socialProfiles', 'linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Sitemap & Robots */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🤖</span>
              Sitemap & Robots
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900">Sitemap</h3>
                  <p className="text-sm text-gray-600">
                    Last generated: {new Date(seoData.sitemap.lastGenerated).toLocaleDateString()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoData.sitemap.enabled}
                    onChange={(e) => handleInputChange('sitemap', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900">Search Engine Access</h3>
                  <p className="text-sm text-gray-600">Allow search engines to index your site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoData.robots.allowAll}
                    onChange={(e) => handleInputChange('robots', 'allowAll', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Robots.txt Rules
                </label>
                <textarea
                  value={seoData.robots.customRules}
                  onChange={(e) => handleInputChange('robots', 'customRules', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Disallow: /private/&#10;Allow: /public/"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SEOSettingsPage; 