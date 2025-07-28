import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';

const FuturisticDashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalTrainings: 0,
    totalJobs: 0,
    totalProducts: 0,
    recentActivities: [],
    analytics: {
      userGrowth: '+12.5%',
      revenue: '$45,230',
      conversionRate: '3.2%',
      activeProjects: 24
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Authentication check - Fixed race condition  
  useEffect(() => {
    if (status === 'loading') return; // Still loading session

    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (session && !['admin', 'manager'].includes(session.user?.role)) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Enhanced API calls with proper credentials for production
        const responses = await Promise.all([
          fetch('/api/users?summary=true', {
            method: 'GET',
            credentials: 'include', // Important for NextAuth cookies
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          fetch('/api/training?summary=true', {
            method: 'GET',
            credentials: 'include', // Important for NextAuth cookies
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          fetch('/api/jobs?summary=true', {
            method: 'GET',
            credentials: 'include', // Important for NextAuth cookies
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          fetch('/api/products?summary=true', {
            method: 'GET',
            credentials: 'include', // Important for NextAuth cookies
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          })
        ]);

        const [usersRes, trainingsRes, jobsRes, productsRes] = responses;

        // Enhanced error handling with proper fallbacks
        let usersData = null, trainingsData = null, jobsData = null, productsData = null;

        // Process users response
        if (usersRes.ok) {
          usersData = await usersRes.json();
        } else if (usersRes.status === 401) {
          console.error('Authentication failed for users API');
          // Don't redirect here, let the useEffect auth check handle it
        } else {
          console.error('Users API error:', usersRes.status, usersRes.statusText);
        }

        // Process training response
        if (trainingsRes.ok) {
          trainingsData = await trainingsRes.json();
        } else {
          console.error('Training API error:', trainingsRes.status);
        }

        // Process jobs response
        if (jobsRes.ok) {
          jobsData = await jobsRes.json();
        } else {
          console.error('Jobs API error:', jobsRes.status);
        }

        // Process products response
        if (productsRes.ok) {
          productsData = await productsRes.json();
        } else {
          console.error('Products API error:', productsRes.status);
        }

        // Update dashboard data with real data or sensible fallbacks
        setDashboardData(prev => ({
          ...prev,
          totalUsers: usersData?.total || 0,
          totalTrainings: trainingsData?.total || 0,
          totalJobs: jobsData?.total || 0,
          totalProducts: productsData?.total || 0,
          recentActivities: [
            { id: 1, type: 'user', message: 'New user registration', time: '2 minutes ago', icon: '👤' },
            { id: 2, type: 'training', message: 'Training program updated', time: '15 minutes ago', icon: '🎓' },
            { id: 3, type: 'job', message: 'New job application received', time: '32 minutes ago', icon: '💼' },
            { id: 4, type: 'system', message: 'System backup completed', time: '1 hour ago', icon: '⚙️' }
          ]
        }));

      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        // Set fallback data on network error
        setDashboardData(prev => ({
          ...prev,
          totalUsers: 0,
          totalTrainings: 0,
          totalJobs: 0,
          totalProducts: 0,
          recentActivities: [
            { id: 1, type: 'system', message: 'Loading dashboard data...', time: 'Just now', icon: '⚙️' }
          ]
        }));
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if user is authenticated
    if (session && ['admin', 'manager'].includes(session.user?.role)) {
      fetchDashboardData();
    }
  }, [session, selectedTimeRange]);

  if (status === 'loading' || isLoading) {
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
              Initializing AI Dashboard...
            </motion.p>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  const quickActions = [
    { title: 'Add Training', icon: '🎓', color: 'from-blue-500 to-cyan-500', href: '/admin/training/new' },
    { title: 'Post Job', icon: '💼', color: 'from-green-500 to-emerald-500', href: '/admin/jobs/new' },
    { title: 'Add Product', icon: '📦', color: 'from-purple-500 to-pink-500', href: '/admin/products/new' },
    { title: 'Manage Users', icon: '👥', color: 'from-orange-500 to-red-500', href: '/admin/users' },
    { title: 'Analytics', icon: '📊', color: 'from-indigo-500 to-purple-500', href: '/admin/analytics' },
    { title: 'Settings', icon: '⚙️', color: 'from-gray-600 to-gray-800', href: '/admin/settings' }
  ];

  const metrics = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      change: dashboardData.analytics.userGrowth,
      icon: '👤',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Trainings',
      value: dashboardData.totalTrainings,
      change: '+8.2%',
      icon: '🎓',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Open Jobs',
      value: dashboardData.totalJobs,
      change: '+15.3%',
      icon: '💼',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Revenue',
      value: dashboardData.analytics.revenue,
      change: '+23.1%',
      icon: '💰',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <AdminLayout>
      <Head>
        <title>AI Dashboard | Arsa Nexus Admin</title>
        <meta name="description" content="Futuristic AI-powered admin dashboard" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{session?.user?.name}</span>
              </h1>
              <p className="text-gray-300">Your AI-powered command center</p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <motion.select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                whileHover={{ scale: 1.05 }}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </motion.select>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{metric.icon}</div>
                    <motion.div
                      className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${metric.color} text-white`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {metric.change}
                    </motion.div>
                  </div>

                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {metric.value}
                  </motion.h3>

                  <p className="text-gray-300 text-sm">{metric.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-purple-400">⚡</span>
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={() => router.push(action.href)}
                className="group relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <motion.div
                      className="text-4xl mb-3"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {action.icon}
                    </motion.div>
                    <h3 className="text-white font-semibold text-sm">{action.title}</h3>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-green-400">🔄</span>
              Recent Activity
            </h3>

            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-pink-400">🤖</span>
              AI Insights
            </h3>

            <div className="space-y-4">
              <motion.div
                className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <h4 className="text-white font-semibold mb-2">📈 Growth Prediction</h4>
                <p className="text-gray-300 text-sm">Based on current trends, user growth is expected to increase by 25% next month.</p>
              </motion.div>

              <motion.div
                className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <h4 className="text-white font-semibold mb-2">🎯 Optimization Tip</h4>
                <p className="text-gray-300 text-sm">Consider promoting "Web Development" courses - they have the highest conversion rate.</p>
              </motion.div>

              <motion.div
                className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
              >
                <h4 className="text-white font-semibold mb-2">⚡ Quick Win</h4>
                <p className="text-gray-300 text-sm">Add more testimonials to increase trust and boost enrollment by up to 15%.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FuturisticDashboard;