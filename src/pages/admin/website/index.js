import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

const WebsiteManagement = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const websiteFeatures = [
    {
      title: 'Page Content',
      description: 'Edit homepage, about, services, and other page content',
      icon: '📝',
      href: '/admin/website/pages',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      title: 'Website Settings',
      description: 'Configure site name, logo, contact information, and global settings',
      icon: '⚙️',
      href: '/admin/settings',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      title: 'Team Management',
      description: 'Add and manage team members displayed on the website',
      icon: '👥',
      href: '/admin/team',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
    {
      title: 'Content Management',
      description: 'Manage all website content, text, and images',
      icon: '🎨',
      href: '/admin/content',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
    },
    {
      title: 'SEO Settings',
      description: 'Configure meta tags, descriptions, and search optimization',
      icon: '🔍',
      href: '/admin/seo',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
    },
    {
      title: 'Analytics',
      description: 'View website traffic, user behavior, and performance metrics',
      icon: '📊',
      href: '/admin/analytics',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-100',
    },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Website Management - Arsa Nexus Admin</title>
        <meta name="description" content="Manage your website content and settings" />
      </Head>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Management</h1>
            <p className="text-gray-600">
              Manage all aspects of your website including content, settings, and appearance.
            </p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Website Status</h3>
                <p className="text-sm text-green-600">Active & Live</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                <p className="text-sm text-green-600">Optimized</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-green-600">SSL Enabled</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Website Management Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {websiteFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Link href={feature.href}>
                <div className={`${feature.bgColor} ${feature.hoverColor} rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group`}>
                  <div className="flex items-start">
                    <div className={`text-3xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-500">
                    {feature.description}
                  </p>
                  <div className="mt-4">
                    <span className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:opacity-80`}>
                      Manage →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm p-6 border"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/website/pages">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Pages
              </button>
            </Link>
            <Link href="/admin/settings">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </Link>
            <Link href="/" target="_blank">
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Website
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default WebsiteManagement; 