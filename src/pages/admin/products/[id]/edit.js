import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ValidatedInput from '../../../../components/ui/ValidatedInput';
import { validateNumber, validateUrl, required, number, url } from '../../../../utils/validation';

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'Digital',
    pricing: {
      price: '',
      salePrice: '',
      currency: 'USD'
    },
    features: [''],
    specifications: {
      version: '',
      size: '',
      format: '',
      compatibility: ''
    },
    media: {
      images: [''],
      videos: [''],
      documents: ['']
    },
    availability: {
      inStock: true,
      quantity: '',
      releaseDate: ''
    },
    tags: [''],
    metadata: {
      sku: '',
      brand: '',
      model: '',
      weight: '',
      dimensions: ''
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    featured: false,
    bestseller: false,
    status: 'Active'
  });

  const categories = [
    'Software',
    'Hardware',
    'Services',
    'Training',
    'Consulting',
    'Digital Products',
    'Physical Products',
    'Subscriptions',
    'Templates',
    'Courses',
    'Tools',
    'Apps',
    'Plugins',
    'Extensions'
  ];

  const types = ['Digital', 'Physical', 'Service', 'Subscription'];
  const statuses = ['Draft', 'Active', 'Inactive', 'Out of Stock', 'Discontinued'];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'manager', 'editor'].includes(session.user.role)) {
      router.push('/auth/login');
      return;
    }
    if (id) {
      fetchProduct();
    }
  }, [session, status, router, id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (data.success || data.product) {
        const productData = data.product || data.data;
        setProduct(productData);
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          category: productData.category || '',
          type: productData.type || 'Digital',
          pricing: {
            price: productData.pricing?.price || '',
            salePrice: productData.pricing?.salePrice || '',
            currency: productData.pricing?.currency || 'USD'
          },
          features: productData.features || [''],
          specifications: {
            version: productData.specifications?.version || '',
            size: productData.specifications?.size || '',
            format: productData.specifications?.format || '',
            compatibility: productData.specifications?.compatibility || ''
          },
          media: {
            images: productData.media?.images || [''],
            videos: productData.media?.videos || [''],
            documents: productData.media?.documents || ['']
          },
          availability: {
            inStock: productData.availability?.inStock !== false,
            quantity: productData.availability?.quantity || '',
            releaseDate: productData.availability?.releaseDate ?
              new Date(productData.availability.releaseDate).toISOString().split('T')[0] : ''
          },
          tags: productData.tags || [''],
          metadata: {
            sku: productData.metadata?.sku || '',
            brand: productData.metadata?.brand || '',
            model: productData.metadata?.model || '',
            weight: productData.metadata?.weight || '',
            dimensions: productData.metadata?.dimensions || ''
          },
          seo: {
            title: productData.seo?.title || '',
            description: productData.seo?.description || '',
            keywords: productData.seo?.keywords || ''
          },
          featured: productData.featured || false,
          bestseller: productData.bestseller || false,
          status: productData.status || 'Active'
        });
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product data');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
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
        [field]: [...prev[field], '']
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.pricing.price) {
      const priceValidation = validateNumber(formData.pricing.price, 0);
      if (!priceValidation.isValid) {
        toast.error(`Price: ${priceValidation.message}`);
        return;
      }
    }

    if (formData.pricing.salePrice) {
      const salePriceValidation = validateNumber(formData.pricing.salePrice, 0);
      if (!salePriceValidation.isValid) {
        toast.error(`Sale Price: ${salePriceValidation.message}`);
        return;
      }
    }

    setSubmitting(true);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        features: formData.features.filter(item => item.trim()),
        tags: formData.tags.filter(item => item.trim()),
        media: {
          images: formData.media.images.filter(item => item.trim()),
          videos: formData.media.videos.filter(item => item.trim()),
          documents: formData.media.documents.filter(item => item.trim())
        }
      };

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product updated successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
        router.push('/admin/products');
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Failed to update product: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            <p className="text-white text-lg">Loading product data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Product | Arsa Nexus Admin</title>
        <meta name="description" content="Edit product information" />
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
                <span className="text-orange-400">📦</span>
                Edit Product
              </h1>
              <p className="text-gray-300">Update product information and details</p>
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
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  validation={[required()]}
                  required
                  className="dark bg-white/10"
                  placeholder="e.g. Premium Web Design Package"
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
                  name="type"
                  label="Product Type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  options={types.map(type => ({ value: type, label: type }))}
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
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  validation={[required()]}
                  required
                  rows={6}
                  className="dark bg-white/10"
                  placeholder="Describe the product, its features, and benefits..."
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">💰</span>
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValidatedInput
                  type="number"
                  name="price"
                  label="Regular Price ($)"
                  value={formData.pricing.price}
                  onChange={(e) => handleInputChange('pricing.price', e.target.value)}
                  validation={[number(0)]}
                  className="dark bg-white/10"
                  placeholder="99.99"
                />

                <ValidatedInput
                  type="number"
                  name="salePrice"
                  label="Sale Price ($)"
                  value={formData.pricing.salePrice}
                  onChange={(e) => handleInputChange('pricing.salePrice', e.target.value)}
                  validation={[number(0)]}
                  className="dark bg-white/10"
                  placeholder="79.99"
                />

                <ValidatedInput
                  type="text"
                  name="currency"
                  label="Currency"
                  value={formData.pricing.currency}
                  onChange={(e) => handleInputChange('pricing.currency', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="USD"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-purple-400">📊</span>
                Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.availability.inStock}
                    onChange={(e) => handleInputChange('availability.inStock', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">In Stock</span>
                </div>

                <ValidatedInput
                  type="number"
                  name="quantity"
                  label="Quantity"
                  value={formData.availability.quantity}
                  onChange={(e) => handleInputChange('availability.quantity', e.target.value)}
                  validation={[number(0)]}
                  className="dark bg-white/10"
                  placeholder="100"
                />

                <ValidatedInput
                  type="date"
                  name="releaseDate"
                  label="Release Date"
                  value={formData.availability.releaseDate}
                  onChange={(e) => handleInputChange('availability.releaseDate', e.target.value)}
                  className="dark bg-white/10"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-cyan-400">⭐</span>
                Features
              </h3>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
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
                  onClick={() => addArrayItem('features')}
                  className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">🔧</span>
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="text"
                  name="version"
                  label="Version"
                  value={formData.specifications.version}
                  onChange={(e) => handleInputChange('specifications.version', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="v2.1.0"
                />

                <ValidatedInput
                  type="text"
                  name="size"
                  label="Size"
                  value={formData.specifications.size}
                  onChange={(e) => handleInputChange('specifications.size', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="25 MB"
                />

                <ValidatedInput
                  type="text"
                  name="format"
                  label="Format"
                  value={formData.specifications.format}
                  onChange={(e) => handleInputChange('specifications.format', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="ZIP, PDF, PSD"
                />

                <ValidatedInput
                  type="text"
                  name="compatibility"
                  label="Compatibility"
                  value={formData.specifications.compatibility}
                  onChange={(e) => handleInputChange('specifications.compatibility', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="Windows, Mac, Linux"
                />
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-red-400">📊</span>
                Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  type="text"
                  name="sku"
                  label="SKU"
                  value={formData.metadata.sku}
                  onChange={(e) => handleInputChange('metadata.sku', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="WEB-DESIGN-001"
                />

                <ValidatedInput
                  type="text"
                  name="brand"
                  label="Brand"
                  value={formData.metadata.brand}
                  onChange={(e) => handleInputChange('metadata.brand', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="Arsa Nexus"
                />

                <ValidatedInput
                  type="text"
                  name="model"
                  label="Model"
                  value={formData.metadata.model}
                  onChange={(e) => handleInputChange('metadata.model', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="Premium 2024"
                />

                <ValidatedInput
                  type="text"
                  name="weight"
                  label="Weight"
                  value={formData.metadata.weight}
                  onChange={(e) => handleInputChange('metadata.weight', e.target.value)}
                  className="dark bg-white/10"
                  placeholder="Digital Product"
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-indigo-400">⚙️</span>
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
                  <span className="text-white">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => handleInputChange('bestseller', e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-white">Bestseller</span>
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
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'Update Product'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EditProductPage; 