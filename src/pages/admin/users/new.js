import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/layout/AdminLayout';
import toast, { Toaster } from 'react-hot-toast';

const NewUser = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    active: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  // Available roles with descriptions
  const roles = [
    {
      value: 'user',
      label: 'User',
      description: 'Can access basic features and training programs',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      value: 'employee',
      label: 'Employee',
      description: 'Can manage assigned tasks and content',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Can manage employees and content',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      value: 'instructor',
      label: 'Instructor',
      description: 'Can create and manage training content',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Full access to all features and settings',
      color: 'bg-red-100 text-red-800 border-red-200'
    }
  ];

  // SIMPLIFIED Validation function - GUARANTEED TO WORK
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password || formData.password === '') {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation  
    if (!formData.confirmPassword || formData.confirmPassword === '') {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    console.log('🔍 Validation Debug:', {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      match: formData.password === formData.confirmPassword,
      errors: newErrors
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Special handling for password fields - clear confirm password error when either changes
    if ((name === 'password' || name === 'confirmPassword') && errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug password comparison
    console.log('🔍 Password Debug:', {
      password: `"${formData.password}"`,
      confirmPassword: `"${formData.confirmPassword}"`,
      passwordLength: formData.password.length,
      confirmPasswordLength: formData.confirmPassword.length,
      areEqual: formData.password === formData.confirmPassword,
      trimmedEqual: formData.password.trim() === formData.confirmPassword.trim()
    });

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password.trim(),
          confirmPassword: formData.confirmPassword.trim(),
          role: formData.role,
          active: formData.active
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('User created successfully! 🎉', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
          },
        });

        // Redirect after a brief delay
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to create user', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#ffffff',
            fontWeight: '500',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
          },
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#ffffff',
          fontWeight: '500',
          fontSize: '14px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
      transition: { duration: 0.2 }
    }
  };

  // Check authentication
  React.useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  if (!session || !['admin', 'manager'].includes(session.user.role)) {
    return <div>Access denied. Admin or Manager privileges required.</div>;
  }

  return (
    <>
      <Head>
        <title>Add New User | Arsa Nexus Admin</title>
        <meta name="description" content="Create a new user account" />
      </Head>

      <Toaster />

      <AdminLayout>
        <motion.div
          className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="p-8">
            {/* Header */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-6">
                <Link
                  href="/admin/users"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
                  <p className="text-gray-600 mt-1">Create a new user account with specific roles and permissions</p>
                </div>
              </div>
            </motion.div>

            {/* Main Form Container */}
            <motion.div
              className="max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <motion.div variants={itemVariants}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        Basic Information
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <motion.div
                          className="space-y-2"
                          variants={inputVariants}
                          animate={focusedField === 'name' ? 'focused' : 'unfocused'}
                        >
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField('')}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${errors.name
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                              } focus:ring-4 focus:outline-none`}
                            placeholder="Enter full name"
                          />
                          <AnimatePresence>
                            {errors.name && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        {/* Email Field */}
                        <motion.div
                          className="space-y-2"
                          variants={inputVariants}
                          animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                        >
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${errors.email
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                              } focus:ring-4 focus:outline-none`}
                            placeholder="Enter email address"
                          />
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Password Section */}
                    <motion.div variants={itemVariants}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        Security
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Password Field */}
                        <motion.div
                          className="space-y-2"
                          variants={inputVariants}
                          animate={focusedField === 'password' ? 'focused' : 'unfocused'}
                        >
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.password ? 'text' : 'password'}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('password')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 ${errors.password
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                } focus:ring-4 focus:outline-none`}
                              placeholder="Enter password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, password: !prev.password }))}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPasswords.password ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                              </svg>
                            </button>
                          </div>
                          <AnimatePresence>
                            {errors.password && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.password}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        {/* Confirm Password Field */}
                        <motion.div
                          className="space-y-2"
                          variants={inputVariants}
                          animate={focusedField === 'confirmPassword' ? 'focused' : 'unfocused'}
                        >
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirmPassword ? 'text' : 'password'}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('confirmPassword')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 ${errors.confirmPassword
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                } focus:ring-4 focus:outline-none`}
                              placeholder="Confirm password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPasswords.confirmPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                              </svg>
                            </button>
                          </div>
                          <AnimatePresence>
                            {errors.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-sm text-red-600 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.confirmPassword}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Role Selection */}
                    <motion.div variants={itemVariants}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        Role & Permissions
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles.map((role) => (
                          <motion.label
                            key={role.value}
                            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${formData.role === role.value
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                              }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={role.value}
                              checked={formData.role === role.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-200 ${formData.role === role.value
                                ? 'border-blue-500 bg-blue-500 shadow-sm'
                                : 'border-gray-300'
                                }`}>
                                {formData.role === role.value && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-full h-full rounded-full bg-white flex items-center justify-center"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                  </motion.div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{role.label}</span>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${role.color}`}>
                                    {role.value}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{role.description}</p>
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </motion.div>

                    {/* Account Status */}
                    <motion.div variants={itemVariants}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                          </svg>
                        </div>
                        Account Status
                      </h2>

                      <motion.label
                        className="flex items-center gap-3 cursor-pointer"
                        whileHover={{ x: 2 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-all duration-200 ${formData.active ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                            <motion.div
                              className="w-5 h-5 bg-white rounded-full shadow-md"
                              animate={{
                                x: formData.active ? 26 : 2,
                              }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              style={{ y: 2 }}
                            />
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Account is {formData.active ? 'Active' : 'Inactive'}
                          </span>
                          <p className="text-sm text-gray-600">
                            {formData.active
                              ? 'User can log in and access the system'
                              : 'User account is disabled and cannot log in'
                            }
                          </p>
                        </div>
                      </motion.label>
                    </motion.div>

                    {/* Form Actions */}
                    <motion.div
                      className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200"
                      variants={itemVariants}
                    >
                      <Link
                        href="/admin/users"
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-sm"
                      >
                        Cancel
                      </Link>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                          } text-white shadow-md`}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating User...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create User
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AdminLayout>
    </>
  );
};

export default NewUser;