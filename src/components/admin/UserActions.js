// components/admin/UserActions.js
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserActions = ({ userId }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/admin/users/${userId}`);
  };

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = async () => {
    try {
      if (!confirm('Are you sure you want to delete this user?')) return;

      const response = await axios.delete(`/api/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
        }
      });

      if (response.data.success) {
        toast.success('User deleted successfully');
        // Refresh the user list
        router.reload();
      } else {
        toast.error(response.data.message || 'Error deleting user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleView}
        className="text-blue-600 hover:text-blue-800"
      >
        View
      </button>
      <button
        onClick={handleEdit}
        className="text-indigo-600 hover:text-indigo-800"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </div>
  );
};