import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/layout/AdminLayout';
import toast from 'react-hot-toast';
import ActionButtons from '../../../components/admin/ActionButtons';

const ProductsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication with improved race condition handling
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session) {
      router.push('/admin/login');
      return;
    }

    if (session && !['admin', 'manager'].includes(session.user?.role)) {
      router.push('/admin/login');
      return;
    }

    // Only fetch data if we have a valid session
    if (session && ['admin', 'manager'].includes(session.user?.role)) {
      fetchProducts();
    }
  }, [session, status, router, searchTerm, categoryFilter, statusFilter, sortBy]);

  const fetchProducts = async () => {
    setPageLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter || 'active',
        sortBy: sortBy.split('_')[0],
        sortOrder: sortBy.split('_')[1]
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setPageLoading(false);
    }
  };

  if (status === 'loading' || pageLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies/session are sent
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success(`${product.name} has been deleted successfully`, {
          duration: 4000,
          icon: '🗑️',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error(`Failed to delete product: ${error.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Product Management | Arsa Nexus Admin</title>
        <meta name="description" content="Manage products and services" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-orange-400">📦</span>
              Product Management
            </h1>
            <p className="text-gray-300">
              Manage products and services. Total: <span className="font-semibold text-orange-400">{products.length}</span> products
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </Link>
          </motion.div>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 bg-red-500/20 border border-red-500/30 backdrop-blur-md rounded-xl p-4 text-red-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">🔍</span>
              Search & Filter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white transition-all duration-200"
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                >
                  <option value="" className="bg-gray-800">All Categories</option>
                  <option value="Software" className="bg-gray-800">Software</option>
                  <option value="Hardware" className="bg-gray-800">Hardware</option>
                  <option value="Training" className="bg-gray-800">Training</option>
                  <option value="Consulting" className="bg-gray-800">Consulting</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white transition-all duration-200"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="" className="bg-gray-800">All Statuses</option>
                  <option value="active" className="bg-gray-800">Active</option>
                  <option value="out_of_stock" className="bg-gray-800">Out of Stock</option>
                  <option value="upcoming" className="bg-gray-800">Upcoming</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white transition-all duration-200"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="createdAt_desc" className="bg-gray-800">Newest First</option>
                  <option value="createdAt_asc" className="bg-gray-800">Oldest First</option>
                  <option value="name_asc" className="bg-gray-800">Name (A-Z)</option>
                  <option value="name_desc" className="bg-gray-800">Name (Z-A)</option>
                  <option value="price_asc" className="bg-gray-800">Price (Low to High)</option>
                  <option value="price_desc" className="bg-gray-800">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {products.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
                  >
                    {/* Product Image/Header */}
                    <div className="h-48 relative bg-gradient-to-br from-orange-500/20 to-red-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-full h-full bg-gradient-to-br ${product.category === 'Software' ? 'from-blue-600/80 to-purple-600/80' : 'from-orange-600/80 to-red-600/80'} flex items-center justify-center`}>
                          <h3 className="text-2xl font-bold text-white text-center px-4">{product.name}</h3>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          product.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-white/10 text-gray-300 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full border border-white/20">
                          {product.category}
                        </span>
                        <span className="text-lg font-bold text-white">${product.price}</span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
                        >
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          className="px-3 py-2 text-sm font-medium text-orange-400 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                        <ActionButtons
                          itemId={product._id}
                          itemName={product.name}
                          basePath="/admin/products"
                          deleteApi="/api/products"
                          onDelete={handleDeleteProduct}
                          viewTitle="View Product"
                          editTitle="Edit Product"
                          deleteTitle="Delete Product"
                          deleteConfirmText={`Are you sure you want to delete "${product.name}"? This will permanently remove the product and all associated data.`}
                          className="justify-center"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mx-auto h-24 w-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || categoryFilter || statusFilter
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by creating your first product.'
                }
              </p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Product
              </Link>
            </motion.div>
          )}

          {/* Pagination */}
          {products.length > 0 && totalPages > 1 && (
            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-300">
                    Showing page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white/20 bg-white/10 text-sm font-medium text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">First</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="relative inline-flex items-center px-2 py-2 border border-white/20 bg-white/10 text-sm font-medium text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;

                      if (pageNum <= 0 || pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${currentPage === pageNum
                            ? 'z-10 bg-orange-500/30 border-orange-500/50 text-white'
                            : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="relative inline-flex items-center px-2 py-2 border border-white/20 bg-white/10 text-sm font-medium text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white/20 bg-white/10 text-sm font-medium text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Last</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;