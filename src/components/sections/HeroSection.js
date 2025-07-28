import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';

const HeroSection = () => {
  const containerRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse movement for parallax - safe for SSR
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Safe dimensions for SSR
  const safeWidth = windowSize.width;
  const safeHeight = windowSize.height;

  const parallaxX1 = useTransform(smoothMouseX, [-safeWidth / 2, safeWidth / 2], [-20, 20]);
  const parallaxY1 = useTransform(smoothMouseY, [-safeHeight / 2, safeHeight / 2], [-10, 10]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();

        if (data.success && data.content?.hero) {
          setContent(data.content.hero);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchContent();
    }
  }, [isMounted]);

  // Window resize handler - only in browser
  useEffect(() => {
    if (!isMounted) return;

    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, [isMounted]);

  // Mouse move handler - only in browser
  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMounted]);

  // Loading state
  if (loading || !isMounted) {
    return (
      <section className="relative w-full h-screen min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  // Default content with safety
  const defaultContent = {
    announcement: { text: "New AI Courses Available - Enroll Today!", icon: "🚀" },
    title: { line1: "Building", line2: "Tomorrow's", line3: "Future Leaders" },
    subtitle: "Transform your career with cutting-edge professional training and technology solutions designed by industry experts for career excellence.",
    ctaButtons: {
      primary: { text: "Explore Training Programs", url: "/training", icon: "🚀" },
      secondary: { text: "Learn More About Us", url: "/about", icon: "📚" }
    },
    stats: [
      { icon: "🎓", number: "10K+", label: "Students Trained" },
      { icon: "💼", number: "95%", label: "Job Placement" },
      { icon: "🤝", number: "50+", label: "Industry Partners" },
      { icon: "💡", number: "24/7", label: "Learning Support" }
    ],
    scrollText: "SCROLL TO EXPLORE"
  };

  // Safe content merging
  const heroContent = {
    announcement: {
      text: content?.announcement?.text || defaultContent.announcement.text,
      icon: content?.announcement?.icon || defaultContent.announcement.icon
    },
    title: {
      line1: content?.title?.line1 || defaultContent.title.line1,
      line2: content?.title?.line2 || defaultContent.title.line2,
      line3: content?.title?.line3 || defaultContent.title.line3
    },
    subtitle: content?.subtitle || defaultContent.subtitle,
    ctaButtons: {
      primary: {
        text: content?.ctaButtons?.primary?.text || defaultContent.ctaButtons.primary.text,
        url: content?.ctaButtons?.primary?.url || defaultContent.ctaButtons.primary.url,
        icon: content?.ctaButtons?.primary?.icon || defaultContent.ctaButtons.primary.icon
      },
      secondary: {
        text: content?.ctaButtons?.secondary?.text || defaultContent.ctaButtons.secondary.text,
        url: content?.ctaButtons?.secondary?.url || defaultContent.ctaButtons.secondary.url,
        icon: content?.ctaButtons?.secondary?.icon || defaultContent.ctaButtons.secondary.icon
      }
    },
    stats: content?.stats && Array.isArray(content.stats) ? content.stats : defaultContent.stats,
    scrollText: content?.scrollText || defaultContent.scrollText
  };

  // Simple animated background - no blur
  const AnimatedBackground = () => (
    <div className="absolute inset-0 w-full h-full">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

      {/* Subtle floating elements */}
      <motion.div
        style={{ x: parallaxX1, y: parallaxY1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </motion.div>
    </div>
  );

  // Clean stat card - no blur effects
  const StatCard = ({ stat, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="text-center p-6 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
    >
      <div className="text-3xl mb-2">{stat?.icon || "📊"}</div>
      <div className="text-2xl font-bold text-white mb-1">{stat?.number || "0"}</div>
      <div className="text-sm text-blue-200 font-medium">{stat?.label || "Statistic"}</div>
    </motion.div>
  );

  // Clean hero content
  const HeroContent = () => (
    <div className="relative z-10 flex items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto pt-20">
        {/* Announcement Badge - clean design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 mb-8 bg-white/15 text-white rounded-full text-sm font-medium border border-white/20 transition-all duration-300"
        >
          <span className="mr-2">{heroContent.announcement.icon}</span>
          <span>{heroContent.announcement.text}</span>
        </motion.div>

        {/* Main Headline - clean and readable */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
        >
          <span className="block">{heroContent.title.line1}</span>
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {heroContent.title.line2}
          </span>
          <span className="block">{heroContent.title.line3}</span>
        </motion.h1>

        {/* Subtitle - clean and readable */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          {heroContent.subtitle}
        </motion.p>

        {/* CTA Buttons - clean design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
        >
          <Link
            href={heroContent.ctaButtons.primary.url}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl transition-all duration-300 w-full sm:w-auto"
          >
            <span>{heroContent.ctaButtons.primary.icon}</span>
            <span>{heroContent.ctaButtons.primary.text}</span>
          </Link>

          <Link
            href={heroContent.ctaButtons.secondary.url}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 text-white rounded-2xl font-bold border border-white/20 hover:bg-white/15 transition-all duration-300 w-full sm:w-auto"
          >
            <span>{heroContent.ctaButtons.secondary.icon}</span>
            <span>{heroContent.ctaButtons.secondary.text}</span>
          </Link>
        </motion.div>

        {/* Stats Section - clean design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {heroContent.stats?.map((stat, index) => (
            <StatCard
              key={stat?.label || index}
              stat={stat}
              delay={1.6 + index * 0.1}
            />
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/70 cursor-pointer"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
          >
            <span className="text-sm font-medium mb-2">{heroContent.scrollText}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full h-screen min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        y: y1,
        opacity,
        minHeight: '100vh',
        height: '100vh'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Clean Background */}
      <motion.div style={{ y: y2 }} className="absolute inset-0 w-full h-full">
        <AnimatedBackground />
      </motion.div>

      {/* Hero Content */}
      <HeroContent />
    </motion.section>
  );
};

export default HeroSection;