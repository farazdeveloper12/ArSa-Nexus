import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ValidatedInput from '../../../../components/ui/ValidatedInput';
import { validateEmail, validateNumber, validateDate, required, email, number, futureDate } from '../../../../utils/validation';

const EditJobPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    category: '',
    location: '',
    locationType: 'Remote',
    level: 'Entry Level',
    employmentType: 'Full-time',
    salary: {
      min: '',
      max: '',
      period: 'Year',
      currency: 'USD'
    },
    applicationDeadline: '',
    startDate: '',
    requirements: [''],
    benefits: [''],
    skills: [''],
    responsibilities: [''],
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    companyInfo: {
      name: '',
      size: '',
      industry: '',
      description: '',
      logo: '',
      website: ''
    },
    applicationProcess: '',
    featured: false,
    urgent: false,
    status: 'Active'
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data Science',
    'Digital Marketing',
    'UI/UX Design',
    'Cloud Computing',
    'Cybersecurity',
    'Business Development',
    'Content Creation',
    'Project Management',
    'Sales & Marketing',
    'Human Resources',
    'Finance & Accounting',
    'Operations',
    'Product Management',
    'Quality Assurance',
    'DevOps'
  ];

  const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'];
  const locationTypes = ['Remote', 'On-site', 'Hybrid'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const salaryPeriods = ['Hour', 'Month', 'Year'];
  const statuses = ['Draft', 'Active', 'Paused', 'Closed', 'Filled'];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
    if (id) {
      fetchJob();
    }
  }, [session, status, router, id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${id}`);
      const data = await response.json();

      if (data.success || data.job) {
        const jobData = data.job || data.data;
        setJob(jobData);
        setFormData({
          title: jobData.title || '',
          company: jobData.company || '',
          description: jobData.description || '',
          category: jobData.category || '',
          location: jobData.location || '',
          locationType: jobData.locationType || 'Remote',
          level: jobData.level || 'Entry Level',
          employmentType: jobData.employmentType || 'Full-time',
          salary: {
            min: jobData.salary?.min || '',
            max: jobData.salary?.max || '',
            period: jobData.salary?.period || 'Year',
            currency: jobData.salary?.currency || 'USD'
          },
          applicationDeadline: jobData.applicationDeadline ?
            new Date(jobData.applicationDeadline).toISOString().split('T')[0] : '',
          startDate: jobData.startDate ?
            new Date(jobData.startDate).toISOString().split('T')[0] : '',
          requirements: jobData.requirements || [''],
          benefits: jobData.benefits || [''],
          skills: jobData.skills || [''],
          responsibilities: jobData.responsibilities || [''],
          contactInfo: {
            email: jobData.contactInfo?.email || '',
            phone: jobData.contactInfo?.phone || '',
            website: jobData.contactInfo?.website || ''
          },
          companyInfo: {
            name: jobData.companyInfo?.name || '',
            size: jobData.companyInfo?.size || '',
            industry: jobData.companyInfo?.industry || '',
            description: jobData.companyInfo?.description || '',
            logo: jobData.companyInfo?.logo || '',
            website: jobData.companyInfo?.website || ''
          },
          applicationProcess: jobData.applicationProcess || '',
          featured: jobData.featured || false,
          urgent: jobData.urgent || false,
          status: jobData.status || 'Active'
        });
      } else {
        throw new Error(data.message || 'Failed to fetch job');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job data');
      router.push('/admin/jobs');
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

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.company || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailValidation = validateEmail(formData.contactInfo.email);
    if (!emailValidation.isValid) {
      toast.error(`Contact Email: ${emailValidation.message}`);
      return;
    }

    if (formData.salary.min) {
      const minValidation = validateNumber(formData.salary.min, 0);
      if (!minValidation.isValid) {
        toast.error(`Minimum Salary: ${minValidation.message}`);
        return;
      }
    }

    if (formData.salary.max) {
      const maxValidation = validateNumber(formData.salary.max, 0);
      if (!maxValidation.isValid) {
        toast.error(`Maximum Salary: ${maxValidation.message}`);
        return;
      }
    }

    if (formData.salary.min && formData.salary.max && parseFloat(formData.salary.min) > parseFloat(formData.salary.max)) {
      toast.error('Minimum salary cannot be greater than maximum salary');
      return;
    }

    setSubmitting(true);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim()),
        benefits: formData.benefits.filter(item => item.trim()),
        skills: formData.skills.filter(item => item.trim()),
        responsibilities: formData.responsibilities.filter(item => item.trim())
      };

      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Job updated successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/jobs');
      } else {
        throw new Error(data.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(`Failed to update job: ${error.message}`);
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
            <p className="text-white text-lg">Loading job data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Job | Arsa Nexus Admin</title>
        <meta name="description" content="Edit job opportunity" />
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
                <span className="text-blue-400">💼</span>
                Edit Job
              </h1>
              <p className="text-gray-300">Update job opportunity details</p>
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
                  name="title"
                  label="Job Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="e.g. Senior Frontend Developer"
                />

                <ValidatedInput
                  type="text"
                  name="company"
                  label="Company Name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="e.g. Tech Solutions Inc."
                />

                <ValidatedInput
                  type="select"
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="e.g. New York, NY"
                />

                <ValidatedInput
                  type="select"
                  name="locationType"
                  label="Location Type"
                  value={formData.locationType}
                  onChange={(e) => handleInputChange('locationType', e.target.value)}
                  options={locationTypes.map(type => ({ value: type, label: type }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="select"
                  name="level"
                  label="Experience Level"
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  options={levels.map(level => ({ value: level, label: level }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="select"
                  name="employmentType"
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  options={employmentTypes.map(type => ({ value: type, label: type }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="select"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statuses.map(status => ({ value: status, label: status }))}
                  className="dark bg-white/10"
                />
              </div>

              <div className="mt-6">
                <ValidatedInput
                  type="textarea"
                  name="description"
                  label="Job Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  validation={[required()]}
                  required
                  rows={6}
                  className="dark bg-white/10"
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                />
              </div>
            </div>

            {/* Salary & Dates */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">💰</span>
                Salary & Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="number"
                  name="salaryMin"
                  label="Minimum Salary ($)"
                  value={formData.salary.min}
                  onChange={(e) => handleInputChange('salary.min', e.target.value)}
                  validation={[number(0)]}
                  className="dark bg-white/10"
                  placeholder="50000"
                />

                <ValidatedInput
                  type="number"
                  name="salaryMax"
                  label="Maximum Salary ($)"
                  value={formData.salary.max}
                  onChange={(e) => handleInputChange('salary.max', e.target.value)}
                  validation={[number(0)]}
                  className="dark bg-white/10"
                  placeholder="80000"
                />

                <ValidatedInput
                  type="select"
                  name="salaryPeriod"
                  label="Salary Period"
                  value={formData.salary.period}
                  onChange={(e) => handleInputChange('salary.period', e.target.value)}
                  options={salaryPeriods.map(period => ({ value: period, label: period }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="salaryCurrency"
                  label="Currency"
                  value={formData.salary.currency}
                  onChange={(e) => handleInputChange('salary.currency', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="USD"
                />

                <ValidatedInput
                  type="date"
                  name="applicationDeadline"
                  label="Application Deadline"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  validation={[futureDate()]}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="date"
                  name="startDate"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-cyan-400">📞</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValidatedInput
                  type="email"
                  name="contactEmail"
                  label="Contact Email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  validation={[required(), email()]}
                  required
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="tel"
                  name="contactPhone"
                  label="Contact Phone"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="url"
                  name="contactWebsite"
                  label="Website"
                  value={formData.contactInfo.website}
                  onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Requirements & Responsibilities */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-orange-400">📝</span>
                Requirements & Responsibilities
              </h3>

              {/* Requirements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Requirements *</label>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder={`Requirement ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  + Add Requirement
                </button>
              </div>

              {/* Responsibilities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Responsibilities *</label>
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder={`Responsibility ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('responsibilities', index)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('responsibilities')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  + Add Responsibility
                </button>
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                Options
              </h3>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-white">Featured Job</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={(e) => handleInputChange('urgent', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-white">Urgent Hiring</span>
                </label>
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
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'Update Job'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EditJobPage; 