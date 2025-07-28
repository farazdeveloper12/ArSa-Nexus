import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/layout/AdminLayout';
import FileUpload from '../../../components/ui/FileUpload';
import toast from 'react-hot-toast';

const TeamManagement = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    bio: '',
    image: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    expertise: [],
    achievements: [],
    isCEO: false,
    isFounder: false,
    isFeatured: false,
    displayOrder: 0,
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    }
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }

    fetchTeamMembers();
  }, [session, status, router]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team');
      const data = await response.json();

      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingMember ? `/api/admin/team/${editingMember._id}` : '/api/admin/team';
      const method = editingMember ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Team member ${editingMember ? 'updated' : 'added'} successfully!`);
        setShowAddForm(false);
        setEditingMember(null);
        resetForm();
        fetchTeamMembers();
      } else {
        throw new Error(data.error || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Team member deleted successfully!');
        fetchTeamMembers();
      } else {
        throw new Error(data.error || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      bio: '',
      image: '',
      email: '',
      phone: '',
      experience: '',
      education: '',
      expertise: [],
      achievements: [],
      isCEO: false,
      isFounder: false,
      isFeatured: false,
      displayOrder: 0,
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    });
  };

  const handleEdit = (member) => {
    setFormData({
      ...member,
      expertise: member.expertise || [],
      achievements: member.achievements || [],
      socialLinks: member.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    });
    setEditingMember(member);
    setShowAddForm(true);
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Team Management | Arsa Nexus Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-2">Manage your company team members and leadership</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setEditingMember(null);
              setShowAddForm(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            + Add Team Member
          </motion.button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Member Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                    👤
                  </div>
                )}
                {member.isCEO && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    CEO
                  </div>
                )}
                {member.isFounder && (
                  <div className="absolute top-4 left-4 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Founder
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm mb-4">{member.department}</p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{member.bio}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
                    className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAddForm(false);
                  setEditingMember(null);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingMember(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="e.g., CEO, CTO, Senior Developer"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">Human Resources</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Write a professional bio..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <FileUpload
                      label="Profile Image"
                      accept="image/*"
                      currentFile={formData.image}
                      onFileSelect={(url, file) => {
                        setFormData({ ...formData, image: url });
                      }}
                      preview={true}
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a professional headshot. Recommended size: 400x400px
                    </p>
                  </div>

                  {/* Flags */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isCEO}
                        onChange={(e) => setFormData({ ...formData, isCEO: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">CEO</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFounder}
                        onChange={(e) => setFormData({ ...formData, isFounder: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Founder</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingMember(null);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingMember ? 'Update' : 'Add')} Team Member
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement; 