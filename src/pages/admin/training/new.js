import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ValidatedInput from '../../../components/ui/ValidatedInput';
import FileUpload from '../../../components/ui/FileUpload';
import { validateNumber, validateDate, required, number, futureDate } from '../../../utils/validation';
import { SmartInput, SmartTextarea, SmartSelect } from '../../../components/ui/AIFormSuggestions';

const NewTraining = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    price: 0,
    originalPrice: '',
    instructor: {
      name: '',
      bio: '',
      image: ''
    },
    curriculum: [{ module: '', topics: [''], duration: '' }],
    prerequisites: [''],
    whatYouWillLearn: [''],
    features: [''],
    image: '',
    thumbnail: '',
    tags: [''],
    isPopular: false,
    isFeatured: false,
    active: true,
    startDate: '',
    endDate: '',
    schedule: 'Self-paced',
    certificate: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data Science',
    'Digital Marketing',
    'UI/UX Design',
    'Cloud Computing',
    'Cybersecurity'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Validation function
  const validateStep = (step) => {
    let tempErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) tempErrors.title = 'Title is required';
        if (!formData.description.trim()) tempErrors.description = 'Description is required';
        if (!formData.category) tempErrors.category = 'Category is required';
        if (!formData.duration.trim()) tempErrors.duration = 'Duration is required';
        if (formData.price < 0) tempErrors.price = 'Price cannot be negative';
        break;
      case 2: // Instructor & Content
        if (!formData.instructor.name.trim()) tempErrors.instructorName = 'Instructor name is required';
        if (formData.whatYouWillLearn.filter(item => item.trim()).length === 0) {
          tempErrors.whatYouWillLearn = 'At least one learning outcome is required';
        }
        break;
      case 3: // Curriculum
        if (formData.curriculum.length === 0 || !formData.curriculum[0].module.trim()) {
          tempErrors.curriculum = 'At least one curriculum module is required';
        }
        break;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear specific error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add array item
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove array item
  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  // Handle curriculum changes
  const handleCurriculumChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add curriculum module
  const addCurriculumModule = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { module: '', topics: [''], duration: '' }]
    }));
  };

  // Remove curriculum module
  const removeCurriculumModule = (index) => {
    if (formData.curriculum.length > 1) {
      setFormData(prev => ({
        ...prev,
        curriculum: prev.curriculum.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle curriculum topics
  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) =>
        i === moduleIndex
          ? {
            ...module,
            topics: module.topics.map((topic, j) => j === topicIndex ? value : topic)
          }
          : module
      )
    }));
  };

  // Add topic to curriculum module
  const addTopic = (moduleIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) =>
        i === moduleIndex
          ? { ...module, topics: [...module.topics, ''] }
          : module
      )
    }));
  };

  // Remove topic from curriculum module
  const removeTopic = (moduleIndex, topicIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) =>
        i === moduleIndex
          ? { ...module, topics: module.topics.filter((_, j) => j !== topicIndex) }
          : module
      )
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      // Clean up the data
      const cleanedData = {
        ...formData,
        prerequisites: formData.prerequisites.filter(item => item.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim()),
        features: formData.features.filter(item => item.trim()),
        tags: formData.tags.filter(item => item.trim()),
        curriculum: formData.curriculum.map(module => ({
          ...module,
          topics: module.topics.filter(topic => topic.trim())
        })).filter(module => module.module.trim()),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        price: parseFloat(formData.price)
      };

      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Training program "${formData.title}" created successfully!`, {
          duration: 5000,
          icon: '🎉',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/training');
      } else {
        throw new Error(data.message || 'Failed to create training program');
      }
    } catch (error) {
      toast.error(`Failed to create training: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Training details and pricing' },
    { number: 2, title: 'Instructor & Content', description: 'Instructor info and learning outcomes' },
    { number: 3, title: 'Curriculum', description: 'Course modules and structure' },
    { number: 4, title: 'Review & Publish', description: 'Final review and settings' }
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Create New Training Program | Arsa Nexus Admin</title>
        <meta name="description" content="Create a new training program" />
      </Head>

      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Training Program</h1>
            <p className="text-gray-600">Fill in the details to create a comprehensive training program</p>
          </div>
          <Link
            href="/admin/training"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Training Programs
          </Link>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step.number
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                      }`}>
                      {currentStep > step.number ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ml-8 w-12 h-1 rounded-full transition-all duration-300 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
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
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <SmartInput
                          label="Training Title"
                          fieldType="title"
                          value={formData.title}
                          onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                          placeholder="e.g. Complete Web Development Bootcamp"
                          required
                          category="training"
                          className={errors.title ? 'border-red-300' : ''}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.category ? 'border-red-300' : 'border-gray-200'
                            }`}
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                      </div>

                      {/* Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level
                        </label>
                        <select
                          name="level"
                          value={formData.level}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.duration ? 'border-red-300' : 'border-gray-200'
                            }`}
                          placeholder="e.g. 12 weeks, 40 hours"
                        />
                        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.price ? 'border-red-300' : 'border-gray-200'
                            }`}
                          placeholder="99.99"
                        />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.description ? 'border-red-300' : 'border-gray-200'
                            }`}
                          placeholder="Provide a detailed description of the training program..."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Instructor & Content */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor & Content</h2>

                    {/* Instructor Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instructor Name *
                          </label>
                          <input
                            type="text"
                            name="instructor.name"
                            value={formData.instructor.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.instructorName ? 'border-red-300' : 'border-gray-200'
                              }`}
                            placeholder="John Doe"
                          />
                          {errors.instructorName && <p className="mt-1 text-sm text-red-600">{errors.instructorName}</p>}
                        </div>
                        <div>
                          <FileUpload
                            onUpload={(file) => setFormData(prev => ({ ...prev, instructor: { ...prev.instructor, image: file?.url || '' } }))}
                            category="training"
                            multiple={false}
                            existingFiles={formData.instructor.image ? [{ url: formData.instructor.image, originalName: 'Current Image' }] : []}
                            label="Instructor Photo"
                            className="w-full"
                          />
                          {errors.instructorImage && <p className="mt-1 text-sm text-red-600">{errors.instructorImage}</p>}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instructor Bio
                          </label>
                          <textarea
                            name="instructor.bio"
                            value={formData.instructor.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Brief bio about the instructor..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* What You Will Learn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What You Will Learn *
                      </label>
                      {formData.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Learning outcome..."
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('whatYouWillLearn', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('whatYouWillLearn')}
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Learning Outcome
                      </button>
                      {errors.whatYouWillLearn && <p className="mt-1 text-sm text-red-600">{errors.whatYouWillLearn}</p>}
                    </div>

                    {/* Prerequisites */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prerequisites
                      </label>
                      {formData.prerequisites.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Prerequisite..."
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('prerequisites', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('prerequisites')}
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Prerequisite
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Curriculum */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>

                    {formData.curriculum.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Module {moduleIndex + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeCurriculumModule(moduleIndex)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Module Name
                            </label>
                            <input
                              type="text"
                              value={module.module}
                              onChange={(e) => handleCurriculumChange(moduleIndex, 'module', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Module name..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={module.duration}
                              onChange={(e) => handleCurriculumChange(moduleIndex, 'duration', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="e.g. 2 weeks"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Topics
                          </label>
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={topic}
                                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Topic..."
                              />
                              <button
                                type="button"
                                onClick={() => removeTopic(moduleIndex, topicIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addTopic(moduleIndex)}
                            className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Topic
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addCurriculumModule}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Module
                      </div>
                    </button>
                    {errors.curriculum && <p className="mt-1 text-sm text-red-600">{errors.curriculum}</p>}
                  </motion.div>
                )}

                {/* Step 4: Review & Publish */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Publish</h2>

                    {/* Settings */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-3 text-sm font-medium text-gray-700">
                            Publish immediately
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-3 text-sm font-medium text-gray-700">
                            Mark as featured
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isPopular"
                            checked={formData.isPopular}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-3 text-sm font-medium text-gray-700">
                            Mark as popular
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="certificate"
                            checked={formData.certificate}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-3 text-sm font-medium text-gray-700">
                            Includes certificate
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Preview</h3>
                      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
                        <h4 className="text-xl font-bold mb-2">{formData.title || 'Training Title'}</h4>
                        <p className="text-blue-100 mb-4">{formData.description || 'Training description will appear here...'}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-white/20 px-3 py-1 rounded-full">{formData.category || 'Category'}</span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">{formData.level}</span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">{formData.duration || 'Duration'}</span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">${formData.price || '0'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-4">
                {currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Training...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Create Training Program
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default NewTraining; 