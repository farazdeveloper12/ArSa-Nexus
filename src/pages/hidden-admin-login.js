import React, { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const HiddenAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [showSecurityField, setShowSecurityField] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Security: Check if user is already authenticated
  useEffect(() => {
    if (!mounted) return;

    const checkSession = async () => {
      const session = await getSession();
      if (session && ['admin', 'manager'].includes(session.user?.role)) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router, mounted]);

  // Security: Rate limiting state
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Check for lockout on component mount
  useEffect(() => {
    if (!mounted) return;

    const storedAttempts = localStorage.getItem('adminLoginAttempts');
    const storedLockout = localStorage.getItem('adminLoginLockout');

    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts));
    }

    if (storedLockout) {
      const lockoutEndTime = parseInt(storedLockout);
      if (Date.now() < lockoutEndTime) {
        setLockoutTime(lockoutEndTime);
      } else {
        // Lockout expired, reset
        localStorage.removeItem('adminLoginLockout');
        localStorage.removeItem('adminLoginAttempts');
        setAttemptCount(0);
      }
    }
  }, [mounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      toast.error(`Account locked. Try again in ${remainingTime} minutes.`);
      return;
    }

    // Check if too many attempts
    if (attemptCount >= 3 && !showSecurityField) {
      setShowSecurityField(true);
      toast.error('Too many attempts. Please enter security code.');
      return;
    }

    // Validate security code if required
    if (showSecurityField && securityCode !== 'ARSA2024') {
      toast.error('Invalid security code');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        localStorage.setItem('adminLoginAttempts', newAttemptCount.toString());

        if (newAttemptCount >= 5) {
          // Lock account for 30 minutes
          const lockoutEndTime = Date.now() + (30 * 60 * 1000);
          setLockoutTime(lockoutEndTime);
          localStorage.setItem('adminLoginLockout', lockoutEndTime.toString());
          toast.error('Account locked for 30 minutes due to multiple failed attempts.');
        } else {
          toast.error(`Invalid credentials. ${5 - newAttemptCount} attempts remaining.`);
        }
      } else {
        // Success - reset attempts
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminLoginLockout');

        toast.success('Welcome to Arsa Nexus Admin Portal');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isLocked = lockoutTime && Date.now() < lockoutTime;
  const remainingTime = isLocked ? Math.ceil((lockoutTime - Date.now()) / 1000 / 60) : 0;

  return (
    <>
      <Head>
        <title>Secure Access Portal | Arsa Nexus</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Secure administrative access portal" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Security Shield Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Access Portal</h1>
            <p className="text-gray-400">Administrative access only</p>
          </div>

          {/* Security Warning */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-center"
            >
              <div className="text-red-400 font-semibold mb-2">🔒 Account Temporarily Locked</div>
              <div className="text-red-300 text-sm">Try again in {remainingTime} minutes</div>
            </motion.div>
          )}

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter your admin email"
                  required
                  disabled={isLocked}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  disabled={isLocked}
                />
              </div>

              {/* Security Code Field (appears after 3 failed attempts) */}
              {showSecurityField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    Security Code
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="w-full px-4 py-3 bg-yellow-900/20 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-yellow-400/70 transition-all duration-200"
                    placeholder="Enter security code"
                    required
                    disabled={isLocked}
                  />
                  <p className="text-yellow-400/70 text-xs mt-2">
                    Contact system administrator for security code
                  </p>
                </motion.div>
              )}

              {/* Attempt Counter */}
              {attemptCount > 0 && !isLocked && (
                <div className="text-center text-orange-400 text-sm">
                  Login attempts: {attemptCount}/5
                </div>
              )}

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: isLocked ? 1 : 1.02 }}
                whileTap={{ scale: isLocked ? 1 : 0.98 }}
                type="submit"
                disabled={loading || isLocked}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </div>
                ) : isLocked ? (
                  '🔒 Account Locked'
                ) : (
                  '🚀 Access Admin Portal'
                )}
              </motion.button>
            </form>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <div className="text-yellow-400 font-medium text-sm mb-1">Security Notice</div>
                  <div className="text-gray-400 text-xs leading-relaxed">
                    This is a secure administrative portal. All access attempts are logged and monitored.
                    Unauthorized access is strictly prohibited.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500 text-sm">
              Need assistance? Contact{' '}
              <a href="mailto:admin@arsanexus.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                admin@arsanexus.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HiddenAdminLogin; 