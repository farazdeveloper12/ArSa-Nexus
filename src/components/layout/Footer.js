import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Company info */}
          <motion.div variants={itemVariants} className="col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <div className="h-10 w-10 relative mr-2">
                <div className="absolute inset-0 bg-blue-500 rounded-md opacity-80" />
                <div className="absolute inset-0 bg-purple-500 rounded-md opacity-50 ml-1 mt-1" />
              </div>
              <span className="text-xl font-bold text-white">Arsa Nexus</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Providing products and free training for underprivileged students to create a better future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-400 hover:text-white transition-colors">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/resources/guides" className="text-gray-400 hover:text-white transition-colors">
                  Guides & Tutorials
                </Link>
              </li>
              <li>
                <Link href="/resources/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources/documentation" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/resources/support" className="text-gray-400 hover:text-white transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-6">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest news and announcements.</p>
            <form className="mb-6">
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-gray-400 text-sm">
              By subscribing, you agree to our <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link> and <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>.
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 mt-8 border-t border-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} Arsa Nexus LLC. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;