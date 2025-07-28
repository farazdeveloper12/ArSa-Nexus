import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const categories = ['Software', 'Course', 'Service', 'Consultation', 'Template', 'Tool', 'eBook'];
  const priceRanges = [
    { label: 'Free', value: 'free' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: '200+' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?status=active');
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange) {
      switch (priceRange) {
        case 'free':
          filtered = filtered.filter(product => product.price === 0);
          break;
        case '0-50':
          filtered = filtered.filter(product => product.price > 0 && product.price <= 50);
          break;
        case '50-100':
          filtered = filtered.filter(product => product.price > 50 && product.price <= 100);
          break;
        case '100-200':
          filtered = filtered.filter(product => product.price > 100 && product.price <= 200);
          break;
        case '200+':
          filtered = filtered.filter(product => product.price > 200);
          break;
      }
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange('');
    setSortBy('newest');
  };

  const handleFreeDownload = (product) => {
    // Handle free product download
    if (product.downloadUrl) {
      window.open(product.downloadUrl, '_blank');
      toast.success(`✅ ${product.name} download started!`);
    } else {
      // Send contact info for manual delivery
      const message = `Hi! I'd like to download the free product: ${product.name}. Please provide the download link.`;
      window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
      toast.success('📱 Contact message sent for download link!');
    }
  };

  const handleProductPurchase = (product) => {
    // Handle paid product purchase
    if (product.purchaseUrl) {
      // Direct to purchase/payment page
      window.open(product.purchaseUrl, '_blank');
      toast.success(`🛒 Redirecting to purchase ${product.name}...`);
    } else {
      // Contact for purchase via WhatsApp
      const message = `Hi! I'm interested in purchasing: ${product.name} ($${product.price}). Please provide payment details and purchase instructions.`;
      window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
      toast.success('💬 Purchase inquiry sent via WhatsApp!');
    }
  };

  const ProductCard = ({ product, index }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true });

    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    const hasDiscount = product.originalPrice > product.price && product.originalPrice > 0;
    const discountPercentage = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group"
      >
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-blue-100 text-sm">{product.category}</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ⭐ Featured
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                -{discountPercentage}% OFF
              </span>
            )}
            {product.isDigital && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                📱 Digital
              </span>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.shortDescription || product.description.substring(0, 120) + '...'}
            </p>
          </div>

          {/* Features Preview */}
          {product.features && product.features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                  >
                    ✓ {feature}
                  </span>
                ))}
                {product.features.length > 3 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{product.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasDiscount && (
                <span className="text-gray-400 line-through text-sm">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                {product.price === 0 ? 'Free' : `$${product.price}`}
              </span>
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={() => {
                  if (product.price === 0) {
                    // Handle free product download
                    handleFreeDownload(product);
                  } else {
                    // Handle paid product purchase
                    handleProductPurchase(product);
                  }
                }}
              >
                {product.price === 0 ? 'Get Free' : 'Buy Now'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  toast.success('Added to wishlist!');
                }}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <Head>
        <title>Products | Arsa Nexus - Premium Digital Solutions</title>
        <meta name="description" content="Discover our premium collection of digital products, tools, and educational resources designed to accelerate your professional growth." />
        <meta name="keywords" content="digital products, software tools, educational resources, professional development" />
      </Head>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative pt-24 pb-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Premium Digital
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 block mt-2">
                Products & Tools
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Discover our curated collection of professional-grade digital products, educational resources,
              and innovative tools designed to accelerate your success.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: '🚀', title: 'Professional Tools', desc: 'Industry-standard software' },
                { icon: '📚', title: 'Educational Content', desc: 'Comprehensive learning materials' },
                { icon: '💎', title: 'Premium Quality', desc: 'Carefully curated selection' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-white font-semibold mb-1">{item.title}</div>
                  <div className="text-gray-400 text-sm">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters and Search */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Prices</option>
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory || priceRange) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Category: {selectedCategory}
                  </span>
                )}
                {priceRange && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    Price: {priceRanges.find(r => r.value === priceRange)?.label}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or clearing the filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Can't find exactly what you're looking for? Our team can create custom digital products
            tailored to your specific needs and requirements.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Get Custom Quote 💬
          </motion.a>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default ProductsPage; 