import React from 'react';
import { motion } from 'framer-motion';

const FuturisticLoader = ({ message = "Loading...", size = "lg", color = "blue" }) => {
  const sizeClasses = {
    sm: { outer: "h-8 w-8", inner: "h-6 w-6", dots: "w-1 h-1", text: "text-sm" },
    md: { outer: "h-12 w-12", inner: "h-8 w-8", dots: "w-1.5 h-1.5", text: "text-base" },
    lg: { outer: "h-16 w-16", inner: "h-12 w-12", dots: "w-2 h-2", text: "text-lg" },
    xl: { outer: "h-20 w-20", inner: "h-16 w-16", dots: "w-3 h-3", text: "text-xl" }
  };

  const colorClasses = {
    blue: {
      primary: "border-blue-500",
      secondary: "border-cyan-400",
      accent: "bg-blue-500",
      glow: "shadow-blue-500/25"
    },
    green: {
      primary: "border-green-500",
      secondary: "border-emerald-400",
      accent: "bg-green-500",
      glow: "shadow-green-500/25"
    },
    purple: {
      primary: "border-purple-500",
      secondary: "border-fuchsia-400",
      accent: "bg-purple-500",
      glow: "shadow-purple-500/25"
    },
    orange: {
      primary: "border-orange-500",
      secondary: "border-yellow-400",
      accent: "bg-orange-500",
      glow: "shadow-orange-500/25"
    }
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[color];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Loader */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className={`animate-spin rounded-full ${currentSize.outer} border-t-2 border-b-2 ${currentColor.primary}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulse Ring */}
        <motion.div
          className={`absolute inset-0 animate-pulse rounded-full ${currentSize.outer} border-2 ${currentColor.primary}/20`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-2 animate-spin rounded-full ${currentSize.inner} border-t-2 ${currentColor.secondary}`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Dot */}
        <motion.div
          className={`absolute inset-4 rounded-full ${currentColor.accent}/30`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glowing Effect */}
        <div className={`absolute inset-0 rounded-full ${currentColor.glow} blur-xl opacity-50`} />
      </div>

      {/* Loading Text */}
      <motion.p
        className={`text-gray-400 font-medium ${currentSize.text}`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>

      {/* Animated Dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${currentSize.dots} ${currentColor.accent} rounded-full`}
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
};

// Specialized loaders for different contexts
export const AdminLoader = ({ message = "Loading admin data..." }) => (
  <FuturisticLoader message={message} size="lg" color="blue" />
);

export const TrainingLoader = ({ message = "Loading training programs..." }) => (
  <FuturisticLoader message={message} size="lg" color="green" />
);

export const InternshipLoader = ({ message = "Loading internships..." }) => (
  <FuturisticLoader message={message} size="lg" color="purple" />
);

export const JobLoader = ({ message = "Loading job opportunities..." }) => (
  <FuturisticLoader message={message} size="lg" color="orange" />
);

// Full screen loader with backdrop
export const FullScreenLoader = ({
  message = "Loading...",
  size = "xl",
  color = "blue",
  backdrop = true
}) => (
  <div className={`${backdrop ? 'fixed inset-0 bg-black/80 backdrop-blur-sm' : ''} z-50 flex items-center justify-center`}>
    <FuturisticLoader message={message} size={size} color={color} />
  </div>
);

// Mini loader for inline use
export const MiniLoader = ({ color = "blue" }) => (
  <div className="relative inline-block">
    <motion.div
      className={`animate-spin rounded-full h-4 w-4 border-2 border-t-transparent ${colorClasses[color]?.primary || 'border-blue-500'}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default FuturisticLoader; 