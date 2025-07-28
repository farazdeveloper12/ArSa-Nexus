// pages/admin/blog/index.js
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import BackButton from '../../../components/ui/BackButton';
import ActionButtons from '../../../components/ui/ActionButtons';

const BlogManagement = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBlogs();
    }
  }, [status]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showNotification('Error loading blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleView = (blog) => {
    window.open(`/blog/${blog.slug}`, '_blank');
  };

  const handleEdit = (blog) => {
    router.push(`/admin/blog/edit/${blog._id}`);
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"?`)) return;

    try {
      const response = await fetch(`/api/blog/${blog._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        showNotification('Blog post deleted successfully', 'success');
        fetchBlogs();
      } else {
        showNotification(data.message || 'Failed to delete blog post', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      showNotification('Error deleting blog post', 'error');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading blog management...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || !['admin', 'manager', 'editor'].includes(session.user?.role)) {
    router.push('/admin/login');
    return null;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Header */}
        <div className="bg-gray-800/40 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <BackButton />
                <div>
                  <h1 className="text-3xl font-bold text-white">Blog Management</h1>
                  <p className="text-gray-300">Manage your blog posts and articles</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full sm:w-64 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <motion.button
                  onClick={() => router.push('/admin/blog/new')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  ✍️ New Blog Post
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'No blogs found' : 'No blog posts yet'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? `No blog posts match "${searchTerm}"`
                    : 'Start creating engaging content for your audience'
                  }
                </p>
                {!searchTerm && (
                  <motion.button
                    onClick={() => router.push('/admin/blog/new')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg"
                  >
                    Create Your First Blog Post
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                >
                  {/* Blog Image */}
                  {blog.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Blog Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Blog Meta */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{blog.author || 'Admin'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {/* Blog Excerpt */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                    </p>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.published
                          ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                          : 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                        }`}>
                        {blog.published ? '✅ Published' : '⏳ Draft'}
                      </span>

                      {blog.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-500/30">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <ActionButtons
                      onView={() => handleView(blog)}
                      onEdit={() => handleEdit(blog)}
                      onDelete={() => handleDelete(blog)}
                      viewLabel="View Post"
                      editLabel="Edit Post"
                      deleteLabel="Delete Post"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

export default BlogManagement;