import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';

// Enhanced animations and components
const ParallaxElement = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 300]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const CinematicReveal = ({ children, direction = "up", delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      scale: direction === "scale" ? 0.8 : 1,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [ceoData, setCeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const teamRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/admin/team?status=active');
      const data = await response.json();

      if (data.success) {
        const members = data.data;
        setCeoData(members.find(member => member.isCEO));
        setTeamMembers(members.filter(member => !member.isCEO));
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>About Us | Arsa Nexus - Leading Technology Solutions Company</title>
        <meta name="description" content="Discover the story behind Arsa Nexus, a pioneering technology company dedicated to empowering businesses through cutting-edge solutions and professional services." />
        <meta name="keywords" content="technology company, professional services, business solutions, team, leadership, CEO" />
        <meta property="og:title" content="About Arsa Nexus | Leading Technology Company" />
        <meta property="og:description" content="Pioneering business technology solutions and professional excellence" />
      </Head>

      <div ref={containerRef} className="relative">
        {/* Cinematic Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <ParallaxElement speed={-0.3}>
              <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            </ParallaxElement>
            <ParallaxElement speed={0.2}>
              <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </ParallaxElement>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <CinematicReveal direction="scale" delay={0.2}>
              <motion.span
                className="inline-block py-3 px-6 rounded-full bg-blue-600/20 text-blue-400 text-lg backdrop-blur-sm border border-blue-500/20 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                🏢 About Arsa Nexus - Technology Excellence
              </motion.span>
            </CinematicReveal>

            <CinematicReveal direction="up" delay={0.4}>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                Building the Future of
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400">
                  Business Technology
                </span>
              </h1>
            </CinematicReveal>

            <CinematicReveal direction="up" delay={0.6}>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto">
                We're not just a technology company – we're architects of digital transformation,
                empowering businesses to achieve unprecedented growth and success.
              </p>
            </CinematicReveal>

            {/* Floating Stats */}
            <CinematicReveal direction="scale" delay={0.8}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { number: '500+', label: 'Clients Served', icon: '🏢' },
                  { number: '50+', label: 'Team Members', icon: '👥' },
                  { number: '1000+', label: 'Projects Completed', icon: '🚀' },
                  { number: '15+', label: 'Countries Served', icon: '🌍' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CinematicReveal>
          </div>
        </motion.section>

        {/* CEO Leadership Section */}
        {ceoData && (
          <motion.section className="relative py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
              <CinematicReveal direction="up" className="text-center mb-20">
                <span className="text-blue-600 font-semibold text-lg tracking-wider uppercase">Leadership</span>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mt-4 mb-8">
                  Meet Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Visionary Leader</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Driving innovation and excellence in everything we do
                </p>
              </CinematicReveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <CinematicReveal direction="left" delay={0.3}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-2 backdrop-blur-sm border border-gray-200">
                      <img
                        src={ceoData.image}
                        alt={ceoData.name}
                        className="w-full h-[600px] object-cover rounded-2xl"
                      />
                      <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                        🏆 CEO & Founder
                      </div>
                    </div>
                  </div>
                </CinematicReveal>

                <CinematicReveal direction="right" delay={0.5}>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-4xl font-bold text-gray-900 mb-2">{ceoData.name}</h3>
                      <p className="text-2xl text-blue-600 font-semibold mb-4">{ceoData.position}</p>
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>

                    <div className="prose prose-lg text-gray-700">
                      <p className="text-lg leading-relaxed">{ceoData.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-3">📚 Education</h4>
                        <p className="text-gray-700">{ceoData.education || 'MBA, Technology Leadership'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-3">🎯 Experience</h4>
                        <p className="text-gray-700">{ceoData.experience}</p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                      {ceoData.socialLinks?.linkedin && (
                        <motion.a
                          href={ceoData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </motion.a>
                      )}
                      {ceoData.socialLinks?.twitter && (
                        <motion.a
                          href={ceoData.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </CinematicReveal>
              </div>
            </div>
          </motion.section>
        )}

        {/* Team Section */}
        <motion.section
          ref={teamRef}
          className="relative py-32 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <CinematicReveal direction="up" className="text-center mb-20">
              <span className="text-blue-600 font-semibold text-lg tracking-wider uppercase">Our Team</span>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mt-4 mb-8">
                Meet the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Innovators</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our diverse team of experts, passionate about delivering exceptional results
              </p>
            </CinematicReveal>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <CinematicReveal
                    key={member._id}
                    direction="up"
                    delay={index * 0.1}
                  >
                    <motion.div
                      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                      whileHover={{ y: -10, scale: 1.02 }}
                    >
                      {/* Member Image */}
                      <div className="relative h-80 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {member.isFounder && (
                          <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Founder
                          </div>
                        )}
                        {member.isFeatured && (
                          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Featured
                          </div>
                        )}

                        {/* Social Links Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {member.socialLinks?.linkedin && (
                            <motion.a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.2 }}
                              className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </motion.a>
                          )}
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-blue-600 font-semibold text-lg mb-1">{member.position}</p>
                        <p className="text-gray-500 text-sm mb-4">{member.department}</p>
                        <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                          {member.bio}
                        </p>

                        {/* Expertise Tags */}
                        {member.expertise && member.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.slice(0, 3).map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </CinematicReveal>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section className="relative py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
          <ParallaxElement speed={0.3} className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
          </ParallaxElement>

          <div className="container mx-auto px-4 text-center relative z-10">
            <CinematicReveal direction="up">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Transform</span> Your Business?
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                Partner with us to unlock your business potential and achieve extraordinary results.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const message = "Hello! I'm interested in partnering with Arsa Nexus for our business transformation needs.";
                    window.open(`https://wa.me/923334349102?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  🤝 Start Partnership
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  📞 Schedule Consultation
                </motion.button>
              </div>
            </CinematicReveal>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default AboutPage; 