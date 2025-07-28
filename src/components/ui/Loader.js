import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full"
      />
      <div className="absolute mt-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-lg"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;