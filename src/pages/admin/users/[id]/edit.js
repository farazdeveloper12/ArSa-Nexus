import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ValidatedInput from '../../../../components/ui/ValidatedInput';
import { validateEmail, validatePhone, validateText, required, email, phone, minLength } from '../../../../utils/validation';

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    department: '',
    position: '',
    bio: '',
    skills: [],
    location: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: ''
    }
  });

  const roles = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'hr', label: 'HR' },
    { value: 'editor', label: 'Editor' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
    if (id) {
      fetchUser();
    }
  }, [session, status, router, id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();

      if (data.success) {
        const userData = data.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'user',
          status: userData.status || 'active',
          department: userData.department || '',
          position: userData.position || '',
          bio: userData.bio || '',
          skills: userData.skills || [],
          location: userData.location || '',
          dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
          emergencyContact: {
            name: userData.emergencyContact?.name || '',
            phone: userData.emergencyContact?.phone || '',
            relationship: userData.emergencyContact?.relationship || ''
          },
          socialLinks: {
            linkedin: userData.socialLinks?.linkedin || '',
            github: userData.socialLinks?.github || '',
            twitter: userData.socialLinks?.twitter || ''
          }
        });
      } else {
        throw new Error(data.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSkillsChange = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.message);
      return;
    }

    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        toast.error(phoneValidation.message);
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('User updated successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/users');
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(`Failed to update user: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-white text-lg">Loading user data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit User | Arsa Nexus Admin</title>
        <meta name="description" content="Edit user information" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <span className="text-blue-400">👤</span>
                Edit User
              </h1>
              <p className="text-gray-300">Update user information and permissions</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-blue-400">📋</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="text"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  validation={[required(), minLength(2)]}
                  required
                  className="dark bg-white/10"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />

                <ValidatedInput
                  type="email"
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  validation={[required(), email()]}
                  required
                  className="dark bg-white/10"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />

                <ValidatedInput
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  validation={[phone()]}
                  className="dark bg-white/10"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                />

                <ValidatedInput
                  type="date"
                  name="dateOfBirth"
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Role & Status */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-purple-400">⚙️</span>
                Role & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="select"
                  name="role"
                  label="Role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  options={roles}
                  required
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="select"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statuses}
                  required
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">💼</span>
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="text"
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="position"
                  label="Position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="skills"
                  label="Skills (comma-separated)"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="React, Node.js, Python, etc."
                  className="dark bg-white/10"
                />
              </div>

              <div className="mt-6">
                <ValidatedInput
                  type="textarea"
                  name="bio"
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  placeholder="Brief description about the user..."
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-red-400">🚨</span>
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValidatedInput
                  type="text"
                  name="emergencyContactName"
                  label="Contact Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="tel"
                  name="emergencyContactPhone"
                  label="Contact Phone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  validation={[phone()]}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="emergencyContactRelationship"
                  label="Relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-cyan-400">🔗</span>
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValidatedInput
                  type="url"
                  name="linkedin"
                  label="LinkedIn"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="url"
                  name="github"
                  label="GitHub"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="url"
                  name="twitter"
                  label="Twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </div>
                ) : (
                  'Update User'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EditUserPage; 