import React, { useRef, useState } from 'react';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';

const ServicesPage = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const [hoveredService, setHoveredService] = useState(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isServicesInView = useInView(servicesRef, { once: true });
  const isProcessInView = useInView(processRef, { once: true });

  const services = [
    {
      id: 1,
      icon: '🤖',
      title: 'AI & Machine Learning Training',
      description: 'Comprehensive programs covering neural networks, deep learning, computer vision, and natural language processing.',
      features: ['TensorFlow & PyTorch', 'Computer Vision', 'NLP & Text Analysis', 'Deep Learning Models'],
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      id: 2,
      icon: '💻',
      title: 'Full-Stack Development',
      description: 'Master modern web development with React, Node.js, databases, and cloud deployment.',
      features: ['React & Next.js', 'Node.js & Express', 'MongoDB & PostgreSQL', 'AWS & Docker'],
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      id: 3,
      icon: '🔒',
      title: 'Cybersecurity Training',
      description: 'Advanced cybersecurity courses covering ethical hacking, penetration testing, and security analysis.',
      features: ['Ethical Hacking', 'Penetration Testing', 'Security Analysis', 'Compliance & Governance'],
      gradient: 'from-red-500 to-orange-500',
      delay: 0.3
    },
    {
      id: 4,
      icon: '📊',
      title: 'Data Science & Analytics',
      description: 'Transform data into insights with Python, R, statistical analysis, and data visualization.',
      features: ['Python & R Programming', 'Statistical Analysis', 'Data Visualization', 'Big Data Tools'],
      gradient: 'from-green-500 to-teal-500',
      delay: 0.4
    },
    {
      id: 5,
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Build native and cross-platform mobile applications for iOS and Android.',
      features: ['React Native', 'Flutter Development', 'iOS Swift', 'Android Kotlin'],
      gradient: 'from-indigo-500 to-blue-500',
      delay: 0.5
    },
    {
      id: 6,
      icon: '☁️',
      title: 'Cloud Computing',
      description: 'Master cloud platforms, DevOps practices, and scalable infrastructure management.',
      features: ['AWS & Azure', 'Kubernetes & Docker', 'CI/CD Pipelines', 'Infrastructure as Code'],
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.6
    },
    {
      id: 7,
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Create stunning user interfaces and experiences with modern design principles.',
      features: ['Figma & Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      gradient: 'from-pink-500 to-purple-500',
      delay: 0.7
    },
    {
      id: 8,
      icon: '💼',
      title: 'Career Development',
      description: 'Professional career coaching, interview preparation, and job placement assistance.',
      features: ['Resume Building', 'Interview Coaching', 'Job Placement', 'Career Mentoring'],
      gradient: 'from-teal-500 to-green-500',
      delay: 0.8
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Assessment',
      description: 'We evaluate your current skills and career goals to create a personalized learning path.',
      icon: '📋'
    },
    {
      step: '02',
      title: 'Learning',
      description: 'Engage with our AI-powered curriculum designed by industry experts.',
      icon: '🎓'
    },
    {
      step: '03',
      title: 'Practice',
      description: 'Apply your knowledge through hands-on projects and real-world scenarios.',
      icon: '💡'
    },
    {
      step: '04',
      title: 'Certification',
      description: 'Earn industry-recognized certifications to validate your expertise.',
      icon: '🏆'
    },
    {
      step: '05',
      title: 'Placement',
      description: 'Get matched with top companies through our extensive network.',
      icon: '🚀'
    }
  ];

  return (
    <MainLayout>
      <Head>
        <title>AI-Powered Services | Arsa Nexus - Professional Development Solutions</title>
        <meta name="description" content="Comprehensive AI and technology training services designed to elevate your skills and advance your career in the digital age." />
        <meta name="keywords" content="AI training, machine learning courses, cybersecurity, data science, web development, career development" />
        <meta property="og:title" content="Professional Development Services | Arsa Nexus" />
        <meta property="og:description" content="Transform your career with our AI-powered education services" />
      </Head>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

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
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block py-2 px-4 rounded-full bg-blue-600/20 text-blue-400 text-sm backdrop-blur-sm border border-blue-500/20 mb-6"
            >
              🚀 Professional Development Services
            </motion.span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Elevate Your Skills with
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 block mt-2">
                AI-Powered Education
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Professional development services designed to elevate your skills and advance your career
              in the rapidly evolving world of technology and artificial intelligence.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { number: '8+', label: 'Service Areas' },
                { number: '25+', label: 'Specialized Programs' },
                { number: '95%', label: 'Success Rate' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        ref={servicesRef}
        className="relative py-20 bg-black"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive training programs designed to meet the demands of today's technology landscape
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: service.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
                className="group relative p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-blue-500/50 transition-all duration-500 cursor-pointer"
              >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                {/* Service Icon */}
                <div className={`inline-block p-4 bg-gradient-to-r ${service.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>

                {/* Service Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={hoveredService === service.id ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      {feature}
                    </motion.div>
                  ))}
                </div>

                {/* Learn More Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 text-center"
                >
                  <div className={`inline-block px-6 py-2 bg-gradient-to-r ${service.gradient} text-white rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    Learn More
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section
        ref={processRef}
        className="relative py-20 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Process</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A proven methodology that ensures your success from start to finish
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isProcessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  {/* Step Circle */}
                  <div className="relative mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                    <span className="text-2xl">{step.icon}</span>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {step.step}
                    </div>
                  </div>

                  {/* Step Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Transform</span> Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Let's discuss your goals and create a personalized learning path that will accelerate your career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Get Started Today 🚀
              </motion.a>
              <motion.a
                href="/training"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Browse Programs 📚
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default ServicesPage; 