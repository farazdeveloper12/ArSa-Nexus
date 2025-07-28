import React from 'react';
import { motion } from 'framer-motion';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: "🤖",
      title: "AI & Machine Learning",
      shortDescription: "Master the fundamentals of artificial intelligence and machine learning with hands-on projects and real-world applications.",
      category: "Technology",
      level: "All Levels",
      duration: "12 weeks",
      price: 0,
      features: [
        "Python Programming",
        "Neural Networks",
        "Data Analysis",
        "Project Portfolio"
      ]
    },
    {
      id: 2,
      icon: "💻",
      title: "Web Development",
      shortDescription: "Build modern, responsive websites and web applications using the latest technologies and best practices.",
      category: "Development",
      level: "Beginner to Advanced",
      duration: "16 weeks",
      price: 0,
      features: [
        "HTML, CSS, JavaScript",
        "React & Next.js",
        "Backend Development",
        "Database Design"
      ]
    },
    {
      id: 3,
      icon: "📱",
      title: "Mobile App Development",
      shortDescription: "Create powerful mobile applications for iOS and Android platforms using modern development frameworks.",
      category: "Development",
      level: "Intermediate",
      duration: "14 weeks",
      price: 0,
      features: [
        "React Native",
        "Flutter",
        "App Store Deployment",
        "UI/UX Design"
      ]
    },
    {
      id: 4,
      icon: "📊",
      title: "Data Science & Analytics",
      shortDescription: "Transform raw data into meaningful insights using statistical analysis and data visualization techniques.",
      category: "Analytics",
      level: "All Levels",
      duration: "10 weeks",
      price: 0,
      features: [
        "Statistical Analysis",
        "Data Visualization",
        "SQL & Databases",
        "Business Intelligence"
      ]
    },
    {
      id: 5,
      icon: "🎨",
      title: "UI/UX Design",
      shortDescription: "Design beautiful, user-friendly interfaces and create exceptional user experiences for digital products.",
      category: "Design",
      level: "Beginner",
      duration: "8 weeks",
      price: 0,
      features: [
        "Design Principles",
        "Figma & Adobe XD",
        "User Research",
        "Prototyping"
      ]
    },
    {
      id: 6,
      icon: "☁️",
      title: "Cloud Computing",
      shortDescription: "Learn cloud platforms and services to build scalable, secure, and efficient cloud-based solutions.",
      category: "Infrastructure",
      level: "Intermediate",
      duration: "12 weeks",
      price: 0,
      features: [
        "AWS & Azure",
        "Docker & Kubernetes",
        "DevOps Practices",
        "Cloud Security"
      ]
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6"
          >
            <span className="mr-2">⚡</span>
            Our Services
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Professional Development
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Services & Training
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive training programs designed to elevate your skills and advance your career
            in the rapidly evolving technology landscape.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
          <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group overflow-hidden"
            >
              <div className="p-8">
                {/* Service Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Service Details */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    {service.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {service.level}
                  </span>
                </div>

                {/* Duration and Price */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-600 rounded-xl">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="mr-1">⏱️</span>
                    {service.duration}
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {service.price > 0 ? `$${service.price}` : 'FREE'}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="text-sm text-gray-600 dark:text-gray-300 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🚀</span>
                  <span>Start Learning</span>
                </motion.button>
              </div>

              {/* Gradient Border Effect */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"
              />
            </motion.div>
          ))}
            </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have advanced their careers through our comprehensive training programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>📞</span>
                <span>Contact Us Today</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <span>📄</span>
                <span>Download Brochure</span>
              </motion.button>
            </div>
          </div>
          </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;