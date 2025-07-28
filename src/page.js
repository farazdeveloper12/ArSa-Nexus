import React, { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';

const HomePage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated stats
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    programs: 0,
    success: 0
  });

  const isStatsInView = useInView(statsRef, { once: true });

  useEffect(() => {
    if (isStatsInView) {
      const animateStats = () => {
        const duration = 2000;
        const increment = {
          students: 1500 / (duration / 50),
          companies: 50 / (duration / 50),
          programs: 25 / (duration / 50),
          success: 95 / (duration / 50)
        };

        let current = { students: 0, companies: 0, programs: 0, success: 0 };

        const timer = setInterval(() => {
          current.students = Math.min(current.students + increment.students, 1500);
          current.companies = Math.min(current.companies + increment.companies, 50);
          current.programs = Math.min(current.programs + increment.programs, 25);
          current.success = Math.min(current.success + increment.success, 95);

          setStats({
            students: Math.floor(current.students),
            companies: Math.floor(current.companies),
            programs: Math.floor(current.programs),
            success: Math.floor(current.success)
          });

          if (current.students >= 1500 && current.companies >= 50 && current.programs >= 25 && current.success >= 95) {
            clearInterval(timer);
          }
        }, 50);
      };

      animateStats();
    }
  }, [isStatsInView]);

  return (
    <MainLayout>
      <Head>
        <title>Arsa Nexus | Professional Training & Technology Solutions</title>
        <meta name="description" content="Leading professional training platform offering cutting-edge technology courses, career development programs, and business solutions for professionals and organizations." />
        <meta name="keywords" content="professional training, technology solutions, career development, business training, tech careers, skill enhancement" />
        <meta property="og:title" content="Arsa Nexus | Professional Training & Technology Solutions" />
        <meta property="og:description" content="Transform your career with professional technology training and business solutions" />
        <meta property="og:type" content="website" />
      </Head>

      {/* AI Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
            transition: 'background 0.3s ease'
          }}
        />
        {/* Animated AI Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-blue-500/10"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
        style={{ y: y1, opacity }}
      >
        {/* 3D Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-block mb-8"
            >
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 font-medium">🚀 Professional Training Platform</span>
                </div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="text-white">Professional Training &</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-pulse">
                Technology Solutions
              </span>
              <br />
              <span className="text-white">for</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400">
                Career Excellence
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Master cutting-edge technologies, enhance your professional skills, and accelerate your career growth.
              Join leading professionals who trust us for their success in the technology industry.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/training">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-2xl cursor-pointer transition-all duration-300 min-w-[220px]"
                >
                  🚀 Explore AI Training
                </motion.div>
              </Link>
              <Link href="/internships">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-2xl cursor-pointer transition-all duration-300 min-w-[220px]"
                >
                  💼 Find Internships
                </motion.div>
              </Link>
              <Link href="/jobs">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-2xl cursor-pointer transition-all duration-300 min-w-[220px]"
                >
                  🎯 Tech Jobs
                </motion.div>
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-blue-400 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        className="relative py-20 bg-gradient-to-r from-gray-900 to-black"
        style={{ y: y2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-400">Join thousands who've transformed their careers with us</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Students Trained', value: stats.students, suffix: '+', icon: '👨‍🎓' },
              { label: 'Partner Companies', value: stats.companies, suffix: '+', icon: '🏢' },
              { label: 'Training Programs', value: stats.programs, suffix: '+', icon: '📚' },
              { label: 'Success Rate', value: stats.success, suffix: '%', icon: '⭐' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        className="relative py-20 bg-gradient-to-br from-black to-gray-900"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Arsa Nexus</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're not just another education platform. We're your gateway to the AI-driven future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Learning',
                description: 'Personalized learning paths powered by artificial intelligence',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '🚀',
                title: 'Industry-Ready Skills',
                description: 'Learn cutting-edge technologies used by top tech companies',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '💼',
                title: 'Career Acceleration',
                description: 'Direct pathways to internships and high-paying tech jobs',
                gradient: 'from-green-500 to-teal-500'
              },
              {
                icon: '🔒',
                title: 'Cybersecurity Focus',
                description: 'Specialized training in cybersecurity and data protection',
                gradient: 'from-red-500 to-orange-500'
              },
              {
                icon: '🌐',
                title: 'Global Network',
                description: 'Connect with professionals and companies worldwide',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: '📊',
                title: 'Data-Driven Results',
                description: 'Track your progress with advanced analytics and insights',
                gradient: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-blue-500/50 transition-all duration-500"
              >
                <div className={`inline-block p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
              Ready to Transform Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Career</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of students who've already started their journey into the future of technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/training">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer"
                >
                  Start Learning Today 🚀
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 cursor-pointer"
                >
                  Get In Touch 💬
                </motion.div>
              </Link>
            </div>
          </motion.div>
    </div>
      </motion.section>
    </MainLayout>
  );
};

export default HomePage;
