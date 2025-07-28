import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTrainings: 0,
    totalProducts: 0,
    totalEnrollments: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 5842,
        activeTrainings: 15,
        totalProducts: 24,
        totalEnrollments: 2489,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Sample recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'enrollment',
      user: 'John Doe',
      action: 'enrolled in',
      target: 'Advanced AI Training',
      time: '10 minutes ago',
    },
    {
      id: 2,
      type: 'product',
      user: 'Admin',
      action: 'added new product',
      target: 'AI Development Kit',
      time: '2 hours ago',
    },
    {
      id: 3,
      type: 'user',
      user: 'Jane Smith',
      action: 'created account',
      target: '',
      time: '3 hours ago',
    },
    {
      id: 4,
      type: 'training',
      user: 'Admin',
      action: 'updated training',
      target: 'Web Development Basics',
      time: '5 hours ago',
    },
    {
      id: 5,
      type: 'blog',
      user: 'Admin',
      action: 'published post',
      target: 'The Future of AI in Education',
      time: '1 day ago',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard | Arsa Nexus</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to the Arsa Nexus admin panel.</p>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Users */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm rounded-lg shadow-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-300 font-medium">Total Users</p>
              {isLoading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-600/50 rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              <span className="text-green-400 font-medium">↑ 12%</span> since last month
            </p>
            <Link href="/admin/users" legacyBehavior>
              <a className="text-xs text-blue-400 hover:text-blue-300">View Details →</a>
            </Link>
          </div>
        </motion.div>

        {/* Active Trainings */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-sm rounded-lg shadow-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-300 font-medium">Active Trainings</p>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-600/50 rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-bold text-white">{stats.activeTrainings}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              <span className="text-green-400 font-medium">↑ 5%</span> since last month
            </p>
            <Link href="/admin/training" legacyBehavior>
              <a className="text-xs text-purple-400 hover:text-purple-300">View Details →</a>
            </Link>
          </div>
        </motion.div>

        {/* Total Products */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 backdrop-blur-sm rounded-lg shadow-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-500/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-300 font-medium">Total Products</p>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-600/50 rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              <span className="text-green-400 font-medium">↑ 8%</span> since last month
            </p>
            <Link href="/admin/products" legacyBehavior>
              <a className="text-xs text-cyan-400 hover:text-cyan-300">View Details →</a>
            </Link>
          </div>
        </motion.div>

        {/* Total Enrollments */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 backdrop-blur-sm rounded-lg shadow-xl p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-500/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-300 font-medium">Total Enrollments</p>
              {isLoading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-600/50 rounded mt-1"></div>
              ) : (
                <p className="text-3xl font-bold text-white">{stats.totalEnrollments.toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              <span className="text-green-400 font-medium">↑ 15%</span> since last month
            </p>
            <Link href="/admin/training/enrollments" legacyBehavior>
              <a className="text-xs text-emerald-400 hover:text-emerald-300">View Details →</a>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {isLoading ? (
              // Loading state
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="animate-pulse h-10 w-10 bg-gray-600/50 rounded-full"></div>
                  <div className="flex-1">
                    <div className="animate-pulse h-4 w-3/4 bg-gray-600/50 rounded mb-2"></div>
                    <div className="animate-pulse h-3 w-1/2 bg-gray-600/50 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              // Activity list
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  {/* Activity icon */}
                  <div className={`p-2 rounded-full mr-4 ${
                    activity.type === 'enrollment' ? 'bg-blue-500/30 text-blue-100' :
                    activity.type === 'product' ? 'bg-purple-500/30 text-purple-100' :
                    activity.type === 'user' ? 'bg-green-500/30 text-green-100' :
                    activity.type === 'training' ? 'bg-cyan-500/30 text-cyan-100' :
                    'bg-orange-500/30 text-orange-100'
                  }`}>
                    {activity.type === 'enrollment' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    )}
                    {activity.type === 'product' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                    {activity.type === 'user' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {activity.type === 'training' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {activity.type === 'blog' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-white">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      {activity.target && (
                        <span className="font-medium text-blue-400">{activity.target}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/admin/activity" legacyBehavior>
              <a className="text-sm text-blue-400 hover:text-blue-300">View All Activity →</a>
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/users/new" legacyBehavior>
              <a className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-blue-500/30 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="text-white">Add New User</span>
              </a>
            </Link>
            
            <Link href="/admin/training/new" legacyBehavior>
              <a className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-purple-500/30 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-white">Create Training Program</span>
              </a>
            </Link>
            
            <Link href="/admin/products/new" legacyBehavior>
              <a className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-cyan-500/30 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white">Add New Product</span>
              </a>
            </Link>
            
            <Link href="/admin/blog/new" legacyBehavior>
              <a className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-emerald-500/30 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-white">Create Blog Post</span>
              </a>
            </Link>
            
            <Link href="/admin/website/pages" legacyBehavior>
              <a className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-pink-500/30 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-white">Edit Website Content</span>
              </a>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Set layout for the page
Dashboard.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Dashboard;