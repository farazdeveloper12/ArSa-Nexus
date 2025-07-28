import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';


// Enhanced Sidebar content component with animations
const SidebarContent = ({ navigation, currentPath, isCollapsed, onItemClick }) => (
  <>
    <motion.div
      className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-blue-950 to-purple-950 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '300% 100%' }}
      />

      <Link href="/admin/dashboard" className="relative z-10">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg mr-3 flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white font-bold text-lg">A</span>
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                ArSa Nexus
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>

    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="mt-5 px-2 space-y-1">
        {navigation.map((item, index) => {
          const isActive = currentPath.startsWith(item.href);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={onItemClick}>
                <motion.div
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden cursor-pointer ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  whileHover={{
                    scale: 1.02,
                    x: isCollapsed ? 0 : 5,
                    boxShadow: isActive ? "0 10px 25px rgba(59, 130, 246, 0.3)" : "0 5px 15px rgba(255, 255, 255, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Background glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className={`${isCollapsed ? 'mr-0' : 'mr-4'} h-6 w-6 transition-all duration-300 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </motion.div>

                  {/* Text */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        className="relative z-10"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <motion.div
                      className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>

    {/* Back to Website Link */}
    <motion.div
      className="flex-shrink-0 flex border-t border-blue-800/50 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Link href="/" className="flex-shrink-0 group block w-full">
        <motion.div
          className="flex items-center text-blue-200 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
          whileHover={{ scale: 1.02, x: 3 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            whileHover={{ x: -3 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </motion.svg>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.p
                className="text-sm font-medium"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                Back to Website
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  </>
);

// Enhanced User Profile Dropdown with animations
const UserProfileDropdown = ({ user, isOpen, onToggle }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleViewUserSide = () => {
    router.push('/');
  };

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </span>
        </motion.div>
        <div className="text-left">
          <div className="font-medium">{user?.name || 'Admin User'}</div>
          <div className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</div>
        </div>
        <motion.svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                className="px-4 py-3 border-b border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </motion.div>
                  <div>
                    <div className="font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1 capitalize">
                      {user?.role || 'admin'}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="py-2">
                <motion.button
                  onClick={handleViewUserSide}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View User Side
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link
                    href="/admin/settings"
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <motion.div
                      whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account Settings
                    </motion.div>
                  </Link>
                </motion.div>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    whileHover={{ x: 5, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Loading Component
const FuturisticAdminLoader = () => (
  <div className="flex flex-col items-center justify-center h-96">
    <div className="relative">
      {/* Outer Ring */}
      <motion.div
        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulse Ring */}
      <motion.div
        className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2 border-blue-600/20"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner Ring */}
      <motion.div
        className="absolute inset-2 animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"
        animate={{ rotate: -360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* Center Dot */}
      <motion.div
        className="absolute inset-4 rounded-full bg-blue-500/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glowing Effect */}
      <div className="absolute inset-0 rounded-full shadow-blue-500/25 blur-xl opacity-50" />
    </div>

    {/* Loading Text */}
    <motion.p
      className="text-gray-600 font-medium text-lg mt-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      Loading admin panel...
    </motion.p>

    {/* Animated Dots */}
    <div className="flex gap-1 mt-4">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  </div>
);

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
    {
      name: 'Training Programs',
      href: '/admin/training',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
      name: 'Internships',
      href: '/admin/internships',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v5.586a1 1 0 00.293.707L10 14h4l1.707-1.707A1 1 0 0016 11.586V6',
    },
    {
      name: 'Jobs',
      href: '/admin/jobs',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v5.586a1 1 0 00.293.707L10 14h4l1.707-1.707A1 1 0 0016 11.586V6',
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    },
    {
      name: 'Website Content',
      href: '/admin/content',
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ];

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <FuturisticAdminLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 flex z-50 md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl">
              <motion.div
                className="absolute top-0 right-0 -mr-12 pt-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(false)}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>

              <SidebarContent
                navigation={menuItems}
                currentPath={router.pathname}
                isCollapsed={false}
                onItemClick={() => setSidebarOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-30"
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl relative overflow-hidden">
          {/* Collapse button */}
          <motion.button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </motion.button>

          <SidebarContent
            navigation={menuItems}
            currentPath={router.pathname}
            isCollapsed={sidebarCollapsed}
            onItemClick={() => { }}
          />
        </div>
      </motion.div>

      {/* Content area */}
      <motion.div
        className="flex flex-col flex-1"
        animate={{ marginLeft: window?.innerWidth >= 768 ? (sidebarCollapsed ? 80 : 256) : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Top header */}
        <motion.header
          className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile menu button */}
            <motion.button
              type="button"
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50"
              onClick={() => setSidebarOpen(true)}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            {/* Breadcrumb or title */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {router.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h1>
            </motion.div>

            {/* User profile dropdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <UserProfileDropdown
                user={session?.user}
                isOpen={profileDropdownOpen}
                onToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
              />
            </motion.div>
          </div>
        </motion.header>

        <motion.main
          className="flex-1 overflow-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;