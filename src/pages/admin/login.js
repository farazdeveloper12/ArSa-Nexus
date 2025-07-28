import React, { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user is already logged in
    const checkSession = async () => {
      const session = await getSession();
      if (session && ['admin', 'manager'].includes(session.user.role)) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials. Please try again.');
        setIsLoading(false);
      } else {
        // Success - immediate redirect without delays
        toast.success('Welcome to ArSa Nexus Admin!', { duration: 2000 });

        // Immediate redirect using NextAuth's built-in mechanism
        window.location.replace('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Login | ArSa Nexus LLC</title>
        <meta name="description" content="Secure admin access to ArSa Nexus management portal" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, -50, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 left-1/2 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -20, null],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Main Login Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-white">A</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">ArSa Nexus</h1>
            <p className="text-gray-300 text-lg">Admin Portal Access</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="admin@arsanexus.com"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <span>Access Admin Portal</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-300">
                Secure access for authorized administrators only
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-center mt-8"
          >
            <p className="text-gray-400 text-sm">
              © 2024 ArSa Nexus LLC. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;