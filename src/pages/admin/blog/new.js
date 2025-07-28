import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import FileUpload from '../../../components/ui/FileUpload';

const NewBlogPostPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featuredImage: {
      url: '',
      alt: ''
    },
    status: 'draft',
    isFeatured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const categories = [
    'Technology',
    'Business',
    'Education',
    'Career',
    'Digital Marketing',
    'Web Development',
    'AI & ML',
    'News',
    'Tutorial',
    'Case Study'
  ];

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from title
      if (field === 'title') {
        updated.slug = generateSlug(value);
        // Auto-generate SEO meta title if not manually set
        if (!updated.seo.metaTitle) {
          updated.seo.metaTitle = value;
        }
      }

      // Auto-generate excerpt from content if not manually set
      if (field === 'content' && !updated.excerpt) {
        const plainText = value.replace(/<[^>]*>?/gm, '');
        updated.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
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
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/blog', {
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
        toast.success(`Blog post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
        router.push('/admin/blog');
      } else {
        toast.error(result.message || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('An error occurred while creating the blog post');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Title, content and category' },
    { number: 2, title: 'Media & Tags', description: 'Featured image and tags' },
    { number: 3, title: 'SEO Settings', description: 'Meta data and keywords' },
    { number: 4, title: 'Publish', description: 'Review and publish' }
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
                Post Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Enter your blog post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="url-slug-will-be-auto-generated"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: {typeof window !== 'undefined' ? window.location.origin : 'https://arsanexus.com'}/blog/{formData.slug || 'your-post-slug'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
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
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your blog post content here..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length} characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your post (will be auto-generated if left empty)"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <FileUpload
                onUpload={(file) => {
                  if (file && file.url) {
                    handleNestedInputChange('featuredImage', 'url', file.url);
                    // Auto-generate alt text from filename if not provided
                    if (!formData.featuredImage.alt && file.originalName) {
                      handleNestedInputChange('featuredImage', 'alt', file.originalName.replace(/\.[^/.]+$/, ""));
                    }
                  }
                }}
                category="blog"
                multiple={false}
                existingFiles={formData.featuredImage.url ? [{
                  url: formData.featuredImage.url,
                  originalName: formData.featuredImage.alt || 'Featured Image'
                }] : []}
                label="Featured Image"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                type="text"
                value={formData.featuredImage.alt}
                onChange={(e) => handleNestedInputChange('featuredImage', 'alt', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image for accessibility"
              />
            </div>

            {formData.featuredImage.url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <img
                    src={formData.featuredImage.url}
                    alt={formData.featuredImage.alt}
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                Feature this post (will appear in featured sections)
              </label>
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
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Post</h3>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Title:</span>
                  <p className="text-gray-900">{formData.title || 'Untitled Post'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-gray-900">{formData.category || 'Uncategorized'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Tags:</span>
                  <p className="text-gray-900">{formData.tags.length > 0 ? formData.tags.join(', ') : 'No tags'}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Content Length:</span>
                  <p className="text-gray-900">{formData.content.length} characters</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">SEO Ready:</span>
                  <p className="text-gray-900">
                    {formData.seo.metaTitle && formData.seo.metaDescription ? '✅ Yes' : '❌ Missing SEO data'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-800 font-medium mb-2">Publishing Options</h4>
              <p className="text-blue-700 text-sm">
                You can save this post as a draft to review later, or publish it immediately to make it live on your website.
              </p>
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
        <title>Create New Blog Post | Arsa Nexus LLC</title>
      </Head>

      <div className="py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Blog Post</h1>
            <p className="text-gray-600 mt-1">Share your knowledge with the world</p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← Back to Blog
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
                    onClick={() => handleSubmit('published')}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Publishing...' : 'Publish Post'}
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

export default NewBlogPostPage; 