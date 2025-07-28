import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';

const NewServicePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Programming',
    icon: '🔧',
    features: [''],
    price: 0,
    duration: '1 month',
    level: 'Beginner',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description cannot be more than 200 characters';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: filteredFeatures
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Service created successfully!');
        router.push('/admin/services');
      } else {
        alert('Error: ' + (data.message || 'Failed to create service'));
      }
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Failed to create service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add New Service | Arsa Nexus Admin</title>
      </Head>

      <div className="py-6">
        <div className="mb-6 flex items-center">
          <Link href="/admin/services" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Service</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter service title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AI">AI</option>
                  <option value="Programming">Programming</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Brief description for cards"
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Detailed service description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🔧"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1 month, 6 weeks"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a feature"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Feature
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/services"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md mr-2 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

NewServicePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default NewServicePage; 