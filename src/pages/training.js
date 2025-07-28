import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const TrainingPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, rating

  // Categories
  const categories = [
    { id: 'all', name: 'All Programs', count: 0 },
    { id: 'Web Development', name: 'Web Development', count: 0 },
    { id: 'Mobile Development', name: 'Mobile Development', count: 0 },
    { id: 'AI & Machine Learning', name: 'AI & Machine Learning', count: 0 },
    { id: 'Data Science', name: 'Data Science', count: 0 },
    { id: 'Digital Marketing', name: 'Digital Marketing', count: 0 },
    { id: 'UI/UX Design', name: 'UI/UX Design', count: 0 },
    { id: 'Cloud Computing', name: 'Cloud Computing', count: 0 },
    { id: 'Cybersecurity', name: 'Cybersecurity', count: 0 },
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'Beginner', name: 'Beginner' },
    { id: 'Intermediate', name: 'Intermediate' },
    { id: 'Advanced', name: 'Advanced' },
  ];

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  useEffect(() => {
    filterAndSortPrograms();
  }, [programs, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/training?active=true');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && result.data.trainings) {
        // Filter out invalid training records
        const validTrainings = result.data.trainings.filter(training => {
          return training &&
            training._id &&
            training.title &&
            training.title.length > 3 &&
            !training.title.match(/^[a-z]{8,}$/) && // Filter out random strings like 'rwqerew'
            training.description &&
            training.description.length > 10 &&
            training.price !== undefined &&
            training.category;
        });

        console.log(`🔍 Filtered ${result.data.trainings.length - validTrainings.length} invalid training records`);
        setPrograms(validTrainings);
      } else {
        throw new Error('No training data received');
      }
    } catch (error) {
      console.error('Error fetching training programs:', error);
      toast.error(`Failed to load training programs: ${error.message}`);
      setPrograms([]); // Set empty array instead of leaving undefined
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPrograms = () => {
    let filtered = [...programs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof program.instructor === 'string' ? program.instructor : program.instructor?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(program => program.category === selectedCategory);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(program => program.level === selectedLevel);
    }

    // Apply sorting
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredPrograms(filtered);
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Web Development': 'from-blue-500 to-indigo-600',
      'Mobile Development': 'from-green-500 to-teal-600',
      'AI & Machine Learning': 'from-purple-500 to-fuchsia-600',
      'Data Science': 'from-emerald-500 to-teal-600',
      'Digital Marketing': 'from-orange-500 to-red-600',
      'UI/UX Design': 'from-pink-500 to-purple-600',
      'Cloud Computing': 'from-blue-500 to-cyan-600',
      'Cybersecurity': 'from-red-500 to-pink-600',
    };
    return colorMap[category] || 'from-gray-500 to-gray-600';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Training Programs | Arsa Nexus - Professional Development Courses</title>
        <meta name="description" content="Explore our comprehensive training programs designed to advance your career in technology, digital marketing, and more." />
        <meta name="keywords" content="training, courses, web development, AI, machine learning, digital marketing, UI/UX design" />
        <meta property="og:title" content="Training Programs | Arsa Nexus" />
        <meta property="og:description" content="Professional development courses to advance your career" />
        <meta property="og:type" content="website" />
      </Head>

      <div ref={sectionRef} className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <motion.section
          className="relative z-10 pt-24 pb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                className="inline-block py-2 px-4 rounded-full bg-blue-600/20 text-blue-400 text-sm backdrop-blur-sm border border-blue-500/20 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Professional Training Programs
              </motion.span>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Transform Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 block">
                  Career Journey
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Master cutting-edge technologies and advance your career with our industry-leading training programs.
                Designed by experts, delivered with excellence.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-12 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search Programs</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Search by title, category, or instructor..."
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort and Results Count */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-800">
                <div className="text-gray-400 text-sm mb-4 sm:mb-0">
                  Showing <span className="text-white font-medium">{filteredPrograms.length}</span> of <span className="text-white font-medium">{programs.length}</span> programs
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm transition-all duration-200"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Programs Grid */}
        <motion.section
          className="relative z-10 pb-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="text-gray-400 text-lg">Loading programs...</p>
                </div>
              </div>
            ) : filteredPrograms.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl hover:border-gray-700 transition-all duration-500 group"
                  >
                    {/* Program Image */}
                    <div className="relative h-56 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(program.category)} opacity-60`}></div>
                      <div className="absolute inset-0 bg-black/40"></div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                          {program.level}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        {program.featured && (
                          <span className="bg-yellow-500/90 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                            Featured
                          </span>
                        )}
                        {program.popular && (
                          <span className="bg-orange-500/90 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
                          {program.title}
                        </h3>
                      </div>
                    </div>

                    {/* Program Content */}
                    <div className="p-6">
                      <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                        {program.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-gray-400 text-sm">
                          <svg className="h-4 w-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {program.duration}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <svg className="h-4 w-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {program.students} enrolled
                        </div>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-3 mb-6">
                        {program.instructorImage ? (
                          <img
                            src={program.instructorImage}
                            alt={typeof program.instructor === 'string' ? program.instructor : program.instructor?.name || 'Instructor'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {typeof program.instructor === 'string' ? program.instructor : program.instructor?.name || 'Expert Instructor'}
                          </p>
                          <p className="text-gray-500 text-xs">Expert Instructor</p>
                        </div>
                      </div>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-white">
                          <span className="text-2xl font-bold">${program.price}</span>
                          {program.originalPrice && program.originalPrice > program.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${program.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-400 text-sm">
                            {program.rating.toFixed(1)} ({program.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* CTA Buttons - Separate Learn More and Apply Now */}
                      <div className="flex flex-col gap-3">
                        <Link href={`/training/${program._id}`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-center py-3 px-4 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600 hover:border-gray-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer"
                          >
                            📚 Learn More Details
                          </motion.div>
                        </Link>
                        <Link href={`/training/${program._id}?apply=true`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-center py-3 px-4 bg-gradient-to-r ${getCategoryColor(program.category)} text-white rounded-xl font-semibold text-sm shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 group-hover:shadow-blue-500/25`}
                          >
                            🚀 Apply Now - ${program.price}
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="mx-auto h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">No programs found</h3>
                <p className="text-gray-400 mb-8">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default TrainingPage; 