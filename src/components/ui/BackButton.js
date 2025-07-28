import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const BackButton = ({ className = '', children = null }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.button
      onClick={handleBack}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg border border-gray-600/50 transition-all duration-200 ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>{children || 'Back'}</span>
    </motion.button>
  );
};

export default BackButton; 