import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import React from 'react';

const TrainingSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [activeCategory, setActiveCategory] = useState('all');

  // Static training programs data
  const programs = [
    {
      id: 1,
      title: "AI & Machine Learning Fundamentals",
      description: "Master the core concepts of artificial intelligence and machine learning with hands-on projects using Python, TensorFlow, and real-world datasets.",
      category: "AI & Machine Learning",
      level: "Beginner to Intermediate",
      duration: "12 weeks",
      students: 1250,
      price: 0,
      instructor: "Dr. Sarah Chen",
      image: "/images/training/ai-ml.jpg",
      color: "from-purple-500 to-fuchsia-600",
      live: true,
      featured: true,
      popular: false,
      rating: 4.9,
      reviewCount: 234
    },
    {
      id: 2,
      title: "Full-Stack Web Development",
      description: "Build modern web applications from scratch using React, Node.js, databases, and deployment strategies for real-world projects.",
      category: "Web Development",
      level: "Beginner to Advanced",
      duration: "16 weeks",
      students: 2100,
      price: 0,
      instructor: "Mark Rodriguez",
      image: "/images/training/web-dev.jpg",
      color: "from-blue-500 to-indigo-600",
      live: false,
      featured: true,
      popular: true,
      rating: 4.8,
      reviewCount: 456
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Create stunning mobile applications for iOS and Android using React Native and Flutter with app store deployment guides.",
      category: "Mobile Development",
      level: "Intermediate",
      duration: "14 weeks",
      students: 890,
      price: 0,
      instructor: "Jessica Park",
      image: "/images/training/mobile-dev.jpg",
      color: "from-green-500 to-teal-600",
      live: false,
      featured: false,
      popular: true,
      rating: 4.7,
      reviewCount: 189
    },
    {
      id: 4,
      title: "Data Science & Analytics",
      description: "Transform raw data into actionable insights using Python, SQL, machine learning, and data visualization techniques.",
      category: "Data Science",
      level: "Intermediate",
      duration: "10 weeks",
      students: 756,
      price: 0,
      instructor: "Dr. Ahmed Hassan",
      image: "/images/training/data-analysis.jpg",
      color: "from-emerald-500 to-teal-600",
      live: true,
      featured: false,
      popular: false,
      rating: 4.8,
      reviewCount: 167
    },
    {
      id: 5,
      title: "UI/UX Design Mastery",
      description: "Design beautiful, user-friendly interfaces and create exceptional user experiences using Figma, Adobe XD, and design principles.",
      category: "UI/UX Design",
      level: "Beginner",
      duration: "8 weeks",
      students: 612,
      price: 0,
      instructor: "Emily Thompson",
      image: "/images/training/ui-ux.jpg",
      color: "from-pink-500 to-purple-600",
      live: false,
      featured: false,
      popular: false,
      rating: 4.6,
      reviewCount: 123
    },
    {
      id: 6,
      title: "Digital Marketing & SEO",
      description: "Master digital marketing strategies, SEO optimization, social media marketing, and analytics to grow online presence.",
      category: "Digital Marketing",
      level: "Beginner to Intermediate",
      duration: "6 weeks",
      students: 543,
      price: 0,
      instructor: "Michael Chen",
      image: "/images/training/digital-marketing.jpg",
      color: "from-orange-500 to-red-600",
      live: false,
      featured: false,
      popular: false,
      rating: 4.5,
      reviewCount: 98
    }
  ];

  // Categories mapping
  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'AI & Machine Learning', name: 'AI & ML' },
    { id: 'Web Development', name: 'Web Dev' },
    { id: 'Mobile Development', name: 'Mobile Dev' },
    { id: 'Data Science', name: 'Data Science' },
    { id: 'UI/UX Design', name: 'UI/UX Design' },
    { id: 'Digital Marketing', name: 'Marketing' },
  ];

  // Filter programs based on selected category
  const filteredPrograms = activeCategory === 'all'
    ? programs
    : programs.filter(program => program.category === activeCategory);

  // Animation variants
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
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gray-900 dark:bg-gray-950 relative overflow-hidden"
      id="training"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 bg-blue-100/10 backdrop-blur-sm text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/20"
          >
            <span className="mr-2">🎓</span>
            Training Programs
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Empowering Through
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Knowledge & Skills
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Our comprehensive training programs are designed to equip students with the skills
            they need to thrive in the digital economy and build successful careers.
          </motion.p>

          {/* Category Filters */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {filteredPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Program Header */}
              <div className={`relative h-48 bg-gradient-to-r ${program.color} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                    {program.level}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  {program.featured && (
                    <span className="bg-yellow-500/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
                      <span className="mr-1">⭐</span>
                      Featured
                    </span>
                  )}
                  {program.popular && (
                    <span className="bg-orange-500/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
                      <span className="mr-1">🔥</span>
                      Popular
                    </span>
                  )}
                  {program.live && (
                    <span className="flex items-center bg-red-500/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                      Live
                    </span>
                  )}
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                    {program.title}
                  </h3>
                </div>
              </div>

              {/* Program Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">{program.description}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-blue-400">⏱️</span>
                    </div>
                    <span>{program.duration}</span>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-green-400">👥</span>
                    </div>
                    <span>{program.students} enrolled</span>
                  </div>
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-white">
                    <span className="text-2xl font-bold text-green-400">
                      {program.price > 0 ? `$${program.price}` : 'FREE'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Full Course</p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(program.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">
                      {program.rating} ({program.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center mb-6 text-gray-300">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-400">👨‍🏫</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Instructor</p>
                    <p className="font-medium">{program.instructor}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/training/${program.id}`} legacyBehavior>
                  <a className={`w-full block text-center py-3 px-4 bg-gradient-to-r ${program.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group-hover:scale-105`}>
                    Start Learning 🚀
                  </a>
                </Link>
              </div>

              {/* Bottom accent */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`h-1 bg-gradient-to-r ${program.color}`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have transformed their careers through our comprehensive training programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/training" legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>📚</span>
                  <span>View All Programs</span>
                </motion.a>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <span>💬</span>
                <span>Get Free Consultation</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingSection;