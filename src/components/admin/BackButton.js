import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BackButton = ({
  href,
  label = "Back",
  className = "",
  showIcon = true,
  onClick
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        group inline-flex items-center gap-2 px-4 py-2.5 
        border border-gray-300 dark:border-gray-600 
        hover:border-blue-500 dark:hover:border-blue-400
        bg-white dark:bg-gray-800 
        hover:bg-blue-50 dark:hover:bg-blue-900/20
        text-gray-700 dark:text-gray-300 
        hover:text-blue-700 dark:hover:text-blue-300
        rounded-xl font-medium text-sm
        transition-all duration-200 
        shadow-sm hover:shadow-md
        ${className}
      `}
    >
      {showIcon && (
        <motion.div
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </motion.div>
      )}
      <span>{label}</span>
    </motion.button>
  );
};

export default BackButton; 