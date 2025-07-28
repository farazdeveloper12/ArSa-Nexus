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
import { PlusIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const UsersPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Check authentication with improved race condition handling
    if (status === 'loading') return; // Still loading, don't do anything

    if (status === 'unauthenticated' || !session) {
      router.push('/admin/login');
      return;
    }

    if (session && !['admin', 'manager'].includes(session.user?.role)) {
      router.push('/admin/login');
      return;
    }

    // Only fetch data if we have a valid session
    if (session && ['admin', 'manager'].includes(session.user?.role)) {
      fetchUsers();
    }
  }, [session, status, router, currentPage, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    setPageLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        role: selectedRole
      });

      const response = await fetch(`/api/users?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalUsers(data.pagination?.total || 0);
        setError('');
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
      toast.error('Failed to load users');
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u._id === userId);
    if (!userToDelete) return;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies/session are sent
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success(`${userToDelete.name} has been deleted successfully`, {
          duration: 4000,
          icon: '🗑️',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error(`Failed to delete user: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    }
  };

  const handleViewUser = (userId) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId) => {
    router.push(`/admin/users/${userId}/edit`);
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

  if (pageLoading) {
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
              Loading users...
            </motion.p>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      manager: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      employee: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      instructor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      user: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    };
    return colors[role] || colors.user;
  };

  return (
    <AdminLayout>
      <Head>
        <title>User Management | ArSa Nexus Admin</title>
        <meta name="description" content="Manage users, roles, and permissions" />
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
              <UserGroupIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">User Management</h1>
                <p className="text-gray-300">
                  Manage users, roles, and permissions. Total: <span className="font-semibold text-purple-400">{totalUsers}</span> users
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{totalUsers}</div>
                <div className="text-sm text-gray-300">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{users.filter(u => u.active).length}</div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/admin/users/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-2xl"
              >
                <PlusIcon className="w-5 h-5" />
                Add New User
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Users</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Role</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  value={selectedRole}
                  onChange={handleRoleFilterChange}
                >
                  <option value="" className="bg-gray-800">All Roles</option>
                  <option value="admin" className="bg-gray-800">Admin</option>
                  <option value="manager" className="bg-gray-800">Manager</option>
                  <option value="employee" className="bg-gray-800">Employee</option>
                  <option value="instructor" className="bg-gray-800">Instructor</option>
                  <option value="user" className="bg-gray-800">User</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <AnimatePresence>
                  {users.map((userItem, index) => (
                    <motion.tr
                      key={userItem._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                              <span className="text-white font-semibold text-lg">
                                {userItem.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{userItem.name}</div>
                            <div className="text-sm text-gray-300">{userItem.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(userItem.role)}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${userItem.active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className={`text-sm font-medium ${userItem.active ? 'text-green-300' : 'text-red-300'}`}>
                            {userItem.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(userItem.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButtons
                          itemId={userItem._id}
                          itemName={userItem.name}
                          basePath="/admin/users"
                          deleteApi="/api/users"
                          onDelete={handleDeleteUser}
                          viewTitle="View User Profile"
                          editTitle="Edit User"
                          deleteTitle="Delete User"
                          deleteConfirmText={`Are you sure you want to delete "${userItem.name}"? This will permanently remove their account and all associated data.`}
                          className="justify-center"
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {users.length === 0 && !pageLoading && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mx-auto h-24 w-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <UserGroupIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || selectedRole
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by creating your first user account.'
                }
              </p>
              {!searchTerm && !selectedRole && (
                <Link
                  href="/admin/users/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add First User
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

export default UsersPage;