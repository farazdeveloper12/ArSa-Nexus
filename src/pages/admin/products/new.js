import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import FileUpload from '../../../components/ui/FileUpload';

const NewProductPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    images: [],
    features: [],
    specifications: [],
    tags: [],
    inventory: {
      quantity: 0,
      trackInventory: true,
      lowStockThreshold: 5
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    status: 'draft',
    isFeatured: false,
    isDigital: true,
    downloadUrl: ''
  });

  const [imageInput, setImageInput] = useState({ url: '', alt: '' });
  const [featureInput, setFeatureInput] = useState('');
  const [specInput, setSpecInput] = useState({ name: '', value: '' });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const categories = [
    'Software',
    'Course',
    'Service',
    'Consultation',
    'Template',
    'Tool',
    'eBook',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate discount percentage
      if (field === 'price' || field === 'originalPrice') {
        if (updated.originalPrice > 0 && updated.price > 0) {
          updated.discount = Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100);
        }
      }

      // Auto-generate SEO meta title if not manually set
      if (field === 'name' && !updated.seo.metaTitle) {
        updated.seo.metaTitle = value;
      }

      return updated;
    });
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addImage = () => {
    if (imageInput.url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          url: imageInput.url,
          alt: imageInput.alt || prev.name,
          isPrimary: prev.images.length === 0
        }]
      }));
      setImageInput({ url: '', alt: '' });
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (specInput.name.trim() && specInput.value.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { ...specInput }]
      }));
      setSpecInput({ name: '', value: '' });
    }
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    }));
  };

  const handleSubmit = async (status) => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Product name and description are required');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Product ${status === 'active' ? 'published' : 'saved as draft'} successfully!`);
        router.push('/admin/products');
      } else {
        toast.error(result.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name, description and category' },
    { number: 2, title: 'Pricing', description: 'Price and inventory details' },
    { number: 3, title: 'Media & Features', description: 'Images and product features' },
    { number: 4, title: 'SEO & Publish', description: 'SEO settings and publication' }
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter your product name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief one-line description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of your product..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length} characters
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDigital"
                  checked={formData.isDigital}
                  onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isDigital" className="ml-2 block text-sm text-gray-700">
                  Digital Product
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                  Featured Product
                </label>
              </div>
            </div>

            {formData.isDigital && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Download URL
                </label>
                <input
                  type="url"
                  value={formData.downloadUrl}
                  onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/download-link"
                />
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price * ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty if no discount
                </p>
              </div>
            </div>

            {formData.originalPrice > formData.price && formData.originalPrice > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-800 font-medium">
                    {formData.discount}% discount applied
                  </p>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Customers save ${(formData.originalPrice - formData.price).toFixed(2)}
                </p>
              </div>
            )}

            {!formData.isDigital && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Management</h3>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="trackInventory"
                    checked={formData.inventory.trackInventory}
                    onChange={(e) => handleNestedInputChange('inventory', 'trackInventory', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trackInventory" className="ml-2 block text-sm text-gray-700">
                    Track inventory quantity
                  </label>
                </div>

                {formData.inventory.trackInventory && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.inventory.quantity}
                        onChange={(e) => handleNestedInputChange('inventory', 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Alert
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.inventory.lowStockThreshold}
                        onChange={(e) => handleNestedInputChange('inventory', 'lowStockThreshold', parseInt(e.target.value) || 5)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded hover:bg-opacity-100"
                        >
                          Set Primary
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  onUpload={(files) => {
                    const newImages = Array.isArray(files) ? files : [files];
                    newImages.forEach(file => {
                      if (file && file.url) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, {
                            url: file.url,
                            alt: file.originalName || prev.name,
                            isPrimary: prev.images.length === 0
                          }]
                        }));
                      }
                    });
                  }}
                  category="products"
                  multiple={true}
                  label="Product Images"
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Product Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Features
              </label>

              {formData.features.length > 0 && (
                <ul className="mb-4 space-y-2">
                  {formData.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a product feature..."
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Product Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Specifications
              </label>

              {formData.specifications.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span><strong>{spec.name}:</strong> {spec.value}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={specInput.name}
                  onChange={(e) => setSpecInput(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Specification name"
                />
                <input
                  type="text"
                  value={specInput.value}
                  onChange={(e) => setSpecInput(prev => ({ ...prev, value: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Specification value"
                />
              </div>
              <button
                type="button"
                onClick={addSpecification}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Specification
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* SEO Settings */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) => handleNestedInputChange('seo', 'metaTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO title for search engines"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seo.metaTitle.length}/60 characters (recommended)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Meta Description
                  </label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleNestedInputChange('seo', 'metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description for search engine results"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seo.metaDescription.length}/160 characters (recommended)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add an SEO keyword..."
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Review */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Product</h3>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Product Name:</span>
                  <p className="text-gray-900">{formData.name || 'Untitled Product'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-gray-900">{formData.category || 'Uncategorized'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Price:</span>
                  <p className="text-gray-900">${formData.price}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Features:</span>
                  <p className="text-gray-900">{formData.features.length} features added</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Images:</span>
                  <p className="text-gray-900">{formData.images.length} images uploaded</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">SEO Ready:</span>
                  <p className="text-gray-900">
                    {formData.seo.metaTitle && formData.seo.metaDescription ? '✅ Yes' : '❌ Missing SEO data'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Create New Product | Arsa Nexus LLC</title>
      </Head>

      <div className="py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Product</h1>
            <p className="text-gray-600 mt-1">Add a new product to your catalog</p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← Back to Products
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                    }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {renderStep()}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            <div className="flex space-x-3">
              {currentStep === 4 ? (
                <>
                  <button
                    onClick={() => handleSubmit('draft')}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button
                    onClick={() => handleSubmit('active')}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Publishing...' : 'Publish Product'}
                  </button>
                </>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 4}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProductPage; 