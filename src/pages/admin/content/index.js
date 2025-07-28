import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import BackButton from '../../../components/ui/BackButton';

const ContentManagement = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const defaultContent = {
    hero: {
      announcement: { text: '', icon: '' },
      title: { line1: '', line2: '', line3: '' },
      subtitle: '',
      ctaButtons: { primary: { text: '', url: '', icon: '' }, secondary: { text: '', url: '', icon: '' } },
      stats: [],
      scrollText: ''
    },
    // Add other sections as needed
  };

  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const contentSections = [
    { id: 'hero', name: 'Hero Section', icon: '🚀' },
    { id: 'about', name: 'About Section', icon: '📋' },
    { id: 'services', name: 'Services', icon: '🛠️' },
    { id: 'training', name: 'Training Programs', icon: '🎓' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬' },
    { id: 'contact', name: 'Contact Info', icon: '📞' },
    { id: 'footer', name: 'Footer', icon: '🔗' },
    { id: 'navigation', name: 'Navigation', icon: '🧭' },
    { id: 'seo', name: 'SEO Settings', icon: '🔍' }
  ];

  // Fetch content on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchContent();
    }
  }, [status]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success && data.content) {
        setContent({ ...defaultContent, ...data.content });
      } else {
        setContent(defaultContent);
        showNotification('Failed to load content: ' + (data.message || 'No content found'), 'error');
      }
    } catch (error) {
      setContent(defaultContent);
      console.error('Error fetching content:', error);
      showNotification('Error loading content. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (data.success) {
        showNotification('✅ All content saved successfully! Changes are now live on your website.', 'success');
      } else {
        showNotification('Failed to save content: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('Error saving content. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedContent = (section, path, value) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev)); // deep copy
      const keys = path.split('.');
      let current = newContent[section];

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const updateArrayItem = (section, field, index, item) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev)); // deep copy
      newContent[section][field][index] = item;
      return newContent;
    });
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading content management...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || !['admin', 'manager', 'editor'].includes(session.user?.role)) {
    router.push('/admin/login');
    return null;
  }

  // Hero Section Editor
  const HeroEditor = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Hero Section Content</h3>

      {/* Announcement */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">📢 Announcement Banner</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Announcement Text</label>
            <input
              type="text"
              value={content?.hero?.announcement?.text || ''}
              onChange={(e) => updateNestedContent('hero', 'announcement.text', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter announcement text..."
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Icon/Emoji</label>
            <input
              type="text"
              value={content?.hero?.announcement?.icon || ''}
              onChange={(e) => updateNestedContent('hero', 'announcement.icon', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="🚀"
            />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">✨ Main Headline (3 Lines)</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Line 1</label>
            <input
              type="text"
              value={content?.hero?.title?.line1 || ''}
              onChange={(e) => updateNestedContent('hero', 'title.line1', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Building"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Line 2 (Highlighted)</label>
            <input
              type="text"
              value={content?.hero?.title?.line2 || ''}
              onChange={(e) => updateNestedContent('hero', 'title.line2', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tomorrow's"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Line 3</label>
            <input
              type="text"
              value={content?.hero?.title?.line3 || ''}
              onChange={(e) => updateNestedContent('hero', 'title.line3', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Future Leaders"
            />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">📝 Subtitle Description</h4>
        <textarea
          value={content?.hero?.subtitle || ''}
          onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Transform your career with cutting-edge professional training..."
        />
      </div>

      {/* CTA Buttons */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">🔗 Call-to-Action Buttons</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h5 className="text-white font-medium mb-3">Primary Button</h5>
            <div className="space-y-3">
              <input
                type="text"
                value={content?.hero?.ctaButtons?.primary?.text || ''}
                onChange={(e) => updateNestedContent('hero', 'ctaButtons.primary.text', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Button Text"
              />
              <input
                type="text"
                value={content?.hero?.ctaButtons?.primary?.url || ''}
                onChange={(e) => updateNestedContent('hero', 'ctaButtons.primary.url', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="URL/Link"
              />
              <input
                type="text"
                value={content?.hero?.ctaButtons?.primary?.icon || ''}
                onChange={(e) => updateNestedContent('hero', 'ctaButtons.primary.icon', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Icon/Emoji"
              />
            </div>
          </div>
          <div>
            <h5 className="text-white font-medium mb-3">Secondary Button</h5>
            <div className="space-y-3">
              <input
                type="text"
                value={content?.hero?.ctaButtons?.secondary?.text || ''}
                onChange={(e) => updateNestedContent('hero', 'ctaButtons.secondary.text', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Button Text"
              />
              <input
                type="text"
                value={content?.hero?.ctaButtons?.secondary?.url || ''}
                onChange={(e) => updateNestedContent('hero', 'ctaButtons.secondary.url', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="URL/Link"
              />
              <input
                type="text"
                value={content?.hero?.ctaButtons?.secondary?.icon || ''}
                onChange={(e) => updateNestedContent('hero', 'ctaButtons.secondary.icon', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Icon/Emoji"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">📊 Hero Statistics (Key Numbers)</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {content?.hero?.stats?.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-900/30 rounded-lg border border-gray-600/30">
              <h5 className="text-white font-medium mb-3">Stat #{index + 1}</h5>
              <div className="space-y-3">
                <input
                  type="text"
                  value={stat.icon || ''}
                  onChange={(e) => updateArrayItem('hero', 'stats', index, { ...stat, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Icon/Emoji"
                />
                <input
                  type="text"
                  value={stat.number || ''}
                  onChange={(e) => updateArrayItem('hero', 'stats', index, { ...stat, number: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Number (e.g., 10K+, 95%)"
                />
                <input
                  type="text"
                  value={stat.label || ''}
                  onChange={(e) => updateArrayItem('hero', 'stats', index, { ...stat, label: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Label (e.g., Students Trained)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Text */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">👇 Scroll Indicator Text</h4>
        <input
          type="text"
          value={content?.hero?.scrollText || ''}
          onChange={(e) => updateContent('hero', 'scrollText', e.target.value)}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="SCROLL TO EXPLORE"
        />
      </div>
    </div>
  );

  // Quick Editor for other sections (simplified for space)
  const QuickEditor = ({ section }) => {
    const sectionData = content?.[section];
    if (!sectionData) return <div className="text-white">No content available for this section.</div>;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">{contentSections.find(s => s.id === section)?.name} Content</h3>

        {/* Title */}
        {sectionData.title && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <label className="block text-gray-300 text-sm font-medium mb-2">Section Title</label>
            <input
              type="text"
              value={sectionData.title}
              onChange={(e) => updateContent(section, 'title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Subtitle */}
        {sectionData.subtitle && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <label className="block text-gray-300 text-sm font-medium mb-2">Section Subtitle</label>
            <input
              type="text"
              value={sectionData.subtitle}
              onChange={(e) => updateContent(section, 'subtitle', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Description */}
        {sectionData.description && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <label className="block text-gray-300 text-sm font-medium mb-2">Section Description</label>
            <textarea
              value={sectionData.description}
              onChange={(e) => updateContent(section, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* JSON Editor for complex data */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <label className="block text-gray-300 text-sm font-medium mb-2">Advanced Editor (JSON)</label>
          <textarea
            value={JSON.stringify(sectionData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setContent(prev => ({ ...prev, [section]: parsed }));
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            rows={12}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <div className="bg-gray-800/40 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BackButton />
                <div>
                  <h1 className="text-2xl font-bold text-white">Website Content Management</h1>
                  <p className="text-gray-300 text-sm">Edit every text on your website</p>
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={saving || !content}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${saving || !content
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
                  '💾 Save All Changes'
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-1 overflow-x-auto py-4">
              {contentSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${activeTab === section.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                    }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'hero' ? (
                <HeroEditor />
              ) : (
                <QuickEditor section={activeTab} />
              )}
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

export default ContentManagement; 