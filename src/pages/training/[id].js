import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import FormSuggestions from '../../components/ui/FormSuggestions';
import toast from 'react-hot-toast';

const TrainingDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    motivation: '',
    preferredSchedule: '',
    paymentMethod: 'whatsapp'
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  useEffect(() => {
    if (id) {
      fetchTrainingDetails();

      // Check if we should auto-open the application form
      if (router.query.apply === 'true') {
        setShowApplicationForm(true);
      }
    }
  }, [id, router.query]);

  const fetchTrainingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/training/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Training program not found');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
      
      const data = await response.json();

      if (data.success && data.data) {
        // Validate training data
        if (!data.data.title || !data.data.description) {
          throw new Error('Invalid training data received');
        }
        setTraining(data.data);
      } else {
        throw new Error(data.message || 'Training not found');
      }
    } catch (error) {
      console.error('Error fetching training details:', error);
      toast.error(`Failed to load training details: ${error.message}`);
      // Don't redirect to home - stay on page and show error
      setTraining(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmittingApplication(true);

    try {
      // Create application record
      const applicationResponse = await fetch('/api/training/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainingId: id,
          trainingTitle: training.title,
          ...applicationData,
        }),
      });

      const applicationResult = await applicationResponse.json();

      if (applicationResult.success) {
        // Success! Show confirmation and prepare contact method
        toast.success('Application submitted successfully!', {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontWeight: '500',
          },
        });

        // Prepare message for WhatsApp or Email
        const message = `Hello! I'm interested in the ${training.title} training program.

My Details:
- Name: ${applicationData.fullName}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- Education: ${applicationData.education}
- Experience: ${applicationData.experience}
- Motivation: ${applicationData.motivation}
- Preferred Schedule: ${applicationData.preferredSchedule}

Please provide more details about enrollment and payment options.`;

        if (applicationData.paymentMethod === 'whatsapp') {
          const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        } else {
          const emailUrl = `mailto:contact@arsanexus.com?subject=Training Application - ${training.title}&body=${encodeURIComponent(message)}`;
          window.open(emailUrl, '_blank');
        }

        setShowApplicationForm(false);
        setApplicationData({
          fullName: '',
          email: '',
          phone: '',
          education: '',
          experience: '',
          motivation: '',
          preferredSchedule: '',
          paymentMethod: 'whatsapp'
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

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 text-lg">Loading training details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!training) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Training Not Found</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              Return to Home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{training.title} | Arsa Nexus Training</title>
        <meta name="description" content={training.description} />
        <meta property="og:title" content={training.title} />
        <meta property="og:description" content={training.description} />
        <meta property="og:type" content="course" />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/training" className="hover:text-white transition-colors">Training</Link>
                  <span>/</span>
                  <span className="text-blue-400">{training.title}</span>
                </nav>

                {/* Category & Level */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(training.category)} text-white`}>
                    {training.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
                    {training.level}
                  </span>
                  {training.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {training.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {training.description}
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{training.duration}</div>
                    <div className="text-sm text-gray-400">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{training.enrollmentCount || 0}</div>
                    <div className="text-sm text-gray-400">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{training.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {training.rating ? training.rating.toFixed(1) : '5.0'}
                    </div>
                    <div className="text-sm text-gray-400">Rating</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowApplicationForm(true)}
                    className={`px-8 py-4 bg-gradient-to-r ${getCategoryColor(training.category)} text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300`}
                  >
                    Apply Now - ${training.price}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const message = `Hi! I'd like to know more about the ${training.title} training program.`;
                      window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all duration-300"
                  >
                    Ask Questions
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Content - Course Preview */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
                  <div className={`h-64 bg-gradient-to-br ${getCategoryColor(training.category)} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden`}>
                    {training.image ? (
                      <img
                        src={training.image}
                        alt={training.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-xl font-semibold">{training.category}</h3>
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Instructor</span>
                      <span className="text-white font-medium">{training.instructor?.name || 'Expert Instructor'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Course Fee</span>
                      <span className="text-2xl font-bold text-white">${training.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Duration</span>
                      <span className="text-white font-medium">{training.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Class Schedule</span>
                      <span className="text-white font-medium">Flexible</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Course Content Section */}
        <motion.section
          className="relative z-10 py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Course Curriculum */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-white mb-8">Course Curriculum</h2>
                <div className="space-y-6">
                  {training.curriculum && training.curriculum.length > 0 ? (
                    training.curriculum.map((module, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(training.category)} rounded-full flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                            <p className="text-gray-400 mb-3">{module.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>⏱️ {module.duration}</span>
                              <span>📄 {module.lessons} lessons</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
                      <p className="text-gray-400">Detailed curriculum will be provided upon enrollment.</p>
                    </div>
                  )}
                </div>

                {/* Learning Outcomes */}
                {training.learningOutcomes && training.learningOutcomes.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold text-white mb-8">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {training.learningOutcomes.map((outcome, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                          className="flex items-center gap-3 bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-lg p-4"
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300">{outcome}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Instructor Info */}
                {training.instructor && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Your Instructor</h3>
                    <div className="flex items-center gap-4 mb-4">
                      {training.instructor.image ? (
                        <img
                          src={training.instructor.image}
                          alt={training.instructor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-white">{training.instructor.name}</h4>
                        <p className="text-sm text-gray-400">Expert Instructor</p>
                      </div>
                    </div>
                    {training.instructor.bio && (
                      <p className="text-gray-400 text-sm">{training.instructor.bio}</p>
                    )}
                  </motion.div>
                )}

                {/* Prerequisites */}
                {training.prerequisites && training.prerequisites.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
                    <ul className="space-y-2">
                      {training.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-400 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Contact Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const message = `Hi! I have questions about the ${training.title} training program.`;
                        window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-all duration-300"
                    >
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687" />
                      </svg>
                      <span className="text-green-400 font-medium">WhatsApp Chat</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const subject = `Inquiry about ${training.title}`;
                        const body = `Hi,\n\nI'm interested in learning more about the ${training.title} training program.\n\nPlease provide more details.\n\nThank you!`;
                        window.open(`mailto:contact@arsanexus.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all duration-300"
                    >
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-blue-400 font-medium">Email Us</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Apply for {training.title}</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
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
                  <FormSuggestions
                    fieldType="name"
                    value={applicationData.fullName}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <FormSuggestions
                    fieldType="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <FormSuggestions
                    fieldType="phone"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Schedule</label>
                  <FormSuggestions
                    fieldType="schedule"
                    value={applicationData.preferredSchedule}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, preferredSchedule: e.target.value }))}
                    placeholder="Select preferred schedule"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Education Background</label>
                <FormSuggestions
                  fieldType="education"
                  value={applicationData.education}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="e.g., Bachelor's in Computer Science"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Previous Experience</label>
                <FormSuggestions
                  fieldType="experience"
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Describe any relevant experience or projects"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join this course?</label>
                <FormSuggestions
                  fieldType="motivation"
                  value={applicationData.motivation}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder="Tell us about your goals and motivation"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Contact Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="whatsapp"
                      checked={applicationData.paymentMethod === 'whatsapp'}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687" />
                    </svg>
                    <span className="text-white">WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="email"
                      checked={applicationData.paymentMethod === 'email'}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white">Email</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApplication}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r ${getCategoryColor(training.category)} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50`}
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

export default TrainingDetailsPage; 