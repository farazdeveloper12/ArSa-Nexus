import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminHeader = ({ toggleSidebar }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  // Demo notifications
  const notifications = [
    {
      id: 1,
      title: 'New training enrollment',
      message: 'John Doe has enrolled in Advanced AI course.',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'System update',
      message: 'The platform will undergo maintenance tonight.',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'New feature available',
      message: 'Check out the new analytics dashboard.',
      time: '2d ago',
      read: true,
    },
  ];

  // Unread notifications count
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <header className="sticky top-0 z-30 bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: Menu button and logo */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-200 hover:text-white focus:outline-none mr-4"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <Link href="/admin/dashboard" legacyBehavior>
            <a className="flex items-center">
              <div className="h-8 w-8 relative mr-2">
                <div className="absolute inset-0 bg-blue-500 rounded-md opacity-80"></div>
                <div className="absolute inset-0 bg-purple-500 rounded-md opacity-50 ml-1 mt-1"></div>
              </div>
              <span className="text-lg font-bold text-white hidden sm:inline-block">Admin Panel</span>
            </a>
          </Link>
        </div>

        {/* Right: Notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700/70 text-white text-sm rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="text-gray-200 hover:text-white focus:outline-none relative"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                            !notification.read ? 'bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
                            <span className="text-xs text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-400">
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-700">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center focus:outline-none"
              aria-label="Open user menu"
            >
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden border-2 border-blue-500">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                ) : (
                  session?.user?.name?.charAt(0) || 'U'
                )}
              </div>
              <span className="ml-2 text-white text-sm font-medium hidden md:block">
                {session?.user?.name || 'User'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile dropdown */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-white">{session?.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                  </div>
                  <Link href="/admin/profile" legacyBehavior>
                    <a className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                      Your Profile
                    </a>
                  </Link>
                  <Link href="/admin/settings" legacyBehavior>
                    <a className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                      Settings
                    </a>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors border-t border-gray-700"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;