import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ValidatedInput from '../../../../components/ui/ValidatedInput';
import { validateUrl, required, url } from '../../../../utils/validation';

const EditAnnouncementPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'medium',
    targetAudience: 'all',
    displayLocation: ['global'],
    startDate: '',
    endDate: '',
    isActive: true,
    isPermanent: false,
    dismissible: true,
    autoHide: false,
    autoHideDelay: 5000,
    icon: '',
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    borderColor: '#3B82F6',
    actionButton: {
      text: '',
      link: '',
      color: '#FFFFFF'
    },
    media: {
      image: '',
      video: ''
    },
    tags: [],
    metadata: {
      campaignId: '',
      source: 'admin',
      version: '1.0'
    }
  });

  const types = [
    { value: 'info', label: 'Information', icon: '📄', color: '#3B82F6' },
    { value: 'warning', label: 'Warning', icon: '⚠️', color: '#F59E0B' },
    { value: 'success', label: 'Success', icon: '✅', color: '#10B981' },
    { value: 'error', label: 'Error', icon: '❌', color: '#EF4444' },
    { value: 'promotion', label: 'Promotion', icon: '🎉', color: '#8B5CF6' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: '#F97316' },
    { value: 'update', label: 'Update', icon: '🔄', color: '#6366F1' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const audiences = [
    { value: 'all', label: 'Everyone' },
    { value: 'students', label: 'Students Only' },
    { value: 'instructors', label: 'Instructors Only' },
    { value: 'admins', label: 'Admins Only' },
    { value: 'premium', label: 'Premium Users Only' }
  ];

  const locations = [
    { value: 'homepage', label: 'Homepage' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'courses', label: 'Courses Page' },
    { value: 'global', label: 'Global (All Pages)' },
    { value: 'popup', label: 'Popup Modal' }
  ];

  const colorPresets = [
    { name: 'Blue', bg: '#3B82F6', text: '#FFFFFF', border: '#3B82F6' },
    { name: 'Green', bg: '#10B981', text: '#FFFFFF', border: '#10B981' },
    { name: 'Yellow', bg: '#F59E0B', text: '#000000', border: '#F59E0B' },
    { name: 'Red', bg: '#EF4444', text: '#FFFFFF', border: '#EF4444' },
    { name: 'Purple', bg: '#8B5CF6', text: '#FFFFFF', border: '#8B5CF6' },
    { name: 'Orange', bg: '#F97316', text: '#FFFFFF', border: '#F97316' },
    { name: 'Gray', bg: '#6B7280', text: '#FFFFFF', border: '#6B7280' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager', 'editor'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
    if (id) {
      fetchAnnouncement();
    }
  }, [session, status, router, id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/announcements/${id}`);
      const data = await response.json();

      if (data.success) {
        const announcementData = data.data;
        setAnnouncement(announcementData);
        setFormData({
          title: announcementData.title || '',
          content: announcementData.content || '',
          type: announcementData.type || 'info',
          priority: announcementData.priority || 'medium',
          targetAudience: announcementData.targetAudience || 'all',
          displayLocation: announcementData.displayLocation || ['global'],
          startDate: announcementData.startDate ?
            new Date(announcementData.startDate).toISOString().split('T')[0] : '',
          endDate: announcementData.endDate ?
            new Date(announcementData.endDate).toISOString().split('T')[0] : '',
          isActive: announcementData.isActive !== false,
          isPermanent: announcementData.isPermanent || false,
          dismissible: announcementData.dismissible !== false,
          autoHide: announcementData.autoHide || false,
          autoHideDelay: announcementData.autoHideDelay || 5000,
          icon: announcementData.icon || '',
          backgroundColor: announcementData.backgroundColor || '#3B82F6',
          textColor: announcementData.textColor || '#FFFFFF',
          borderColor: announcementData.borderColor || '#3B82F6',
          actionButton: {
            text: announcementData.actionButton?.text || '',
            link: announcementData.actionButton?.link || '',
            color: announcementData.actionButton?.color || '#FFFFFF'
          },
          media: {
            image: announcementData.media?.image || '',
            video: announcementData.media?.video || ''
          },
          tags: announcementData.tags || [],
          metadata: {
            campaignId: announcementData.metadata?.campaignId || '',
            source: announcementData.metadata?.source || 'admin',
            version: announcementData.metadata?.version || '1.0'
          }
        });
      } else {
        throw new Error(data.message || 'Failed to fetch announcement');
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Failed to load announcement data');
      router.push('/admin/announcements');
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

  const handleLocationChange = (location, checked) => {
    setFormData(prev => ({
      ...prev,
      displayLocation: checked
        ? [...prev.displayLocation, location]
        : prev.displayLocation.filter(loc => loc !== location)
    }));
  };

  const handleTypeChange = (type) => {
    const typeData = types.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      backgroundColor: typeData?.color || '#3B82F6',
      borderColor: typeData?.color || '#3B82F6',
      icon: typeData?.icon || ''
    }));
  };

  const applyColorPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      backgroundColor: preset.bg,
      textColor: preset.text,
      borderColor: preset.border
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.actionButton.link) {
      const linkValidation = validateUrl(formData.actionButton.link);
      if (!linkValidation.isValid) {
        toast.error(`Action Button Link: ${linkValidation.message}`);
        return;
      }
    }

    if (formData.displayLocation.length === 0) {
      toast.error('Please select at least one display location');
      return;
    }

    setSubmitting(true);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        tags: formData.tags.filter(tag => tag && tag.trim()),
        // Ensure dates are properly formatted
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };

      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Announcement updated successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/announcements');
      } else {
        throw new Error(data.message || 'Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error(`Failed to update announcement: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-white text-lg">Loading announcement data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Announcement | Arsa Nexus Admin</title>
        <meta name="description" content="Edit announcement" />
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
                <span className="text-purple-400">📝</span>
                Edit Announcement
              </h1>
              <p className="text-gray-300">Update announcement settings and content</p>
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
                <div className="md:col-span-2">
                  <ValidatedInput
                    type="text"
                    name="title"
                    label="Announcement Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    validation={[required()]}
                    required
                    className="dark bg-white/10"
                    placeholder="e.g. System Maintenance Scheduled"
                  />
                </div>

                <ValidatedInput
                  type="select"
                  name="type"
                  label="Type"
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  options={types.map(type => ({ value: type.value, label: `${type.icon} ${type.label}` }))}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="select"
                  name="priority"
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  options={priorities.map(priority => ({ value: priority.value, label: priority.label }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="select"
                  name="targetAudience"
                  label="Target Audience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  options={audiences.map(audience => ({ value: audience.value, label: audience.label }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="icon"
                  label="Icon (Emoji)"
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="📢"
                />
              </div>

              <div className="mt-6">
                <ValidatedInput
                  type="textarea"
                  name="content"
                  label="Announcement Content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  validation={[required()]}
                  required
                  rows={4}
                  className="dark bg-white/10"
                  placeholder="Write your announcement message here..."
                />
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">📍</span>
                Display Settings
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Display Locations *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {locations.map(location => (
                    <label key={location.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.displayLocation.includes(location.value)}
                        onChange={(e) => handleLocationChange(location.value, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-white text-sm">{location.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="date"
                  name="startDate"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="date"
                  name="endDate"
                  label="End Date (Optional)"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Appearance */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">🎨</span>
                Appearance
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Color Presets</label>
                <div className="flex flex-wrap gap-3">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyColorPreset(preset)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                      style={{ backgroundColor: preset.bg + '20', borderColor: preset.bg }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.bg }}
                      />
                      <span className="text-white text-sm">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValidatedInput
                  type="color"
                  name="backgroundColor"
                  label="Background Color"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="color"
                  name="textColor"
                  label="Text Color"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="color"
                  name="borderColor"
                  label="Border Color"
                  value={formData.borderColor}
                  onChange={(e) => handleInputChange('borderColor', e.target.value)}
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Behavior Options */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-red-400">⚙️</span>
                Behavior Options
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-white">Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPermanent}
                    onChange={(e) => handleInputChange('isPermanent', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">Permanent</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dismissible}
                    onChange={(e) => handleInputChange('dismissible', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Dismissible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoHide}
                    onChange={(e) => handleInputChange('autoHide', e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-white">Auto Hide</span>
                </label>
              </div>

              {formData.autoHide && (
                <div className="mt-4">
                  <ValidatedInput
                    type="number"
                    name="autoHideDelay"
                    label="Auto Hide Delay (milliseconds)"
                    value={formData.autoHideDelay}
                    onChange={(e) => handleInputChange('autoHideDelay', parseInt(e.target.value))}
                    className="dark bg-white/10"
                    placeholder="5000"
                  />
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-purple-400">👁️</span>
                Preview
              </h3>
              <div className="p-4 rounded-lg border-2 border-dashed border-white/20">
                <div
                  className="max-w-md mx-auto shadow-lg rounded-lg flex ring-1 ring-black ring-opacity-5 overflow-hidden"
                  style={{
                    backgroundColor: formData.backgroundColor,
                    borderColor: formData.borderColor,
                    color: formData.textColor,
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      {formData.icon && (
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{formData.icon}</span>
                        </div>
                      )}
                      <div className={`${formData.icon ? 'ml-3' : ''} flex-1`}>
                        <p className="text-sm font-medium">
                          {formData.title || 'Announcement Title'}
                        </p>
                        <p className="mt-1 text-sm opacity-90">
                          {formData.content || 'Announcement content will appear here...'}
                        </p>
                        {formData.actionButton.text && formData.actionButton.link && (
                          <button
                            className="mt-2 px-3 py-1 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: formData.actionButton.color }}
                          >
                            {formData.actionButton.text}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {formData.dismissible && (
                    <div className="flex border-l border-gray-200 border-opacity-20">
                      <button className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium hover:opacity-75">
                        ✕
                      </button>
                    </div>
                  )}
                </div>
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
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'Update Announcement'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EditAnnouncementPage; 