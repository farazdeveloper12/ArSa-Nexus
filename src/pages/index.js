import Head from 'next/head';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useEffect } from 'react';

import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TrainingSection from '@/components/sections/TrainingSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import HeroScene from '@/components/3d/HeroScene';
import {
  ScrollReveal,
  ParallaxElement,
  AnimatedSection,
  FloatingElement
} from '@/components/ui/ScrollAnimation';

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const middleY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  useEffect(() => {
    // Enhanced smooth scrolling
    const handleSmoothScroll = (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    // Custom cursor effect for desktop
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(147,51,234,0.4) 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      backdrop-filter: blur(2px);
      display: none;
    `;

    // Only add cursor on desktop
    if (window.innerWidth >= 1024) {
      document.body.appendChild(cursor);
      cursor.style.display = 'block';
    }

    const handleMouseMove = (e) => {
      if (window.innerWidth >= 1024) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
      }
    };

    const handleMouseEnter = () => {
      if (window.innerWidth >= 1024) {
        cursor.style.transform = 'scale(1.5)';
      }
    };

    const handleMouseLeave = () => {
      if (window.innerWidth >= 1024) {
        cursor.style.transform = 'scale(1)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []);

  // Floating background elements
  const FloatingBackgroundElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      <FloatingElement speed={4} range={20} className="absolute top-1/4 left-1/4">
        <div className="w-32 h-32 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl" />
      </FloatingElement>
      <FloatingElement speed={3} range={15} className="absolute top-1/3 right-1/3">
        <div className="w-24 h-24 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-3xl" />
      </FloatingElement>
      <FloatingElement speed={5} range={25} className="absolute bottom-1/4 left-1/3">
        <div className="w-40 h-40 bg-cyan-500/10 dark:bg-cyan-400/20 rounded-full blur-3xl" />
      </FloatingElement>
      <FloatingElement speed={2} range={10} className="absolute top-1/2 right-1/4">
        <div className="w-28 h-28 bg-pink-500/10 dark:bg-pink-400/20 rounded-full blur-3xl" />
      </FloatingElement>
    </div>
  );

  return (
    <MainLayout>
      <Head>
        <title>Arsa Nexus | Leading AI Education & Professional Training Platform</title>
        <meta name="description" content="Transform your career with cutting-edge AI education and professional training programs. Join thousands who have advanced their careers with Arsa Nexus - the premier platform for technology education." />
        <meta name="keywords" content="AI education, machine learning training, professional development, technology courses, career transformation, programming bootcamp, data science, web development" />
        <meta property="og:title" content="Arsa Nexus | Leading AI Education & Professional Training Platform" />
        <meta property="og:description" content="Transform your career with cutting-edge AI education and professional training programs. Join thousands who have advanced their careers with Arsa Nexus." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://arsanexus.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Arsa Nexus | Leading AI Education Platform" />
        <meta name="twitter:description" content="Transform your career with cutting-edge AI education and professional training programs." />
        <meta name="twitter:image" content="/images/og-image.jpg" />
        <link rel="canonical" href="https://arsanexus.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.25, user-scalable=yes" />
      </Head>

      {/* Container with proper layout structure */}
      <div ref={containerRef} className="relative w-full overflow-x-hidden">
        {/* Floating Background Elements */}
        <FloatingBackgroundElements />

        {/* Global Styles for Perfect Responsive Layout */}
        <style jsx global>{`
          /* Reset and Base */
          * {
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
          }
          
          /* Perfect Responsive Container System */
          .responsive-container {
            width: 100%;
            max-width: 100vw;
            margin: 0 auto;
            padding: 0 clamp(0.75rem, 4vw, 3rem);
          }
          
          /* Viewport-based Typography */
          .heading-primary {
            font-size: clamp(1.75rem, 6vw, 4rem);
            line-height: 1.1;
            font-weight: 800;
          }
          
          .heading-secondary {
            font-size: clamp(1.25rem, 4vw, 3rem);
            line-height: 1.2;
            font-weight: 700;
          }
          
          .heading-tertiary {
            font-size: clamp(1rem, 3vw, 2rem);
            line-height: 1.3;
            font-weight: 600;
          }
          
          .text-body {
            font-size: clamp(0.875rem, 2vw, 1.25rem);
            line-height: 1.6;
          }
          
          .text-small {
            font-size: clamp(0.75rem, 1.5vw, 1rem);
            line-height: 1.5;
          }
          
          /* Perfect Section Spacing */
          .section-spacing {
            padding: clamp(2rem, 8vw, 8rem) 0;
          }
          
          .section-spacing-small {
            padding: clamp(1rem, 4vw, 4rem) 0;
          }
          
          /* Responsive Grid System */
          .responsive-grid {
            display: grid;
            gap: clamp(1rem, 3vw, 2.5rem);
            grid-template-columns: 1fr;
          }
          
          .responsive-grid-2 {
            grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
          }
          
          .responsive-grid-3 {
            grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
          }
          
          .responsive-grid-4 {
            grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
          }
          
          /* Perfect Content Alignment */
          .content-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
          }
          
          .content-wrapper {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
          }
          
          /* Responsive Button System */
          .btn-responsive {
            font-size: clamp(0.75rem, 2vw, 1rem);
            padding: clamp(0.5rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
            border-radius: clamp(0.5rem, 1vw, 1rem);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            min-width: fit-content;
          }
          
          /* Dark Mode Support */
          .gradient-bg-light {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
          }
          
          .dark .gradient-bg-light {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
          }
          
          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: clamp(4px, 1vw, 8px);
          }
          
          ::-webkit-scrollbar-track {
            background: rgb(243, 244, 246);
          }
          
          .dark ::-webkit-scrollbar-track {
            background: rgb(17, 24, 39);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
          }
          
          /* Desktop Cursor */
          @media (min-width: 1024px) {
            .custom-cursor {
              display: block !important;
            }
            
            * {
              cursor: none !important;
            }
          }
          
          /* High DPI Support */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .high-dpi-ready {
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
          }
          
          /* Animation Performance */
          .animate-optimized {
            will-change: transform;
            transform: translateZ(0);
          }
          
          /* Reduced Motion Support */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          
          /* Hero Section Full Screen Fix */
          .hero-full-screen {
            height: 100vh;
            min-height: 100vh;
            width: 100vw;
            max-width: 100vw;
            position: relative;
            overflow: hidden;
          }
          
          /* Ensure proper z-index layering */
          .header-layer { z-index: 90; }
          .hero-layer { z-index: 1; }
          .content-layer { z-index: 10; }
          .floating-layer { z-index: 0; }
          
          /* Responsive Image System */
          .responsive-img {
            width: 100%;
            height: auto;
            max-width: 100%;
            object-fit: cover;
          }
          
          /* Card Responsive System */
          .responsive-card {
            padding: clamp(1rem, 3vw, 2rem);
            border-radius: clamp(0.5rem, 1vw, 1.5rem);
            margin: clamp(0.5rem, 2vw, 1rem);
          }
          
          /* Flex Responsive Utilities */
          .flex-responsive {
            display: flex;
            flex-direction: column;
            gap: clamp(0.5rem, 2vw, 1.5rem);
          }
          
          @media (min-width: 768px) {
            .flex-responsive {
              flex-direction: row;
              align-items: center;
            }
          }
          
          /* Form Responsive System */
          .form-responsive input,
          .form-responsive textarea,
          .form-responsive select {
            font-size: clamp(0.875rem, 2vw, 1rem);
            padding: clamp(0.5rem, 2vw, 1rem);
            border-radius: clamp(0.25rem, 1vw, 0.75rem);
            width: 100%;
          }
          
          /* Navigation Responsive Fix */
          .nav-responsive {
            display: flex;
            align-items: center;
            gap: clamp(0.25rem, 1vw, 1rem);
            font-size: clamp(0.75rem, 1.5vw, 1rem);
          }
          
          /* Ensure no horizontal overflow */
          .no-overflow {
            overflow-x: hidden;
            max-width: 100vw;
          }
          
          /* Zoom-safe element positioning */
          .zoom-safe {
            position: relative;
            max-width: 100%;
            overflow: hidden;
          }
          
          /* Container Query Support */
          @container (max-width: 400px) {
            .container-responsive {
              font-size: 0.8rem;
              padding: 0.5rem;
            }
          }
          
          @container (min-width: 401px) and (max-width: 800px) {
            .container-responsive {
              font-size: 0.9rem;
              padding: 1rem;
            }
          }
          
          @container (min-width: 801px) {
            .container-responsive {
              font-size: 1rem;
              padding: 1.5rem;
            }
          }
        `}</style>

        {/* Hero Section - Full Screen without Menu Overlap */}
        <div className="hero-full-screen hero-layer">
          <HeroSection />
        </div>

        {/* About Section - Perfect Responsive Alignment */}
        <AnimatedSection
          className="section-spacing relative bg-white dark:bg-gray-900 transition-colors duration-300 content-layer no-overflow"
          backgroundParallax={true}
        >
          <ParallaxElement speed={-0.2} className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg-light" />
          </ParallaxElement>

          <div className="relative z-10 responsive-container">
            <div className="content-wrapper">
              <ScrollReveal direction="up" stagger={true}>
                <AboutSection />
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>

        {/* Services Section - Enhanced Responsive Design */}
        <AnimatedSection
          className="section-spacing relative bg-gray-50 dark:bg-gray-800 transition-colors duration-300 content-layer no-overflow"
          backgroundParallax={true}
        >
          <ParallaxElement speed={0.1} className="absolute inset-0">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-3xl" />
          </ParallaxElement>

          <div className="relative z-10 responsive-container">
            <div className="content-wrapper">
              <ScrollReveal direction="up" stagger={true} staggerDelay={0.15}>
                <ServicesSection />
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>

        {/* Training Section - Responsive Premium Design */}
        <AnimatedSection
          className="section-spacing relative bg-gray-900 dark:bg-gray-950 transition-colors duration-300 content-layer no-overflow"
          backgroundParallax={true}
        >
          <ParallaxElement speed={-0.1} className="absolute inset-0">
            <div className="absolute top-0 right-1/3 w-64 h-64 bg-green-500/10 dark:bg-green-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-500/10 dark:bg-yellow-400/20 rounded-full blur-2xl" />
          </ParallaxElement>

          <div className="relative z-10 responsive-container">
            <div className="content-wrapper">
              <ScrollReveal direction="up" stagger={true} staggerDelay={0.2}>
                <TrainingSection />
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section - Responsive Social Proof */}
        <AnimatedSection
          className="section-spacing gradient-bg-light relative transition-colors duration-300 content-layer no-overflow"
          backgroundParallax={true}
        >
          <ParallaxElement speed={0.2} className="absolute inset-0">
            <FloatingElement speed={3} range={15} className="absolute top-1/4 left-1/4">
              <div className="w-32 h-32 bg-blue-500/15 dark:bg-blue-400/25 rounded-full blur-xl" />
            </FloatingElement>
            <FloatingElement speed={4} range={20} className="absolute bottom-1/4 right-1/4">
              <div className="w-24 h-24 bg-purple-500/15 dark:bg-purple-400/25 rounded-full blur-xl" />
            </FloatingElement>
          </ParallaxElement>

          <div className="relative z-10 responsive-container">
            <div className="content-wrapper">
              <ScrollReveal direction="up" stagger={true} staggerDelay={0.1}>
                <TestimonialsSection />
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>

        {/* Newsletter Section - Responsive Conversion Focused */}
        <AnimatedSection className="section-spacing bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-700 dark:via-purple-700 dark:to-blue-900 relative overflow-hidden content-layer">
          <ParallaxElement speed={0.2} className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <FloatingElement speed={2} range={10} className="absolute top-1/4 left-1/4">
                <div className="w-40 h-40 bg-white/10 rounded-full blur-xl" />
              </FloatingElement>
              <FloatingElement speed={3} range={15} className="absolute bottom-1/4 right-1/4">
                <div className="w-32 h-32 bg-cyan-400/15 rounded-full blur-xl" />
              </FloatingElement>
            </div>
          </ParallaxElement>

          <div className="responsive-container text-center relative z-10">
            <ScrollReveal direction="up">
              <div className="content-center max-w-5xl mx-auto zoom-safe">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-small font-medium mb-6"
                >
                  <span className="mr-2">📧</span>
                  Stay Connected
                </motion.div>

                <h2 className="heading-secondary text-white mb-6">
                  Stay Updated with AI Innovations
                </h2>

                <p className="text-body text-blue-100 mb-10 max-w-4xl mx-auto">
                  Get exclusive insights, course updates, and industry trends delivered to your inbox.
                  Join our community of 10,000+ professionals already transforming their careers.
                </p>

                <div className="max-w-lg mx-auto mb-8">
                  <div className="flex-responsive gap-4">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 form-responsive bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl focus:ring-4 focus:ring-white/20 focus:outline-none shadow-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-responsive bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <span>📧</span>
                      <span className="hidden sm:inline">Subscribe Now</span>
                      <span className="sm:hidden">Subscribe</span>
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-blue-200 text-small">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No Spam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Unsubscribe Anytime</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </AnimatedSection>

        {/* Contact Section - Responsive Professional */}
        <AnimatedSection
          className="section-spacing bg-gray-900 dark:bg-gray-950 relative transition-colors duration-300 content-layer no-overflow"
          backgroundParallax={true}
        >
          <ParallaxElement speed={-0.3} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30" />
          </ParallaxElement>

          <ParallaxElement speed={0.1} className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/15 dark:bg-blue-500/25 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/15 dark:bg-purple-500/25 rounded-full blur-3xl" />
          </ParallaxElement>

          <div className="relative z-10 responsive-container">
            <div className="content-wrapper">
              <ScrollReveal direction="up" stagger={true}>
                <ContactSection />
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>

        {/* Progress Indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-[95] origin-left"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Back to Top Button - Responsive Enhanced */}
        <motion.button
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 z-[80] flex items-center justify-center group"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>
    </MainLayout>
  );
};

Home.getLayout = (page) => page;

export default Home;
