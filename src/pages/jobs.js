import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    portfolio: '',
    coverLetter: '',
    resume: null,
    expectedSalary: '',
    availableStartDate: '',
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
    'Operations',
    'Quality Assurance',
    'DevOps',
    'Product Management'
  ];

  const locationTypes = ['Remote', 'On-site', 'Hybrid'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Temporary'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager', 'Executive'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, selectedCategory, selectedLocation, selectedLocationType, selectedEmploymentType, selectedExperienceLevel, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs?status=Active&limit=50');
      const data = await response.json();

      if (data.success && data.jobs) {
        setJobs(data.jobs || []);
      } else {
        console.error('Failed to fetch jobs:', data.message);
        setJobs([]);
        toast.error('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortJobs = () => {
    let filtered = [...(jobs || [])];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        (job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job?.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (selectedCategory) {
      filtered = filtered.filter(job => job?.category === selectedCategory);
    }
    if (selectedLocation) {
      filtered = filtered.filter(job =>
        (job?.location || '').toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    if (selectedLocationType) {
      filtered = filtered.filter(job => job?.locationType === selectedLocationType);
    }
    if (selectedEmploymentType) {
      filtered = filtered.filter(job => job?.employmentType === selectedEmploymentType);
    }
    if (selectedExperienceLevel) {
      filtered = filtered.filter(job => job?.experienceLevel === selectedExperienceLevel);
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
        filtered.sort((a, b) => {
          if (!a.applicationDeadline && !b.applicationDeadline) return 0;
          if (!a.applicationDeadline) return 1;
          if (!b.applicationDeadline) return -1;
          return new Date(a.applicationDeadline) - new Date(b.applicationDeadline);
        });
        break;
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case 'salary-high':
        filtered.sort((a, b) => {
          const getSalaryValue = (job) => {
            if (job.salary?.type === 'Range') return job.salary.max || 0;
            if (job.salary?.type === 'Fixed') return job.salary.amount || 0;
            return 0;
          };
          return getSalaryValue(b) - getSalaryValue(a);
        });
        break;
      default:
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmittingApplication(true);

    try {
      // Submit application
      const applicationResponse = await fetch('/api/jobs/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: selectedJob._id,
          jobTitle: selectedJob.title,
          company: selectedJob.company,
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
        const message = `Hello! I have applied for the ${selectedJob.title} position at ${selectedJob.company}.

My Details:
- Name: ${applicationData.fullName}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- Experience: ${applicationData.experience}
- Education: ${applicationData.education}
- Portfolio: ${applicationData.portfolio}
- Expected Salary: ${applicationData.expectedSalary}
- Available Start Date: ${applicationData.availableStartDate}

Cover Letter:
${applicationData.coverLetter}

Looking forward to hearing from you!`;

        if (applicationData.contactMethod === 'whatsapp') {
          const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        } else {
          const emailUrl = `mailto:${selectedJob.contactInfo?.email || 'careers@arsanexus.com'}?subject=Job Application - ${selectedJob.title}&body=${encodeURIComponent(message)}`;
          window.open(emailUrl, '_blank');
        }

        setShowApplicationModal(false);
        setApplicationData({
          fullName: '',
          email: '',
          phone: '',
          experience: '',
          education: '',
          portfolio: '',
          coverLetter: '',
          resume: null,
          expectedSalary: '',
          availableStartDate: '',
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
    if (!deadline) return null;
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
      'Operations': '⚙️',
      'Quality Assurance': '✅',
      'DevOps': '🔧',
      'Product Management': '📱'
    };
    return iconMap[category] || '💼';
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable';
    if (salary.type === 'Negotiable') return 'Negotiable';
    if (salary.type === 'Range') return `$${salary.min || 0} - $${salary.max || 0}/${salary.period || 'Year'}`;
    if (salary.type === 'Fixed') return `$${salary.amount || 0}/${salary.period || 'Year'}`;
    return 'Negotiable';
  };

  return (
    <MainLayout>
      <Head>
        <title>Job Opportunities | Arsa Nexus - Build Your Career</title>
        <meta name="description" content="Find your dream job with top companies. Explore full-time, part-time, and contract opportunities in technology and business." />
        <meta name="keywords" content="jobs, career opportunities, full-time jobs, tech jobs, remote jobs" />
        <meta property="og:title" content="Job Opportunities | Arsa Nexus" />
        <meta property="og:description" content="Build your career with exciting job opportunities" />
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
                💼 Career Opportunities
              </motion.span>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Find Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 block">
                  Dream Job
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Join leading companies and build the career you've always wanted.
                Discover opportunities that match your skills and ambitions.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{jobs.length}+</div>
                  <div className="text-gray-400">Active Positions</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
                  <div className="text-gray-400">Hiring Companies</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">90%</div>
                  <div className="text-gray-400">Placement Rate</div>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search Jobs</label>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Employment</label>
                  <select
                    value={selectedEmploymentType}
                    onChange={(e) => setSelectedEmploymentType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    <option value="">All Types</option>
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <select
                    value={selectedExperienceLevel}
                    onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-800">
                <div className="text-gray-400 text-sm mb-4 sm:mb-0">
                  Showing <span className="text-white font-medium">{filteredJobs.length}</span> of <span className="text-white font-medium">{jobs.length}</span> jobs
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
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="company">Company Name</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Jobs Grid */}
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
                  {/* Futuristic Loading Animation */}
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-2 border-blue-500/20"></div>
                    <div className="absolute inset-2 animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                    <div className="absolute inset-4 animate-pulse rounded-full h-8 w-8 bg-blue-500/30"></div>
                  </div>
                  <p className="text-gray-400 text-lg">Loading opportunities...</p>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredJobs.map((job, index) => {
                  const daysRemaining = getDaysRemaining(job.applicationDeadline);

                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {job.companyInfo?.logo ? (
                            <img
                              src={job.companyInfo.logo}
                              alt={job.company}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {job.company && job.company.charAt ? job.company.charAt(0) : 'C'}
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                              {job.title || 'Job Title'}
                            </h3>
                            <p className="text-gray-400">{job.company || 'Company Name'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {job.featured && (
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                              Featured
                            </span>
                          )}
                          {job.urgent && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium border border-red-500/30">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Category and Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full text-sm text-gray-300">
                          <span className="text-lg">{getCategoryIcon(job.category)}</span>
                          {job.category}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium">
                          {job.employmentType}
                        </span>
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full text-sm font-medium">
                          {job.experienceLevel}
                        </span>
                      </div>

                      {/* Location and Type */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          📍 {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          🏢 {job.locationType}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 mb-6 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Salary and Deadline */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Salary</div>
                          <div className="text-xl font-bold text-white">
                            {formatSalary(job.salary)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">Deadline</div>
                          <div className={`text-sm font-medium ${daysRemaining !== null && daysRemaining > 0
                            ? 'text-green-400'
                            : daysRemaining !== null
                              ? 'text-red-400'
                              : 'text-blue-400'
                            }`}>
                            {daysRemaining !== null && daysRemaining > 0
                              ? `${daysRemaining} days left`
                              : daysRemaining !== null
                                ? 'Deadline passed'
                                : 'No deadline'
                            }
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApplyClick(job)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:shadow-blue-500/25"
                      >
                        Apply Now
                      </motion.button>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">No jobs found</h3>
                <p className="text-gray-400 mb-8">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedLocation('');
                    setSelectedLocationType('');
                    setSelectedEmploymentType('');
                    setSelectedExperienceLevel('');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Apply for {selectedJob?.title}</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={applicationData.fullName}
                      onChange={(e) => setApplicationData({ ...applicationData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expected Salary</label>
                    <input
                      type="text"
                      value={applicationData.expectedSalary}
                      onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. $60,000 - $80,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience *</label>
                  <textarea
                    value={applicationData.experience}
                    onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief overview of your relevant work experience..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter *</label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Why are you interested in this position? What makes you a great fit?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={applicationData.contactMethod === 'email'}
                        onChange={(e) => setApplicationData({ ...applicationData, contactMethod: e.target.value })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={applicationData.contactMethod === 'whatsapp'}
                        onChange={(e) => setApplicationData({ ...applicationData, contactMethod: e.target.value })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-300">WhatsApp</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApplication}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {submittingApplication ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JobsPage; 