import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ActionButtons = ({
  itemId,
  itemName,
  basePath, // e.g., '/admin/users', '/admin/training'
  onDelete,
  viewPath,
  editPath,
  deleteApi, // e.g., '/api/users', '/api/training'
  canView = true,
  canEdit = true,
  canDelete = true,
  viewTitle = "View Details",
  editTitle = "Edit",
  deleteTitle = "Delete",
  deleteConfirmText,
  onViewClick,
  onEditClick,
  className = ""
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = () => {
    if (onViewClick) {
      onViewClick(itemId);
    } else if (viewPath) {
      router.push(viewPath);
    } else {
      router.push(`${basePath}/${itemId}`);
    }
  };

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick(itemId);
    } else if (editPath) {
      router.push(editPath);
    } else {
      router.push(`${basePath}/${itemId}/edit`);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = () => new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Confirm Deletion</h3>
              <p className="text-sm text-gray-600 mt-1">
                {deleteConfirmText || `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 shadow-sm"
            >
              Delete
            </motion.button>
          </div>
        </div>
      ), {
        duration: Infinity,
        style: { maxWidth: '500px' },
        className: 'rounded-2xl shadow-2xl border border-gray-200 p-6'
      });
    });

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    setIsDeleting(true);

    try {
      if (onDelete) {
        await onDelete(itemId);
      } else if (deleteApi) {
        const response = await fetch(`${deleteApi}/${itemId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to delete item');
        }

        toast.success(`${itemName} has been deleted successfully`, {
          duration: 4000,
          icon: '🗑️',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });

        // Refresh the page or trigger a refetch
        router.reload();
      }
    } catch (error) {
      toast.error(`Failed to delete: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      {canView && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleView}
          className="group relative p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          title={viewTitle}
        >
          <EyeIcon className="w-5 h-5" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </motion.button>
      )}

      {canEdit && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEdit}
          className="group relative p-2.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          title={editTitle}
        >
          <PencilIcon className="w-5 h-5" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </motion.button>
      )}

      {canDelete && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          disabled={isDeleting}
          className="group relative p-2.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          title={deleteTitle}
        >
          {isDeleting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"
            />
          ) : (
            <>
              <TrashIcon className="w-5 h-5" />
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ActionButtons; 