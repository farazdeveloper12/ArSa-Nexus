import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';

const ServicesPage = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setPageLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          category: categoryFilter
        });

        const response = await fetch(`/api/services?${params}`);
        const data = await response.json();

        if (data.success) {
          setServices(data.data.services);
        } else {
          throw new Error(data.message || 'Failed to fetch services');
        }
      } catch (err) {
        setError('Failed to fetch services');
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchServices();
  }, [searchTerm, categoryFilter]);

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setServices(services.filter(service => service._id !== serviceId));
        alert('Service deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete service');
      }
    } catch (err) {
      alert('Failed to delete service: ' + err.message);
    }
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setServices(services.map(service =>
          service._id === serviceId
            ? { ...service, isActive: !currentStatus }
            : service
        ));
      } else {
        throw new Error(data.message || 'Failed to update service');
      }
    } catch (err) {
      alert('Failed to update service: ' + err.message);
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Services Management | Arsa Nexus LLC</title>
      </Head>

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Services Management</h1>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Service
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-0 max-w-md">
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="AI">AI</option>
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{service.icon}</div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleServiceStatus(service._id, service.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${service.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2">
                      {service.category}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ${service.price > 0 ? service.price : 'Free'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.shortDescription}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📅 {service.duration}</span>
                    <span className={`px-2 py-1 rounded text-xs ${service.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        service.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {service.level}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <Link
                      href={`/admin/services/${service._id}`}
                      className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/services/${service._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-900 font-medium text-sm"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {services.length === 0 && !pageLoading && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first service.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/services/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create your first service
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServicesPage; 