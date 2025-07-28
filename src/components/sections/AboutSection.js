import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const WorldMap = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 6);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1
      }
    }
  };

  const arrowVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 2.5
      }
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/10 to-purple-900/10 rounded-2xl overflow-hidden border border-blue-200/20 dark:border-blue-700/30">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>

      {/* Animated Background Dots */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* World Map SVG */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}
      >
        {/* Simplified World Map Paths */}
        <motion.path
          d="M150,200 Q300,150 450,200 T750,200"
          stroke="url(#gradient1)"
          strokeWidth="3"
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          style={{ filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.8))' }}
        />

        <motion.path
          d="M200,250 Q400,300 600,250 T900,250"
          stroke="url(#gradient2)"
          strokeWidth="3"
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.8))',
            animationDelay: '0.5s'
          }}
        />

        <motion.path
          d="M100,300 Q300,250 500,300 T800,300"
          stroke="url(#gradient3)"
          strokeWidth="3"
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.8))',
            animationDelay: '1s'
          }}
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1">
              <animate attributeName="stop-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </stop>
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="1">
              <animate attributeName="stop-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </stop>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </stop>
          </linearGradient>

          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
            </stop>
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="1">
              <animate attributeName="stop-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin="1s" />
            </stop>
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
            </stop>
          </linearGradient>
        </defs>

        {/* Animated Arrow Markers */}
        <motion.g variants={arrowVariants} initial="hidden" animate="visible">
          <motion.polygon
            points="740,195 750,200 740,205"
            fill="#3B82F6"
            animate={{
              x: [0, 20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.g>

        <motion.g variants={arrowVariants} initial="hidden" animate="visible">
          <motion.polygon
            points="890,245 900,250 890,255"
            fill="#9333EA"
            animate={{
              x: [0, 20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.g>

        <motion.g variants={arrowVariants} initial="hidden" animate="visible">
          <motion.polygon
            points="790,295 800,300 790,305"
            fill="#10B981"
            animate={{
              x: [0, 20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.g>

        {/* Location Dots */}
        {[
          { x: 150, y: 200, delay: 0 },
          { x: 450, y: 200, delay: 0.3 },
          { x: 750, y: 200, delay: 0.6 },
          { x: 200, y: 250, delay: 0.9 },
          { x: 600, y: 250, delay: 1.2 },
          { x: 900, y: 250, delay: 1.5 },
          { x: 100, y: 300, delay: 1.8 },
          { x: 500, y: 300, delay: 2.1 },
          { x: 800, y: 300, delay: 2.4 },
        ].map((dot, index) => (
          <motion.circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r="6"
            fill="url(#pulseDot)"
            animate={{
              r: [4, 8, 4],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <defs>
          <radialGradient id="pulseDot">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Global Reach
          </motion.h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Serving students worldwide with cutting-edge education
          </p>
          <div className="flex items-center justify-center mt-3 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Live Training</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">45+ Countries</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Animate content
      gsap.from('.about-title', {
        opacity: 0,
        x: -100,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top center',
          toggleActions: 'play none none none',
        }
      });

      gsap.from('.about-description', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top center',
          toggleActions: 'play none none none',
        }
      });

      gsap.from('.feature-card', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top bottom',
          toggleActions: 'play none none none',
        }
      });
    }
  }, []);

  return (
    <section ref={aboutRef} className="py-16 md:py-24 px-4 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4"
              >
                <span className="mr-2">🎯</span>
                Our Mission & Vision
              </motion.div>

              <h2 className="about-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Pioneering the Future of
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Education & Career Transformation
                </span>
              </h2>
            </div>

            <div className="about-description space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                At ArSa Nexus, we believe that technology education should be accessible to all,
                regardless of economic background or social status. We're breaking down barriers
                and creating pathways to success across the globe.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Our mission is to bridge the digital divide by providing cutting-edge products and
                free training programs that empower students worldwide with the skills they
                need to succeed in tomorrow's digital economy.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                We envision a world where every student has equal opportunity to harness the power
                of technology to create, innovate, and build a better future for humanity.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>📖</span>
                <span>Learn More About Our Story</span>
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🎥</span>
                <span>Watch Our Journey</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="features-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: "🛡️",
                title: "Quality Education",
                description: "Industry-standard curriculum designed by experts with real-world experience.",
                color: "blue"
              },
              {
                icon: "👥",
                title: "Expert Mentorship",
                description: "Personal guidance from industry professionals and successful entrepreneurs.",
                color: "purple"
              },
              {
                icon: "⚙️",
                title: "Customized Learning",
                description: "Adaptive programs tailored to individual learning paces and career goals.",
                color: "green"
              },
              {
                icon: "💼",
                title: "Career Placement",
                description: "100% job placement assistance with our network of hiring partners.",
                color: "orange"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="feature-card bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 border border-gray-100 dark:border-gray-600 group"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-4"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* World Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Global Impact
            </motion.h3>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              From Silicon Valley to Singapore, from London to Lagos - we're empowering the next generation
              of tech innovators across every continent.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <WorldMap />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: "2500+", label: "Students Graduated", icon: "🎓" },
            { number: "150+", label: "Industry Partners", icon: "🤝" },
            { number: "45+", label: "Countries Served", icon: "🌍" },
            { number: "96%", label: "Job Placement Rate", icon: "💼" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <motion.div
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;