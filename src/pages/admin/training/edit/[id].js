import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ValidatedInput from '../../../../components/ui/ValidatedInput';
import FileUpload from '../../../../components/ui/FileUpload';
import { validateNumber, validateDate, required, number, futureDate } from '../../../../utils/validation';

const EditTrainingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [training, setTraining] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    price: '',
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
  const schedules = ['Self-paced', 'Live', 'Blended'];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'instructor', 'manager'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
    if (id) {
      fetchTraining();
    }
  }, [session, status, router, id]);

  const fetchTraining = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/training/${id}`);
      const data = await response.json();

      if (data.success) {
        const trainingData = data.data;
        setTraining(trainingData);
        setFormData({
          title: trainingData.title || '',
          description: trainingData.description || '',
          category: trainingData.category || '',
          level: trainingData.level || 'Beginner',
          duration: trainingData.duration || '',
          price: trainingData.price || '',
          originalPrice: trainingData.originalPrice || '',
          instructor: {
            name: trainingData.instructor?.name || '',
            bio: trainingData.instructor?.bio || '',
            image: trainingData.instructor?.image || ''
          },
          curriculum: trainingData.curriculum || [{ module: '', topics: [''], duration: '' }],
          prerequisites: trainingData.prerequisites || [''],
          whatYouWillLearn: trainingData.whatYouWillLearn || [''],
          features: trainingData.features || [''],
          image: trainingData.image || '',
          thumbnail: trainingData.thumbnail || '',
          tags: trainingData.tags || [''],
          isPopular: trainingData.isPopular || false,
          isFeatured: trainingData.isFeatured || false,
          active: trainingData.active !== false,
          startDate: trainingData.startDate ?
            new Date(trainingData.startDate).toISOString().split('T')[0] : '',
          endDate: trainingData.endDate ?
            new Date(trainingData.endDate).toISOString().split('T')[0] : '',
          schedule: trainingData.schedule || 'Self-paced',
          certificate: trainingData.certificate !== false
        });
      } else {
        throw new Error(data.message || 'Failed to fetch training');
      }
    } catch (error) {
      console.error('Error fetching training:', error);
      toast.error('Failed to load training data');
      router.push('/admin/training');
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
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: prev[parent][child].map((item, i) => i === index ? value : item)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    }
  };

  const addArrayItem = (field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: [...prev[parent][child], '']
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], field === 'curriculum' ? { module: '', topics: [''], duration: '' } : '']
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: prev[parent][child].filter((_, i) => i !== index)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleCurriculumChange = (currIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === currIndex ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleTopicChange = (currIndex, topicIndex, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === currIndex ? {
          ...item,
          topics: item.topics.map((topic, j) => j === topicIndex ? value : topic)
        } : item
      )
    }));
  };

  const addTopic = (currIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === currIndex ? { ...item, topics: [...item.topics, ''] } : item
      )
    }));
  };

  const removeTopic = (currIndex, topicIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === currIndex ? {
          ...item,
          topics: item.topics.filter((_, j) => j !== topicIndex)
        } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price) {
      const priceValidation = validateNumber(formData.price, 0);
      if (!priceValidation.isValid) {
        toast.error(`Price: ${priceValidation.message}`);
        return;
      }
    }

    if (formData.originalPrice) {
      const originalPriceValidation = validateNumber(formData.originalPrice, 0);
      if (!originalPriceValidation.isValid) {
        toast.error(`Original Price: ${originalPriceValidation.message}`);
        return;
      }
    }

    setSubmitting(true);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        prerequisites: formData.prerequisites.filter(item => item.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim()),
        features: formData.features.filter(item => item.trim()),
        tags: formData.tags.filter(item => item.trim()),
        curriculum: formData.curriculum.filter(curr =>
          curr.module.trim() && curr.topics.some(topic => topic.trim())
        ).map(curr => ({
          ...curr,
          topics: curr.topics.filter(topic => topic.trim())
        }))
      };

      const response = await fetch(`/api/training/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Training updated successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/training');
      } else {
        throw new Error(data.message || 'Failed to update training');
      }
    } catch (error) {
      console.error('Error updating training:', error);
      toast.error(`Failed to update training: ${error.message}`);
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
            <p className="text-white text-lg">Loading training data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Training | Arsa Nexus Admin</title>
        <meta name="description" content="Edit training program" />
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
                <span className="text-purple-400">🎓</span>
                Edit Training Program
              </h1>
              <p className="text-gray-300">Update training program details and curriculum</p>
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
                  label="Training Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="e.g. Complete Web Development Bootcamp"
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
                  type="select"
                  name="level"
                  label="Difficulty Level"
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  options={levels.map(level => ({ value: level, label: level }))}
                  className="dark bg-white/10"
                />

                <ValidatedInput
                  type="text"
                  name="duration"
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="e.g. 12 weeks"
                />

                <ValidatedInput
                  type="number"
                  name="price"
                  label="Price ($)"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  validation={[required(), number(0)]}
                  required
                  className="dark bg-white/10"
                  placeholder="299"
                />

                <ValidatedInput
                  type="number"
                  name="originalPrice"
                  label="Original Price ($)"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  validation={[number(0)]}
                  className="dark bg-white/10"
                  placeholder="399"
                />
              </div>

              <div className="mt-6">
                <ValidatedInput
                  type="textarea"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  validation={[required()]}
                  required
                  rows={6}
                  className="dark bg-white/10"
                  placeholder="Describe what students will learn in this training program..."
                />
              </div>
            </div>

            {/* Instructor Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">👨‍🏫</span>
                Instructor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="text"
                  name="instructorName"
                  label="Instructor Name"
                  value={formData.instructor.name}
                  onChange={(e) => handleInputChange('instructor.name', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="John Doe"
                />

                <div>
                  <FileUpload
                    onUpload={(file) => handleInputChange('instructor.image', file?.url || '')}
                    category="training"
                    multiple={false}
                    existingFiles={formData.instructor.image ? [{ url: formData.instructor.image, originalName: 'Current Image' }] : []}
                    label="Instructor Photo"
                    className="dark"
                  />
                </div>
              </div>

              <div className="mt-6">
                <ValidatedInput
                  type="textarea"
                  name="instructorBio"
                  label="Instructor Bio"
                  value={formData.instructor.bio}
                  onChange={(e) => handleInputChange('instructor.bio', e.target.value)}
                  rows={4}
                  className="dark bg-white/10"
                  placeholder="Brief bio about the instructor..."
                />
              </div>
            </div>

            {/* What Students Will Learn */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-cyan-400">🎯</span>
                What Students Will Learn
              </h3>
              <div className="space-y-3">
                {formData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder={`Learning outcome ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('whatYouWillLearn', index)}
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
                  onClick={() => addArrayItem('whatYouWillLearn')}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  + Add Learning Outcome
                </button>
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">⚙️</span>
                Options
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-white">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-white">Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-white">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certificate}
                    onChange={(e) => handleInputChange('certificate', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Certificate</span>
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
                  'Update Training'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EditTrainingPage; 