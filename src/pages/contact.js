import React, { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import {
  ScrollReveal,
  ParallaxElement,
  TextReveal,
  TypewriterText,
  FloatingElement,
  AnimatedSection
} from '../components/ui/ScrollAnimation';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const mapRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const isFormInView = useInView(formRef, { once: true, margin: '-100px' });
  const isInfoInView = useInView(infoRef, { once: true, margin: '-100px' });
  const isMapInView = useInView(mapRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interestedIn: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Our Office',
      details: '123 Tech Boulevard, Innovation District',
      subDetails: 'San Francisco, CA 94105',
      gradient: 'from-blue-500 to-cyan-500',
      action: 'Get Directions'
    },
    {
      icon: '📞',
      title: 'Call Us Today',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Fri: 9:00 AM - 6:00 PM PST',
      gradient: 'from-green-500 to-teal-500',
      action: 'Call Now'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: 'contact@arsanexus.com',
      subDetails: 'We respond within 24 hours',
      gradient: 'from-purple-500 to-pink-500',
      action: 'Send Email'
    },
    {
      icon: '💬',
      title: 'Live Chat Support',
      details: 'Chat with our education experts',
      subDetails: 'Available 24/7 for urgent queries',
      gradient: 'from-orange-500 to-red-500',
      action: 'Start Chat'
    }
  ];

  const companyPartners = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '💻' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Meta', logo: '👥' },
    { name: 'Tesla', logo: '⚡' },
    { name: 'Netflix', logo: '🎬' },
    { name: 'Spotify', logo: '🎵' }
  ];

  const interestedInOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'ai-training', label: 'AI Training Programs' },
    { value: 'web-development', label: 'Web Development Courses' },
    { value: 'data-science', label: 'Data Science Programs' },
    { value: 'career-coaching', label: 'Career Coaching' },
    { value: 'corporate-training', label: 'Corporate Training' },
    { value: 'internship', label: 'Internship Opportunities' },
    { value: 'partnership', label: 'Business Partnership' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        interestedIn: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Background floating elements
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingElement speed={3} range={15} className="absolute top-1/4 left-1/4">
        <div className="w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
      </FloatingElement>
      <FloatingElement speed={4} range={20} className="absolute top-1/3 right-1/3">
        <div className="w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
      </FloatingElement>
      <FloatingElement speed={2} range={10} className="absolute bottom-1/4 left-1/3">
        <div className="w-40 h-40 bg-cyan-500/10 rounded-full blur-xl" />
      </FloatingElement>
    </div>
  );

  return (
    <MainLayout>
      <Head>
        <title>Contact Us | Arsa Nexus - Get in Touch with AI Education Experts</title>
        <meta name="description" content="Ready to transform your career with AI education? Contact our expert team for personalized guidance on training programs, career coaching, and opportunities." />
        <meta name="keywords" content="contact AI education, career counseling, training programs inquiry, artificial intelligence courses" />
        <meta property="og:title" content="Contact Arsa Nexus | AI Education Experts" />
        <meta property="og:description" content="Get in touch with our AI education experts for personalized guidance" />
      </Head>

      <div ref={containerRef} className="relative">
        {/* Floating Background Elements */}
        <FloatingElements />

        {/* Hero Section with Parallax */}
        <AnimatedSection
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          backgroundParallax={true}
        >
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          />

          <ParallaxElement speed={0.3} className="absolute inset-0">
            <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
          </ParallaxElement>

          <div ref={heroRef} className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up" delay={0.2} className="text-center max-w-5xl mx-auto">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-block py-3 px-6 rounded-full bg-blue-600/20 text-blue-400 text-lg backdrop-blur-sm border border-blue-500/20 mb-8"
              >
                💬 Get in Touch - We're Here to Help
              </motion.span>

              <div className="mb-8">
                <TypewriterText
                  text="Ready to Transform Your"
                  speed={100}
                  className="text-5xl md:text-7xl font-bold text-white block mb-4"
                />
                <TextReveal
                  text="Career with AI Education?"
                  className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400"
                  staggerDelay={0.03}
                />
              </div>

              <ScrollReveal direction="up" delay={0.8}>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto">
                  Our team of education experts is here to help you choose the right program,
                  answer your questions, and guide you toward a successful career in technology.
                </p>
              </ScrollReveal>

              {/* Quick Contact Stats */}
              <ScrollReveal direction="up" delay={1.0} stagger={true} className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
                {[
                  { icon: '⚡', number: '< 24hr', label: 'Response Time' },
                  { icon: '🎯', number: '95%', label: 'Success Rate' },
                  { icon: '🌍', number: '50+', label: 'Countries Served' },
                  { icon: '🏆', number: '10K+', label: 'Happy Students' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </ScrollReveal>
            </ScrollReveal>
          </div>
        </AnimatedSection>

        {/* Contact Information Section */}
        <AnimatedSection className="relative py-32 bg-black overflow-hidden">
          <ParallaxElement speed={0.2} className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          </ParallaxElement>

          <div ref={infoRef} className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up" className="text-center mb-20">
              <span className="text-blue-400 font-semibold text-lg tracking-wider uppercase">Contact Information</span>
              <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-8">
                Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Touch</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Choose your preferred way to connect with us. We're available through multiple channels
                to provide you with the best support possible.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <ScrollReveal
                  key={info.title}
                  direction="up"
                  delay={index * 0.1}
                >
                  <motion.div
                    whileHover={{
                      y: -15,
                      rotateY: 5,
                      scale: 1.02,
                      boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                    }}
                    className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-3xl hover:border-blue-500/50 transition-all duration-500 overflow-hidden text-center"
                  >
                    {/* Animated Background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${info.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      initial={false}
                    />

                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        className={`inline-block p-4 bg-gradient-to-r ${info.gradient} rounded-2xl mb-6 group-hover:shadow-2xl transition-all duration-300`}
                      >
                        <span className="text-4xl">{info.icon}</span>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                        {info.title}
                      </h3>

                      <p className="text-gray-400 leading-relaxed mb-2 text-lg font-medium">
                        {info.details}
                      </p>

                      <p className="text-gray-500 text-sm mb-6">
                        {info.subDetails}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-3 px-6 bg-gradient-to-r ${info.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                      >
                        {info.action}
                      </motion.button>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Form Section */}
        <AnimatedSection className="relative py-32 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          <div ref={formRef} className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Form */}
              <ScrollReveal direction="left" duration={1.0}>
                <div className="bg-white/5 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-3xl font-bold text-white mb-2">Send us a Message</h3>
                  <p className="text-gray-400 mb-8">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          I'm Interested In
                        </label>
                        <select
                          name="interestedIn"
                          value={formData.interestedIn}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          {interestedInOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell us more about your goals and how we can help you achieve them..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Send Message</span>
                          <span>🚀</span>
                        </div>
                      )}
                    </motion.button>
                  </form>
                </div>
              </ScrollReveal>

              {/* Contact Information & Map */}
              <ScrollReveal direction="right" duration={1.0} delay={0.3}>
                <div className="space-y-8">
                  {/* Office Hours */}
                  <div className="bg-white/5 backdrop-blur-xl border border-gray-700 rounded-3xl p-8">
                    <h4 className="text-2xl font-bold text-white mb-6">Office Hours</h4>
                    <div className="space-y-4">
                      {[
                        { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST' },
                        { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST' },
                        { day: 'Sunday', hours: 'Closed' },
                        { day: 'Holidays', hours: 'By Appointment Only' }
                      ].map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                          <span className="text-gray-300 font-medium">{schedule.day}</span>
                          <span className="text-white">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Map Placeholder */}
                  <div className="bg-white/5 backdrop-blur-xl border border-gray-700 rounded-3xl p-8">
                    <h4 className="text-2xl font-bold text-white mb-6">Find Us</h4>
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block">🗺️</span>
                        <p className="text-white font-semibold">Interactive Map</p>
                        <p className="text-gray-400 text-sm">Click to open in Google Maps</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Directions 🧭
                    </motion.button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>

        {/* Partners Section */}
        <AnimatedSection className="relative py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <ScrollReveal direction="up">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Trusted by Leading Companies
              </h3>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
                Our graduates work at top technology companies worldwide.
                Join them in their successful career transformation journey.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
                {companyPartners.map((company, index) => (
                  <motion.div
                    key={company.name}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center space-y-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                  >
                    <span className="text-4xl">{company.logo}</span>
                    <span className="text-sm text-white font-medium">{company.name}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </AnimatedSection>

        {/* Trusted Certifications & Badges Section */}
        <motion.section
          className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ParallaxElement speed={0.3} className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
          </ParallaxElement>

          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Professionals</span>
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
                Professional certifications and industry recognition that demonstrate our commitment to excellence.
              </p>
            </ScrollReveal>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: '🏆',
                  title: 'ISO Certified',
                  subtitle: 'Quality Standards'
                },
                {
                  icon: '🔒',
                  title: 'SSL Secured',
                  subtitle: 'Data Protection'
                },
                {
                  icon: '⭐',
                  title: '5-Star Rating',
                  subtitle: 'Client Satisfaction'
                },
                {
                  icon: '✅',
                  title: 'Verified Business',
                  subtitle: 'Professional Services'
                },
                {
                  icon: '🎓',
                  title: 'Certified Trainers',
                  subtitle: 'Expert Team'
                },
                {
                  icon: '🌐',
                  title: 'Global Reach',
                  subtitle: 'International Services'
                },
                {
                  icon: '💼',
                  title: 'Enterprise Ready',
                  subtitle: 'Business Solutions'
                },
                {
                  icon: '🚀',
                  title: 'Innovation Leader',
                  subtitle: 'Technology Excellence'
                }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {badge.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{badge.title}</h3>
                  <p className="text-blue-200 text-sm">{badge.subtitle}</p>
                </motion.div>
              ))}
            </div>

            <ScrollReveal direction="up" delay={0.8}>
              <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const message = "Hello! I'd like to learn more about your professional services and how you can help our business.";
                    window.open(`https://wa.me/923334349102?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  🤝 Partner with Us
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  📄 View Certifications
                </motion.button>
              </div>
            </ScrollReveal>
          </div>
        </motion.section>

        {/* CTA Section */}
        <AnimatedSection className="relative py-32 bg-black overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to Start Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AI Journey?</span>
              </h3>
              <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                Don't wait any longer. Contact us today and take the first step towards
                transforming your career with cutting-edge AI education.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🚀 Schedule Free Consultation
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                >
                  📞 Call Us Now
                </motion.button>
              </div>
            </ScrollReveal>
          </div>
        </AnimatedSection>
      </div>
    </MainLayout>
  );
};

export default ContactPage; 