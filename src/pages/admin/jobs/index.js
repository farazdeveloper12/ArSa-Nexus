import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/layout/AdminLayout';
import toast from 'react-hot-toast';
import ActionButtons from '../../../components/admin/ActionButtons';

const AdminJobsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const categories = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data Science',
    'Digital Marketing',
    'UI/UX Design',
    'Cloud Computing',
    'Cybersecurity',
    'Business Development',
    'Content Creation',
    'Project Management',
    'Sales & Marketing',
    'Human Resources',
    'Finance & Accounting',
    'Operations',
    'Quality Assurance',
    'DevOps',
    'Product Management'
  ];

  const statuses = ['Draft', 'Active', 'Paused', 'Closed', 'Filled'];

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }

    fetchJobs();
  }, [session, status, router, currentPage, searchTerm, categoryFilter, statusFilter]);

  const fetchJobs = async () => {
    setPageLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter || 'Active'
      });

      const response = await fetch(`/api/jobs?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // The API returns: { jobs: [...], pagination: {...} }
      if (data.jobs) {
        setJobs(data.jobs);
        setTotalPages(data.pagination.pages);
        setTotalJobs(data.pagination.total);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
      setTotalPages(1);
      setTotalJobs(0);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    if (!job) return;
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies/session are sent
      });
      const data = await response.json();
      if (data.success) {
        setJobs(jobs.filter(j => j._id !== jobId));
        toast.success(`${job.title} has been deleted successfully`, {
          duration: 4000,
          icon: '🗑️',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      toast.error(`Failed to delete job: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    }
  };

  if (status === 'loading' || pageLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2 border-blue-600/20"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading jobs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColorDark = (status) => {
    const colors = {
      'Draft': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Paused': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Closed': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Filled': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <AdminLayout>
      <Head>
        <title>Job Management | Arsa Nexus Admin</title>
        <meta name="description" content="Manage job opportunities and applications" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-blue-400">💼</span>
              Job Management
            </h1>
            <p className="text-gray-300">
              Manage job opportunities. Total: <span className="font-semibold text-blue-400">{totalJobs}</span> jobs
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">🔍</span>
              Filters & Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Jobs</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
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

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" className="bg-gray-800">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status} className="bg-gray-800">{status}</option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/5 rounded-xl p-3">
                  <div className="text-2xl font-bold text-blue-400">{totalJobs}</div>
                  <div className="text-sm text-gray-300">Total</div>
                </div>
                <div className="text-center bg-white/5 rounded-xl p-3">
                  <div className="text-2xl font-bold text-green-400">{jobs.filter(j => j.status === 'Active').length}</div>
                  <div className="text-sm text-gray-300">Active</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {jobs.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {jobs.map((job, index) => {
                    const daysRemaining = job.applicationDeadline ? getDaysRemaining(job.applicationDeadline) : null;

                    return (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
                                {job.title}
                              </h3>
                              <p className="text-gray-300 mt-1">{job.company}</p>
                            </div>
                            <div className="flex gap-2">
                              {job.featured && (
                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                                  Featured
                                </span>
                              )}
                              {job.urgent && (
                                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium border border-red-500/30">
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              📍 {job.location}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              {job.locationType}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColorDark(job.status)}`}>
                              {job.status}
                            </span>
                          </div>

                          <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                            {job.description}
                          </p>
                        </div>

                        {/* Details */}
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Category</div>
                              <div className="text-white font-medium">{job.category}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Employment Type</div>
                              <div className="text-white font-medium">{job.employmentType}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Experience Level</div>
                              <div className="text-white font-medium">{job.experienceLevel}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Applications</div>
                              <div className="text-white font-medium">{job.applicationCount || 0}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-300 mb-6">
                            <div>
                              Salary: <span className="font-medium text-white">
                                {job.salary?.type === 'Range'
                                  ? `$${job.salary.min || 0} - $${job.salary.max || 0}/${job.salary.period || 'Year'}`
                                  : job.salary?.type === 'Fixed'
                                    ? `$${job.salary.amount || 0}/${job.salary.period || 'Year'}`
                                    : 'Negotiable'
                                }
                              </span>
                            </div>
                            <div>
                              {daysRemaining !== null && daysRemaining > 0 ? (
                                <span className="text-green-400">Apply within {daysRemaining} days</span>
                              ) : daysRemaining !== null ? (
                                <span className="text-red-400">Application deadline passed</span>
                              ) : (
                                <span className="text-blue-400">No deadline set</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => router.push(`/jobs`)}
                              className="flex-1 px-3 py-2 text-sm font-medium text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
                              title="View Public Page"
                            >
                              View Public
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => router.push(`/admin/jobs/edit/${job._id}`)}
                              className="px-3 py-2 text-sm font-medium text-green-400 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors"
                              title="Edit Job"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </motion.button>
                            <ActionButtons
                              itemId={job._id}
                              itemName={job.title}
                              basePath="/admin/jobs"
                              deleteApi="/api/jobs"
                              onDelete={handleDeleteJob}
                              viewTitle="View Job"
                              editTitle="Edit Job"
                              deleteTitle="Delete Job"
                              deleteConfirmText={`Are you sure you want to delete "${job.title}"? This will permanently remove the job and all associated data.`}
                              className="justify-center"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v5.586a1 1 0 00.293.707L10 14h4l1.707-1.707A1 1 0 0016 11.586V6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No jobs found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || categoryFilter || statusFilter
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by posting your first job opportunity.'
                }
              </p>
              {!searchTerm && !categoryFilter && !statusFilter && (
                <Link
                  href="/admin/jobs/new"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Post First Job
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminJobsPage; 