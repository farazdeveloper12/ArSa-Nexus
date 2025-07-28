import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/layout/AdminLayout';
import ActionButtons from '../../../components/admin/ActionButtons';
import {
  SpeakerWaveIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AnnouncementsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [targetAudienceFilter, setTargetAudienceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const user = session?.user;

  // Filter options
  const types = [
    { value: 'info', label: 'Information', icon: '📄', color: 'blue' },
    { value: 'warning', label: 'Warning', icon: '⚠️', color: 'yellow' },
    { value: 'success', label: 'Success', icon: '✅', color: 'green' },
    { value: 'error', label: 'Error', icon: '❌', color: 'red' },
    { value: 'promotion', label: 'Promotion', icon: '🎉', color: 'purple' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'orange' },
    { value: 'update', label: 'Update', icon: '🔄', color: 'indigo' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ];

  const audiences = [
    { value: 'all', label: 'Everyone' },
    { value: 'students', label: 'Students' },
    { value: 'instructors', label: 'Instructors' },
    { value: 'admins', label: 'Admins' },
    { value: 'premium', label: 'Premium Users' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
      return;
    }

    const fetchAnnouncements = async () => {
      setPageLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          search: searchTerm,
          type: typeFilter,
          priority: priorityFilter,
          targetAudience: targetAudienceFilter,
          active: statusFilter
        });

        const response = await fetch(`/api/announcements?${params}`);
        const data = await response.json();

        if (data.success) {
          const announcementsData = data.announcements || data.data?.announcements || [];
          const paginationData = data.pagination || data.data?.pagination || {};

          setAnnouncements(announcementsData);
          setTotalPages(paginationData.totalPages || 1);
          setTotalAnnouncements(paginationData.total || 0);
          setError('');
        } else {
          throw new Error(data.message || 'Failed to fetch announcements');
        }
      } catch (err) {
        setError('Failed to fetch announcements');
        toast.error('Failed to load announcements');
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user, loading, router, currentPage, searchTerm, typeFilter, priorityFilter, targetAudienceFilter, statusFilter]);

  const handleDeleteAnnouncement = async (announcementId) => {
    const announcement = announcements.find(a => a._id === announcementId);
    if (!announcement) return;
    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies/session are sent
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(announcements.filter(a => a._id !== announcementId));
        toast.success(`${announcement.title} has been deleted successfully`, {
          duration: 4000,
          icon: '🗑️',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to delete announcement');
      }
    } catch (error) {
      toast.error(`Failed to delete announcement: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    }
  };

  const handleViewAnnouncement = (announcementId) => {
    router.push(`/admin/announcements/${announcementId}`);
  };

  const handleEditAnnouncement = (announcementId) => {
    router.push(`/admin/announcements/edit/${announcementId}`);
  };

  const toggleAnnouncementStatus = async (announcementId, currentStatus) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setAnnouncements(announcements.map(a =>
          a._id === announcementId ? { ...a, isActive: !currentStatus } : a
        ));

        toast.success(`Announcement ${!currentStatus ? 'activated' : 'deactivated'} successfully`, {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to update announcement');
      }
    } catch (error) {
      toast.error(`Failed to update announcement: ${error.message}`);
    }
  };

  if (loading || pageLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p
              className="text-white text-xl font-light"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading announcements...
            </motion.p>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  const getTypeIcon = (type) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.icon || '📄';
  };

  const getTypeColor = (type) => {
    const typeData = types.find(t => t.value === type);
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800'
    };
    return colorMap[typeData?.color] || colorMap.blue;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colorMap[priority] || colorMap.medium;
  };

  const isExpired = (announcement) => {
    if (!announcement.endDate) return false;
    return new Date(announcement.endDate) < new Date();
  };

  const isActive = (announcement) => {
    const now = new Date();
    const startDate = new Date(announcement.startDate);
    const endDate = announcement.endDate ? new Date(announcement.endDate) : null;

    return announcement.isActive &&
      startDate <= now &&
      (!endDate || endDate >= now);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Announcements | ArSa Nexus Admin</title>
        <meta name="description" content="Manage website announcements and notifications" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <SpeakerWaveIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">Announcements</h1>
                <p className="text-gray-300">
                  Manage website announcements and notifications. Total: <span className="font-semibold text-purple-400">{totalAnnouncements}</span> announcements
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{totalAnnouncements}</div>
                <div className="text-sm text-gray-300">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{announcements.filter(a => isActive(a)).length}</div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{announcements.filter(a => isExpired(a)).length}</div>
                <div className="text-sm text-gray-300">Expired</div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/admin/announcements/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-2xl"
              >
                <PlusIcon className="w-5 h-5" />
                Create Announcement
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-6 h-6 text-purple-400" />
              Filters & Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {/* Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Types</option>
                  {types.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value} className="bg-gray-800">
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Audience</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={targetAudienceFilter}
                  onChange={(e) => {
                    setTargetAudienceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Audiences</option>
                  {audiences.map(audience => (
                    <option key={audience.value} value={audience.value} className="bg-gray-800">
                      {audience.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Statuses</option>
                  <option value="true" className="bg-gray-800">Active</option>
                  <option value="false" className="bg-gray-800">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Announcements Grid */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {announcements.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
                            <div>
                              <h3 className="text-lg font-semibold text-white line-clamp-1">
                                {announcement.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Created {new Date(announcement.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isExpired(announcement) && (
                              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                                Expired
                              </span>
                            )}
                            <button
                              onClick={() => toggleAnnouncementStatus(announcement._id, announcement.isActive)}
                              className={`w-3 h-3 rounded-full transition-colors ${isActive(announcement) ? 'bg-green-400' : 'bg-gray-400'
                                }`}
                              title={isActive(announcement) ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                            />
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                          {announcement.content}
                        </p>

                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                            {announcement.type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {announcement.targetAudience}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <EyeIcon className="w-4 h-4 mr-1" />
                              {announcement.analytics?.views || 0} views
                            </div>
                            <div className="flex items-center">
                              <UserGroupIcon className="w-4 h-4 mr-1" />
                              {announcement.analytics?.uniqueViews?.length || 0} unique
                            </div>
                          </div>
                          {announcement.endDate && (
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              Expires {new Date(announcement.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 bg-white/5">
                        <ActionButtons
                          itemId={announcement._id}
                          itemName={announcement.title}
                          basePath="/admin/announcements"
                          deleteApi="/api/announcements"
                          onDelete={handleDeleteAnnouncement}
                          viewTitle="View Announcement"
                          editTitle="Edit Announcement"
                          deleteTitle="Delete Announcement"
                          deleteConfirmText={`Are you sure you want to delete "${announcement.title}"? This will permanently remove the announcement and all associated analytics.`}
                          className="justify-center"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mx-auto h-24 w-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <SpeakerWaveIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No announcements found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || typeFilter || priorityFilter || targetAudienceFilter || statusFilter
                  ? 'Try adjusting your filters to find what you\'re looking for.'
                  : 'Get started by creating your first announcement.'
                }
              </p>
              {!searchTerm && !typeFilter && !priorityFilter && !targetAudienceFilter && !statusFilter && (
                <Link
                  href="/admin/announcements/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create First Announcement
                </Link>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
              <div className="flex-1 flex justify-between sm:hidden">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </motion.button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-300">
                    Showing page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg -space-x-px">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;

                      if (pageNum <= 0 || pageNum > totalPages) return null;

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200
                            ${currentPage === pageNum
                              ? 'z-10 bg-purple-500/50 border-purple-400 text-white shadow-sm'
                              : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'}`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AnnouncementsPage; 