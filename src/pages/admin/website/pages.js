import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const WebsitePagesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages] = useState([
    { id: 'home', name: 'Home Page', status: 'published', lastModified: '2023-03-20', path: '/' },
    { id: 'about', name: 'About Us', status: 'published', lastModified: '2023-03-18', path: '/about' },
    { id: 'services', name: 'Services', status: 'published', lastModified: '2023-03-15', path: '/services' },
    { id: 'training', name: 'Training Programs', status: 'published', lastModified: '2023-03-10', path: '/training' },
    { id: 'contact', name: 'Contact', status: 'published', lastModified: '2023-03-05', path: '/contact' },
  ]);

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'Arsa Nexus LLC - Professional Training and Development',
    metaDescription: 'Professional training and development services to enhance your skills and advance your career.',
    metaKeywords: 'training, development, AI, programming, skills, education, career'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }
    fetchSEOSettings();
  }, [session, status, router]);

  const fetchSEOSettings = async () => {
    try {
      const response = await fetch('/api/admin/seo');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSeoSettings({
            metaTitle: data.settings.meta?.title || seoSettings.metaTitle,
            metaDescription: data.settings.meta?.description || seoSettings.metaDescription,
            metaKeywords: data.settings.meta?.keywords || seoSettings.metaKeywords
          });
        }
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    }
  };

  const handleAddNewPage = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 max-w-md">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-medium">Add New Page</span>
        </div>
        <p className="text-gray-600">
          To add a new page, you can create it directly in the pages directory or use the content management system.
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              router.push('/admin/content');
            }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Content Manager
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      style: { maxWidth: '400px' }
    });
  };

  const handleEditPage = (page) => {
    // For now, redirect to content management
    router.push('/admin/content');
    toast.success(`Redirecting to edit ${page.name}...`);
  };

  const handlePreviewPage = (page) => {
    // Open the page in a new tab
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://arsanexus.com';
    window.open(`${baseUrl}${page.path}`, '_blank');
    toast.success(`Opening ${page.name} preview in new tab...`);
  };

  const handleUpdateSEO = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meta: {
            title: seoSettings.metaTitle,
            description: seoSettings.metaDescription,
            keywords: seoSettings.metaKeywords,
          }
        }),
      });

      if (response.ok) {
        toast.success('SEO settings updated successfully!');
      } else {
        throw new Error('Failed to update SEO settings');
      }
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      toast.error('Failed to update SEO settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Website Content | Arsa Nexus LLC</title>
      </Head>

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Website Content</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddNewPage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Page
          </motion.button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Pages</h2>
            <div className="space-y-4">
              {pages.map((page) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{page.name}</h3>
                    <p className="text-sm text-gray-500">
                      Last modified: {page.lastModified} • Status:
                      <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {page.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditPage(page)}
                      className="inline-flex items-center px-3 py-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 font-medium text-sm rounded-md transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePreviewPage(page)}
                      className="inline-flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm rounded-md transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={seoSettings.metaTitle}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={seoSettings.metaKeywords}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, metaKeywords: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoSettings.metaDescription}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateSEO}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Update SEO Settings
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

WebsitePagesPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default WebsitePagesPage;
