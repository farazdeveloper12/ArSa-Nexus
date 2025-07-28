import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/layout/AdminLayout';
import toast from 'react-hot-toast';

const NewInternshipPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    category: '',
    location: '',
    locationType: 'Remote',
    level: 'Entry Level',
    duration: '',
    stipend: {
      amount: '',
      period: 'Month',
      type: 'Paid'
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

  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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
    'Operations'
  ];

  const levels = ['Entry Level', 'Intermediate', 'Advanced'];
  const locationTypes = ['Remote', 'On-site', 'Hybrid'];
  const stipendPeriods = ['Hour', 'Week', 'Month', 'Total'];

  // Handle unauthorized access
  React.useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

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

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.company && formData.description && formData.category;
      case 2:
        return formData.location && formData.duration && formData.applicationDeadline;
      case 3:
        return formData.requirements.some(req => req.trim()) && formData.responsibilities.some(resp => resp.trim());
      case 4:
        return formData.contactInfo.email;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) {
      toast.error('Please fill in all required fields');
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

      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Internship posted successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/internships');
      } else {
        throw new Error(data.message || 'Failed to create internship');
      }
    } catch (error) {
      console.error('Error creating internship:', error);
      toast.error(`Failed to create internship: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
              <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2 border-green-600/20"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stepTitles = [
    'Basic Information',
    'Details & Timeline',
    'Requirements & Responsibilities',
    'Contact & Company Info'
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Post New Internship | Arsa Nexus Admin</title>
        <meta name="description" content="Create a new internship opportunity" />
      </Head>

      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Internship</h1>
          <p className="text-gray-600">Create a new internship opportunity for talented candidates</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep > i + 1
                      ? 'bg-green-600 text-white'
                      : currentStep === i + 1
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                    {currentStep > i + 1 ? '✓' : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-16 h-1 mx-2 ${currentStep > i + 1 ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Step {currentStep}: {stepTitles[currentStep - 1]}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internship Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="e.g. Frontend Developer Intern"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="e.g. Tech Solutions Inc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Describe the internship opportunity, what the intern will learn and contribute..."
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Details & Timeline */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="e.g. New York, NY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Type
                    </label>
                    <select
                      value={formData.locationType}
                      onChange={(e) => handleInputChange('locationType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      {locationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="e.g. 3 months, 6 months"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Stipend Information */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Stipend Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stipend Type
                      </label>
                      <select
                        value={formData.stipend.type}
                        onChange={(e) => handleInputChange('stipend.type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>
                    {formData.stipend.type === 'Paid' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount ($)
                          </label>
                          <input
                            type="number"
                            value={formData.stipend.amount}
                            onChange={(e) => handleInputChange('stipend.amount', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Period
                          </label>
                          <select
                            value={formData.stipend.period}
                            onChange={(e) => handleInputChange('stipend.period', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          >
                            {stipendPeriods.map(period => (
                              <option key={period} value={period}>{period}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Internship</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.urgent}
                      onChange={(e) => handleInputChange('urgent', e.target.checked)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Urgent Hiring</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Step 3: Requirements & Responsibilities */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements *
                  </label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. Basic knowledge of JavaScript"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Requirement
                  </button>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities *
                  </label>
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. Assist in developing web applications"
                      />
                      {formData.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('responsibilities', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Responsibility
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. React, Node.js, MongoDB"
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Skill
                  </button>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. Mentorship, Flexible hours, Certificate"
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('benefits')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Benefit
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact & Company Info */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="hr@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <input
                        type="text"
                        value={formData.companyInfo.size}
                        onChange={(e) => handleInputChange('companyInfo.size', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. 50-100 employees"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={formData.companyInfo.industry}
                        onChange={(e) => handleInputChange('companyInfo.industry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="e.g. Technology, Healthcare"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      value={formData.companyInfo.description}
                      onChange={(e) => handleInputChange('companyInfo.description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="Brief description of the company..."
                    />
                  </div>
                </div>

                {/* Application Process */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Process
                  </label>
                  <textarea
                    value={formData.applicationProcess}
                    onChange={(e) => handleInputChange('applicationProcess', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Describe the application process, interview stages, timeline..."
                  />
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Previous
              </button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Publishing...
                    </div>
                  ) : (
                    'Publish Internship'
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default NewInternshipPage; 