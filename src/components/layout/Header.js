import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;

    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Search Modal Component
const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchItems = [
    { title: 'AI & Machine Learning Course', type: 'Course', url: '/training' },
    { title: 'Web Development Bootcamp', type: 'Course', url: '/training' },
    { title: 'Data Science Program', type: 'Course', url: '/training' },
    { title: 'About Us', type: 'Page', url: '/about' },
    { title: 'Contact', type: 'Page', url: '/contact' },
    { title: 'Internships', type: 'Opportunity', url: '/internships' },
    { title: 'Jobs', type: 'Opportunity', url: '/jobs' },
    { title: 'Products', type: 'Shop', url: '/products' },
    { title: 'Blog', type: 'Content', url: '/blog' },
    { title: 'Services', type: 'Services', url: '/services' },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = searchItems.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Add keyboard shortcut for search
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <svg className="absolute left-4 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses, pages, opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-4">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <Link
                    key={index}
                    href={result.url}
                    className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    onClick={onClose}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{result.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{result.type}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : searchQuery.length > 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Start typing to search...</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">ESC</kbd> to close
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useTheme();

  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    [
      isDark
        ? 'rgba(17, 24, 39, 0.80)'
        : 'rgba(255, 255, 255, 0.80)',
      isDark
        ? 'rgba(17, 24, 39, 0.95)'
        : 'rgba(255, 255, 255, 0.95)'
    ]
  );
  const headerBlur = useTransform(scrollY, [0, 100], [12, 20]);

  // Scroll and click outside effects
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [router.pathname]);

  const isActive = (path) => router.pathname === path;

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: '🏠'
    },
    {
      name: 'About',
      path: '/about',
      icon: '👥'
    },
    {
      name: 'Services',
      path: '/services',
      icon: '⚡'
    },
    {
      name: 'Training',
      path: '/training',
      icon: '🎓'
    },
    {
      name: 'Opportunities',
      path: '#',
      icon: '💼',
      dropdown: [
        { name: 'Internships', path: '/internships' },
        { name: 'Jobs', path: '/jobs' }
      ]
    },
    {
      name: 'Products',
      path: '/products',
      icon: '🛍️'
    },
    {
      name: 'Blog',
      path: '/blog',
      icon: '📝'
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: '📞'
    },
  ];

  // Animated Logo Component with Perfect Alignment
  const AnimatedLogo = () => (
    <motion.div
      className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative flex-shrink-0">
        <motion.div 
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl shadow-lg flex items-center justify-center"
          animate={{ 
            rotate: [0, 5, -5, 0],
            boxShadow: [
              "0 4px 20px rgba(59, 130, 246, 0.3)",
              "0 8px 30px rgba(147, 51, 234, 0.4)",
              "0 4px 20px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">A</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col leading-none min-w-0"
      >
        <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent truncate">
          Arsa Nexus
        </h1>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
          AI EDUCATION
        </div>
      </motion.div>
    </motion.div>
  );

  // Desktop Navigation Item
  const DesktopNavItem = ({ item, index }) => (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown(item.dropdown ? item.name : null)}
      onMouseLeave={() => {
        // Add a small delay before hiding dropdown to allow mouse movement
        setTimeout(() => {
          if (typeof document !== 'undefined' && !document.querySelector('.dropdown-menu:hover')) {
            setActiveDropdown(null);
          }
        }, 150);
      }}
      onClick={(e) => {
        e.stopPropagation();
        // Toggle dropdown on click for better mobile/touch support
        if (item.dropdown) {
          setActiveDropdown(activeDropdown === item.name ? null : item.name);
        }
      }}
    >
      <Link
        href={item.path === '#' ? '#' : item.path}
        className={`relative flex items-center space-x-1 xl:space-x-2 px-2 xl:px-4 py-2 text-xs xl:text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl group whitespace-nowrap ${isActive(item.path)
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
          : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
          }`}
        onClick={(e) => {
          if (item.path === '#') {
            e.preventDefault();
          }
        }}
      >
        <motion.span
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="text-sm xl:text-base flex-shrink-0"
        >
          {item.icon}
        </motion.span>
        <span className="hidden lg:inline">{item.name}</span>

        {item.dropdown && (
          <motion.svg
            animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-3 h-3 xl:w-4 xl:h-4 ml-1 hidden lg:inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        )}

                {isActive(item.path) && (
                  <motion.div
            layoutId="activeTab"
            className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>

      {/* Dropdown Menu - Enhanced with better hover behavior */}
      <AnimatePresence>
        {item.dropdown && activeDropdown === item.name && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="dropdown-menu absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[60] overflow-hidden"
            onMouseEnter={() => setActiveDropdown(item.name)}
            onMouseLeave={() => {
              // Keep dropdown open when hovering over it
              setTimeout(() => {
                setActiveDropdown(null);
              }, 150);
            }}
          >
            <div className="p-2">
              {item.dropdown.map((dropItem, idx) => (
                <motion.div
                  key={dropItem.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={dropItem.path}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
                    }}
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {dropItem.name}
                    </span>
            </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 border-b border-gray-200/30 dark:border-gray-700/30 ${isScrolled
          ? 'py-2 shadow-2xl'
          : 'py-3 shadow-xl'
          }`}
        style={{
          background: headerBackground,
          backdropFilter: `blur(${headerBlur}px)`,
          WebkitBackdropFilter: `blur(${headerBlur}px)`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
            {/* Logo - Perfect Alignment */}
            <Link href="/" className="focus:outline-none relative z-10 flex-shrink-0 min-w-0">
              <AnimatedLogo />
            </Link>

            {/* Desktop Navigation - Adaptive Layout */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-4">
              <div className="flex items-center space-x-1 xl:space-x-2">
                {navItems.map((item, index) => (
                  <DesktopNavItem key={item.name} item={item} index={index} />
                ))}
              </div>
        </nav>

            {/* Right Section - Perfect Alignment */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex p-2 lg:p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors backdrop-blur-sm"
                title="Search"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="hidden sm:flex p-2 lg:p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors backdrop-blur-sm"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <motion.div
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
                    </svg>
                  )}
                </motion.div>
              </motion.button>

        {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative p-2 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors backdrop-blur-sm"
          aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
        >
          {isMobileMenuOpen ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
                </motion.div>
              </motion.button>
            </div>
          </div>
      </div>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[85] bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
          <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl z-[88] lg:hidden overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <AnimatedLogo />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm font-medium">Search</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl"
                  >
                    {isDark ? '☀️' : '🌙'}
                  </motion.button>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="py-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full"
                  >
                    <Link
                      href={item.path === '#' ? '#' : item.path}
                      className={`flex items-center space-x-4 w-full px-6 py-4 text-base font-semibold transition-all duration-300 ${isActive(item.path)
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-600'
                        : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-xl"
                      >
                        {item.icon}
                      </motion.span>
                      <span>{item.name}</span>
                    </Link>

                    {/* Mobile Dropdown */}
                    {item.dropdown && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 border-l-4 border-blue-200 dark:border-blue-700">
                        {item.dropdown.map((dropItem, idx) => (
                          <Link
                            key={dropItem.path}
                            href={dropItem.path}
                            className="block px-12 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropItem.name}
                </Link>
                        ))}
                      </div>
              )}
                  </motion.div>
                ))}
            </nav>

              {/* Mobile Footer */}
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <p>© 2024 Arsa Nexus LLC</p>
                <p>AI Education Platform</p>
              </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Responsive Styles */}
      <style jsx global>{`
        .dark {
          color-scheme: dark;
        }
        
        /* Responsive font sizes */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          html {
            font-size: 15px;
          }
        }
        
        @media (min-width: 1025px) {
          html {
            font-size: 16px;
          }
        }
        
        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }
        
        /* Responsive container */
        .responsive-header {
          max-width: 100vw;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
};

// Wrap Header with ThemeProvider for standalone use
const HeaderWithTheme = (props) => {
  return (
    <ThemeProvider>
      <Header {...props} />
    </ThemeProvider>
  );
};

export default HeaderWithTheme;