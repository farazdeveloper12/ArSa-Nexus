import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/layout/AdminLayout';
import ActionButtons from '../../../components/admin/ActionButtons';
import BackButton from '../../../components/admin/BackButton';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon as UsersIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const TrainingProgramsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [trainings, setTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalTrainings, setTotalTrainings] = useState(0);

  const categories = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data Science',
    'Digital Marketing',
    'UI/UX Design',
    'Cloud Computing',
    'Cybersecurity'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    // Check authentication with improved race condition handling
    if (status === 'loading') return; // Still loading, don't do anything

    if (status === 'unauthenticated' || !session) {
      router.push('/admin/login');
      return;
    }

    if (session && !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }

    // Only fetch data if we have a valid session
    if (session && ['admin', 'manager'].includes(session.user.role)) {
      fetchTrainings();
    }
  }, [session, status, router, currentPage, searchTerm, categoryFilter, levelFilter]);

  const fetchTrainings = async () => {
    setPageLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchTerm,
        category: categoryFilter,
        level: levelFilter
      });

      const response = await fetch(`/api/training?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        // Handle the correct API response format
        const trainingsData = data.trainings || data.data?.trainings || [];
        const paginationData = data.pagination || data.data?.pagination || {};

        setTrainings(trainingsData);
        setTotalPages(paginationData.totalPages || 1);
        setTotalTrainings(paginationData.total || 0);
        setError('');
      } else {
        throw new Error(data.message || 'Failed to fetch trainings');
      }
    } catch (err) {
      setError('Failed to fetch training programs');
      toast.error('Failed to load training programs');
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteTraining = async (trainingId) => {
    const training = trainings.find(t => t._id === trainingId);
    if (!training) return;

    try {
      const response = await fetch(`/api/training/${trainingId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setTrainings(trainings.filter(t => t._id !== trainingId));
        setTotalTrainings(prev => prev - 1);

        toast.success(`${training.title} has been deleted successfully`, {
          duration: 4000,
          icon: '🗑️',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to delete training');
      }
    } catch (error) {
      toast.error(`Failed to delete training: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
      throw error;
    }
  };

  const handleViewTraining = (trainingId) => {
    router.push(`/training/${trainingId}`);
  };

  const handleEditTraining = (trainingId) => {
    router.push(`/admin/training/edit/${trainingId}`);
  };

  // Show loading state while authentication is being checked
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if not authenticated
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please login to access the admin panel</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </motion.button>
        </div>
      </div>
    );
  }

  // Show unauthorized state if wrong role
  if (session && !['admin', 'manager'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">Your role '{session.user.role}' doesn't have permission to access this page</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Go to Home
          </motion.button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      'Mobile Development': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      'AI & Machine Learning': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      'Data Science': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      'Digital Marketing': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800',
      'UI/UX Design': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      'Cloud Computing': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
      'Cybersecurity': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Intermediate': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Advanced': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <AdminLayout>
      <Head>
        <title>Training Programs | ArSa Nexus Admin</title>
        <meta name="description" content="Manage training programs and courses" />
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
            <BackButton href="/admin/dashboard" />
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">Training Programs</h1>
                <p className="text-gray-300">
                  Manage training programs and courses. Total: <span className="font-semibold text-purple-400">{totalTrainings}</span> programs
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{totalTrainings}</div>
                <div className="text-sm text-gray-300">Total Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{trainings.filter(t => t.active).length}</div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/admin/training/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-2xl"
              >
                <PlusIcon className="w-5 h-5" />
                Add New Program
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Programs</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Search by title..."
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

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level} className="bg-gray-800">{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Training Programs Grid */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {trainings.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {trainings.map((training, index) => (
                    <motion.div
                      key={training._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      {/* Training Image */}
                      <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
                        {training.image ? (
                          <img
                            src={training.image}
                            alt={training.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-white">
                              <BookOpenIcon className="w-16 h-16 mx-auto mb-2 opacity-80" />
                              <h3 className="font-semibold text-lg">{training.category}</h3>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {training.isFeatured && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                          {training.isPopular && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Training Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
                            {training.title}
                          </h3>
                          <div className={`ml-2 w-3 h-3 rounded-full ${training.active ? 'bg-green-400' : 'bg-red-400'}`} title={training.active ? 'Active' : 'Inactive'}></div>
                        </div>

                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {training.description}
                        </p>

                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(training.category)}`}>
                            {training.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLevelColor(training.level)}`}>
                            {training.level}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {training.duration}
                          </div>
                          <div className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-1" />
                            {training.enrollmentCount || 0} enrolled
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-white">
                            ${training.price}
                            {training.originalPrice && training.originalPrice > training.price && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ${training.originalPrice}
                              </span>
                            )}
                          </div>
                          {training.rating > 0 && (
                            <div className="flex items-center">
                              <StarIcon className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                              <span className="text-sm text-gray-300">
                                {training.rating.toFixed(1)} ({training.reviewCount || 0})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <ActionButtons
                          itemId={training._id}
                          itemName={training.title}
                          basePath="/admin/training"
                          deleteApi="/api/training"
                          onDelete={handleDeleteTraining}
                          onViewClick={handleViewTraining}
                          onEditClick={handleEditTraining}
                          viewTitle="View Training Details"
                          editTitle="Edit Training"
                          deleteTitle="Delete Training"
                          deleteConfirmText={`Are you sure you want to delete "${training.title}"? This will permanently remove the training program and all associated data.`}
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
                <AcademicCapIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No training programs found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || categoryFilter || levelFilter
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by creating your first training program.'
                }
              </p>
              {!searchTerm && !categoryFilter && !levelFilter && (
                <Link
                  href="/admin/training/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create First Training Program
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

export default TrainingProgramsPage;