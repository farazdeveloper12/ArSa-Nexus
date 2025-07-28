import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const InternshipsPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    portfolio: '',
    coverLetter: '',
    resume: null,
    preferredStartDate: '',
    contactMethod: 'email'
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);

  // Categories for filtering
  const categories = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data Science',
    'Digital Marketing',
    'UI/UX Design',
    'Cloud Computing',
    'Cybersecurity',
    'Business Development',
    'Content Creation',
    'Project Management',
    'Sales & Marketing',
    'Human Resources',
    'Finance & Accounting',
    'Operations'
  ];

  const locationTypes = ['Remote', 'On-site', 'Hybrid'];
  const levels = ['Entry Level', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterAndSortInternships();
  }, [internships, searchTerm, selectedCategory, selectedLocation, selectedLocationType, selectedLevel, sortBy]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/internships?status=Active&limit=50');
      const data = await response.json();

      if (data.success && data.internships) {
        setInternships(data.internships || []);
      } else {
        console.error('Failed to fetch internships:', data.message);
        setInternships([]);
        toast.error('Failed to load internships');
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internships');
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortInternships = () => {
    let filtered = [...(internships || [])];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        (internship?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (internship?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (internship?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (internship?.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (selectedCategory) {
      filtered = filtered.filter(internship => internship?.category === selectedCategory);
    }
    if (selectedLocation) {
      filtered = filtered.filter(internship =>
        (internship?.location || '').toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    if (selectedLocationType) {
      filtered = filtered.filter(internship => internship?.locationType === selectedLocationType);
    }
    if (selectedLevel) {
      filtered = filtered.filter(internship => internship?.level === selectedLevel);
    }

    // Apply sorting
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.urgent && !b.urgent) return -1;
          if (!a.urgent && b.urgent) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
        break;
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default:
        break;
    }

    setFilteredInternships(filtered);
  };

  const handleApplyClick = (internship) => {
    setSelectedInternship(internship);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmittingApplication(true);

    try {
      // Submit application
      const applicationResponse = await fetch('/api/internships/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          internshipId: selectedInternship._id,
          internshipTitle: selectedInternship.title,
          company: selectedInternship.company,
          ...applicationData,
        }),
      });

      const applicationResult = await applicationResponse.json();

      if (applicationResult.success) {
        toast.success('Application submitted successfully!', {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });

        // Prepare message for contact
        const message = `Hello! I have applied for the ${selectedInternship.title} internship at ${selectedInternship.company}.

My Details:
- Name: ${applicationData.fullName}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- Education: ${applicationData.education}
- Experience: ${applicationData.experience}
- Portfolio: ${applicationData.portfolio}
- Preferred Start Date: ${applicationData.preferredStartDate}

Cover Letter:
${applicationData.coverLetter}

Looking forward to hearing from you!`;

        if (applicationData.contactMethod === 'whatsapp') {
          const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        } else {
          const emailUrl = `mailto:${selectedInternship.contactInfo?.email || 'contact@arsanexus.com'}?subject=Internship Application - ${selectedInternship.title}&body=${encodeURIComponent(message)}`;
          window.open(emailUrl, '_blank');
        }

        setShowApplicationModal(false);
        setApplicationData({
          fullName: '',
          email: '',
          phone: '',
          education: '',
          experience: '',
          portfolio: '',
          coverLetter: '',
          resume: null,
          preferredStartDate: '',
          contactMethod: 'email'
        });
      } else {
        throw new Error(applicationResult.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Web Development': '💻',
      'Mobile Development': '📱',
      'AI & Machine Learning': '🤖',
      'Data Science': '📊',
      'Digital Marketing': '📈',
      'UI/UX Design': '🎨',
      'Cloud Computing': '☁️',
      'Cybersecurity': '🔒',
      'Business Development': '💼',
      'Content Creation': '✍️',
      'Project Management': '📋',
      'Sales & Marketing': '🎯',
      'Human Resources': '👥',
      'Finance & Accounting': '💰',
      'Operations': '⚙️'
    };
    return iconMap[category] || '💼';
  };

  return (
    <MainLayout>
      <Head>
        <title>Internship Opportunities | Arsa Nexus - Launch Your Career</title>
        <meta name="description" content="Discover exciting internship opportunities and kickstart your career with leading companies in technology and business." />
        <meta name="keywords" content="internships, career opportunities, entry level jobs, student internships, tech internships" />
        <meta property="og:title" content="Internship Opportunities | Arsa Nexus" />
        <meta property="og:description" content="Launch your career with exciting internship opportunities" />
        <meta property="og:type" content="website" />
      </Head>

      <div ref={sectionRef} className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
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
                className="inline-block py-2 px-4 rounded-full bg-green-600/20 text-green-400 text-sm backdrop-blur-sm border border-green-500/20 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                🚀 Internship Opportunities
              </motion.span>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Launch Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 block">
                  Dream Career
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Discover exciting internship opportunities with leading companies. Gain real-world experience,
                build valuable skills, and jumpstart your professional journey.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">{internships.length}+</div>
                  <div className="text-gray-400">Active Internships</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                  <div className="text-gray-400">Partner Companies</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-12 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search Internships</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Search by title, company, or keywords..."
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Location Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Type</label>
                  <select
                    value={selectedLocationType}
                    onChange={(e) => setSelectedLocationType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    <option value="">All Types</option>
                    {locationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Enter city or region..."
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-800">
                <div className="text-gray-400 text-sm mb-4 sm:mb-0">
                  Showing <span className="text-white font-medium">{filteredInternships.length}</span> of <span className="text-white font-medium">{internships.length}</span> internships
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm transition-all duration-200"
                  >
                    <option value="featured">Featured</option>
                    <option value="latest">Latest Posted</option>
                    <option value="deadline">Application Deadline</option>
                    <option value="company">Company Name</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Internships Grid */}
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
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                  <p className="text-gray-400 text-lg">Loading internships...</p>
                </div>
              </div>
            ) : filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredInternships.map((internship, index) => {
                  const daysRemaining = getDaysRemaining(internship.applicationDeadline);

                  return (
                    <motion.div
                      key={internship._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {internship.companyInfo?.logo ? (
                            <img
                              src={internship.companyInfo.logo}
                              alt={internship.company}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {internship.company && internship.company.charAt ? internship.company.charAt(0) : 'C'}
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                              {internship.title || 'Internship Title'}
                            </h3>
                            <p className="text-gray-400">{internship.company || 'Company Name'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {internship.featured && (
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                              Featured
                            </span>
                          )}
                          {internship.urgent && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium border border-red-500/30">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Category and Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full text-sm text-gray-300">
                          <span className="text-lg">{getCategoryIcon(internship.category)}</span>
                          {internship.category}
                        </span>
                        <span className="bg-gray-800/50 px-3 py-1.5 rounded-full text-sm text-gray-300">
                          📍 {internship.location}
                        </span>
                        <span className="bg-gray-800/50 px-3 py-1.5 rounded-full text-sm text-gray-300">
                          {internship.locationType}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                        {internship.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Duration</div>
                          <div className="text-white font-medium">{internship.duration}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Stipend</div>
                          <div className="text-white font-medium">
                            {internship.stipend?.period === 'Unpaid' ? (
                              'Unpaid'
                            ) : (
                              `$${internship.stipend?.amount || 0}/${internship.stipend?.period || 'Month'}`
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Level</div>
                          <div className="text-white font-medium">{internship.level}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Applications</div>
                          <div className="text-white font-medium">{internship.applicationCount || 0}</div>
                        </div>
                      </div>

                      {/* Skills */}
                      {internship.skillsRequired && internship.skillsRequired.length > 0 && (
                        <div className="mb-6">
                          <div className="text-sm text-gray-400 mb-2">Skills Required</div>
                          <div className="flex flex-wrap gap-2">
                            {internship.skillsRequired.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/30">
                                {skill}
                              </span>
                            ))}
                            {internship.skillsRequired.length > 3 && (
                              <span className="text-gray-400 text-xs">+{internship.skillsRequired.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="text-sm text-gray-400">
                          {daysRemaining > 0 ? (
                            <span className="text-green-400">Apply within {daysRemaining} days</span>
                          ) : (
                            <span className="text-red-400">Application deadline passed</span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApplyClick(internship)}
                          disabled={daysRemaining <= 0}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {daysRemaining > 0 ? 'Apply Now' : 'Expired'}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="mx-auto h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v5.586a1 1 0 00.293.707L10 14h4l1.707-1.707A1 1 0 0016 11.586V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">No internships found</h3>
                <p className="text-gray-400 mb-8">
                  Try adjusting your search or filter criteria to find opportunities that match your interests.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedLocation('');
                    setSelectedLocationType('');
                    setSelectedLevel('');
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedInternship && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Apply for {selectedInternship.title}</h2>
                <p className="text-gray-400">at {selectedInternship.company}</p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicationData.fullName}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Start Date</label>
                  <input
                    type="date"
                    value={applicationData.preferredStartDate}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, preferredStartDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Education Background</label>
                <input
                  type="text"
                  value={applicationData.education}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="e.g., Bachelor's in Computer Science, 3rd year"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Relevant Experience</label>
                <textarea
                  rows="3"
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Describe any relevant projects, internships, or experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio/GitHub Link</label>
                <input
                  type="url"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="https://github.com/yourusername or portfolio URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter</label>
                <textarea
                  rows="4"
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Tell us why you're interested in this internship and what you can bring to the role"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Contact Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={applicationData.contactMethod === 'email'}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, contactMethod: e.target.value }))}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white">Email</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="whatsapp"
                      checked={applicationData.contactMethod === 'whatsapp'}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, contactMethod: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687" />
                    </svg>
                    <span className="text-white">WhatsApp</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApplication}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {submittingApplication ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default InternshipsPage; 