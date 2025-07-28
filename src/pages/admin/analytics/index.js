import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';

const AnalyticsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Redirect if not authenticated or not admin/manager
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
    fetchAnalyticsData();
  }, [session, status, router, timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const result = await response.json();
        setAnalyticsData(result.data);
      } else {
        console.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate data loading
  useEffect(() => {
    if (session) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [session]);

  if (status === 'loading' || loading || !analyticsData) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading Real-Time Analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const MetricCard = ({ title, value, change, icon, color = "blue" }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );

  const ChartContainer = ({ title, children }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <AdminLayout>
      <Head>
        <title>Analytics | Arsa Nexus Admin</title>
        <meta name="description" content="Website analytics and performance metrics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your website performance and user behavior</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Overview Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MetricCard
            title="Total Visitors"
            value={analyticsData?.overview?.totalVisitors?.toLocaleString()}
            change={12.5}
            icon="👥"
            color="blue"
          />
          <MetricCard
            title="Page Views"
            value={analyticsData?.overview?.pageViews?.toLocaleString()}
            change={8.2}
            icon="👁️"
            color="green"
          />
          <MetricCard
            title="Bounce Rate"
            value={`${analyticsData?.overview?.bounceRate}%`}
            change={-2.1}
            icon="⚡"
            color="yellow"
          />
          <MetricCard
            title="Avg. Session"
            value={analyticsData?.overview?.avgSessionDuration}
            change={15.3}
            icon="⏱️"
            color="purple"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analyticsData?.overview?.conversionRate}%`}
            change={5.7}
            icon="🎯"
            color="pink"
          />
          <MetricCard
            title="Revenue"
            value={`$${analyticsData?.overview?.totalRevenue?.toLocaleString()}`}
            change={18.9}
            icon="💰"
            color="indigo"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Sources */}
          <ChartContainer title="Traffic Sources">
            <div className="space-y-4">
              {analyticsData?.traffic?.sources?.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${index === 0 ? 'from-blue-400 to-blue-600' :
                      index === 1 ? 'from-green-400 to-green-600' :
                        index === 2 ? 'from-purple-400 to-purple-600' :
                          'from-orange-400 to-orange-600'
                      }`}></div>
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{source.visitors.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{source.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>

          {/* Device Breakdown */}
          <ChartContainer title="Device Usage">
            <div className="space-y-4">
              {analyticsData?.traffic?.devices?.map((device, index) => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${index === 0 ? 'from-cyan-400 to-cyan-600' :
                      index === 1 ? 'from-pink-400 to-pink-600' :
                        'from-yellow-400 to-yellow-600'
                      }`}></div>
                    <span className="font-medium">{device.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{device.users.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{device.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <ChartContainer title="Top Pages">
            <div className="space-y-4">
              {analyticsData?.traffic?.topPages?.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄'}
                    </div>
                    <div>
                      <div className="font-medium">{page.path}</div>
                      <div className="text-sm text-gray-500">{page.percentage}% of total views</div>
                    </div>
                  </div>
                  <div className="font-bold">{page.views.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </ChartContainer>

          {/* Conversions */}
          <ChartContainer title="Conversion Tracking">
            <div className="space-y-4">
              {analyticsData?.conversions?.map((conversion, index) => (
                <div key={conversion.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium">{conversion.name}</div>
                    <div className="text-sm text-gray-500">{conversion.rate}% conversion rate</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{conversion.count}</div>
                    {conversion.revenue > 0 && (
                      <div className="text-sm text-green-600">${conversion.revenue.toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>
        </div>

        {/* Real-time Trends */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analyticsData?.trends?.visitors?.reduce((a, b) => a + b, 0)?.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Visitors This Week</div>
              <div className="text-sm text-green-600 mt-1">+12.5% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analyticsData?.trends?.pageViews?.reduce((a, b) => a + b, 0)?.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Page Views</div>
              <div className="text-sm text-green-600 mt-1">+8.2% from last week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analyticsData?.trends?.conversions?.reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-gray-600">Total Conversions</div>
              <div className="text-sm text-green-600 mt-1">+15.7% from last week</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage; 