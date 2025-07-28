import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  showView = true,
  showEdit = true,
  showDelete = true
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to ${deleteLabel.toLowerCase()}?`)) {
      setIsDeleting(true);
      try {
        await onDelete();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {showView && onView && (
        <motion.button
          onClick={onView}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{viewLabel}</span>
        </motion.button>
      )}

      {showEdit && onEdit && (
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>{editLabel}</span>
        </motion.button>
      )}

      {showDelete && onDelete && (
        <motion.button
          onClick={handleDelete}
          disabled={isDeleting}
          whileHover={{ scale: isDeleting ? 1 : 1.05 }}
          whileTap={{ scale: isDeleting ? 1 : 0.95 }}
          className={`px-3 py-1.5 text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-1 ${isDeleting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
            }`}
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{deleteLabel}</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ActionButtons; 