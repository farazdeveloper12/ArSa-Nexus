import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const Sidebar = ({ closeSidebar }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [openMenus, setOpenMenus] = useState({});

  // Toggle submenu
  const toggleSubmenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Check if a route is active
  const isActive = (path) => router.pathname === path;
  const isSubActive = (paths) => paths.some((path) => router.pathname.startsWith(path));

  // Menu items based on user role
  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: '/admin/dashboard',
    },
    {
      key: 'users',
      title: 'User Management',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Add New User', path: '/admin/users/new' },
        { title: 'Roles & Permissions', path: '/admin/users/roles' },
      ],
    },
    {
      key: 'training',
      title: 'Training Programs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      submenu: [
        { title: 'All Programs', path: '/admin/training' },
        { title: 'Create Program', path: '/admin/training/new' },
        { title: 'Enrollments', path: '/admin/training/enrollments' },
      ],
    },
    {
      key: 'products',
      title: 'Products',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      submenu: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Add New Product', path: '/admin/products/new' },
        { title: 'Categories', path: '/admin/products/categories' },
      ],
    },
    {
      key: 'blog',
      title: 'Blog & News',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
      submenu: [
        { title: 'All Posts', path: '/admin/blog' },
        { title: 'Add New Post', path: '/admin/blog/new' },
        { title: 'Comments', path: '/admin/blog/comments' },
      ],
    },
    {
      key: 'announcements',
      title: 'Announcements',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      submenu: [
        { title: 'All Announcements', path: '/admin/announcements' },
        { title: 'Create Announcement', path: '/admin/announcements/new' },
        { title: 'Analytics', path: '/admin/announcements/analytics' },
      ],
    },
    {
      key: 'careers',
      title: 'Careers',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      submenu: [
        { title: 'Job Listings', path: '/admin/careers' },
        { title: 'Applications', path: '/admin/careers/applications' },
      ],
    },
    {
      key: 'website',
      title: 'Website Management',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.565A32.977 32.977 0 0112 2a32.977 32.977 0 01-4 1.935z"
          />
        </svg>
      ),
      submenu: [
        { title: 'Pages', path: '/admin/website/pages' },
        { title: 'Menu', path: '/admin/website/menu' },
        { title: 'SEO Settings', path: '/admin/website/seo' },
      ],
    },
    {
      key: 'analytics',
      title: 'Analytics',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      path: '/admin/analytics',
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      path: '/admin/settings',
    },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
    closed: { x: "-100%" },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white shadow-xl">
      {/* Logo and close button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <Link href="/admin/dashboard" legacyBehavior>
          <a className="flex items-center" onClick={closeSidebar}>
            <div className="h-8 w-8 relative mr-2">
              <div className="absolute inset-0 bg-blue-500 rounded-md opacity-80"></div>
              <div className="absolute inset-0 bg-purple-500 rounded-md opacity-50 ml-1 mt-1"></div>
            </div>
            <span className="text-xl font-bold">Arsa Nexus</span>
          </a>
        </Link>

        {closeSidebar && (
          <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold overflow-hidden border-2 border-blue-500">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
            ) : (
              session?.user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${isSubActive(item.submenu.map((submenuItem) => submenuItem.path))
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${openMenus[item.key] ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Submenu */}
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: openMenus[item.key] ? "auto" : 0,
                      opacity: openMenus[item.key] ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    className="overflow-hidden"
                  >
                    <ul className="pl-10 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.path}>
                          <Link href={subItem.path} legacyBehavior>
                            <a
                              className={`block px-3 py-2 text-sm rounded-md transition-colors ${isActive(subItem.path)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                              onClick={closeSidebar}
                            >
                              {subItem.title}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              ) : (
                <Link href={item.path} legacyBehavior>
                  <a
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    onClick={closeSidebar}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link href="/" legacyBehavior>
          <a
            className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            onClick={closeSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Website</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;