import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';

const mongoose = require('mongoose');

// Website content schema
const WebsiteContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const WebsiteContent = mongoose.models.WebsiteContent || mongoose.model('WebsiteContent', WebsiteContentSchema);

export default async function handler(req, res) {
  await dbConnect();

  try {
    const session = await getServerSession(req, res, authOptions);

    // Check authorization
    if (!session || !['admin', 'manager', 'editor'].includes(session.user.role)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Only admin, manager, or editor can manage content.'
      });
    }

    if (req.method === 'GET') {
      // Get all website content
      const content = await WebsiteContent.find({})
        .populate('updatedBy', 'name email')
        .sort({ section: 1 });

      // Structure the content by section
      const structuredContent = {};
      content.forEach(item => {
        structuredContent[item.section] = item.content;
      });

      // Set comprehensive default content if nothing exists
      if (Object.keys(structuredContent).length === 0) {
        const defaultContent = {
          // Hero Section - Complete
          hero: {
            announcement: {
              text: "New AI Courses Available - Enroll Today!",
              icon: "🚀"
            },
            title: {
              line1: "Building",
              line2: "Tomorrow's",
              line3: "Future Leaders"
            },
            subtitle: "Transform your career with cutting-edge professional training and technology solutions designed by industry experts for career excellence.",
            ctaButtons: {
              primary: {
                text: "Explore Training Programs",
                url: "/training",
                icon: "🚀"
              },
              secondary: {
                text: "Learn More About Us",
                url: "/about",
                icon: "📚"
              }
            },
            stats: [
              { icon: "🎓", number: "10K+", label: "Students Trained" },
              { icon: "💼", number: "95%", label: "Job Placement" },
              { icon: "🤝", number: "50+", label: "Industry Partners" },
              { icon: "💡", number: "24/7", label: "Learning Support" }
            ],
            scrollText: "SCROLL TO EXPLORE"
          },

          // About Section - Complete
          about: {
            title: "About ArSa Nexus",
            subtitle: "Leading the Future of Professional Development",
            description: "We are committed to providing world-class training and development solutions that empower individuals and organizations to achieve their full potential in the digital age.",
            story: {
              title: "Our Story",
              paragraphs: [
                "Founded with a vision to bridge the gap between academic learning and industry requirements, ArSa Nexus has emerged as a beacon of excellence in professional development.",
                "Our journey began with a simple belief: that everyone deserves access to quality education and training that can transform their career trajectory.",
                "Today, we have grown to become a trusted partner for thousands of professionals seeking career transformation and excellence.",
                "With our industry-aligned curriculum and expert mentorship, we continue to set new standards in professional education."
              ]
            },
            mission: "To empower individuals with cutting-edge skills and knowledge that drive career success and innovation.",
            vision: "To be the global leader in professional development, creating a world where everyone has access to transformative learning experiences.",
            values: [
              { icon: "🎯", title: "Excellence", description: "We strive for excellence in everything we do." },
              { icon: "🚀", title: "Innovation", description: "We embrace innovation and cutting-edge technologies." },
              { icon: "🤝", title: "Integrity", description: "We maintain the highest standards of integrity." },
              { icon: "💡", title: "Growth", description: "We foster continuous learning and growth." }
            ]
          },

          // Services Section - Complete  
          services: {
            title: "Our Services",
            subtitle: "Comprehensive Solutions for Your Growth",
            description: "We offer a wide range of services designed to accelerate your career and business growth through cutting-edge technology and expert guidance.",
            services: [
              {
                icon: "💻",
                title: "Web Development Training",
                description: "Master modern web technologies including React, Node.js, and full-stack development with hands-on projects and real-world applications.",
                features: ["Frontend Development", "Backend APIs", "Database Management", "Deployment & DevOps"]
              },
              {
                icon: "🤖",
                title: "AI & Machine Learning",
                description: "Learn cutting-edge AI technologies, machine learning algorithms, and data science techniques with practical implementation.",
                features: ["Python Programming", "ML Algorithms", "Deep Learning", "AI Applications"]
              },
              {
                icon: "📱",
                title: "Mobile App Development",
                description: "Build native and cross-platform mobile applications using React Native, Flutter, and native iOS/Android development.",
                features: ["React Native", "Flutter", "iOS Development", "Android Development"]
              },
              {
                icon: "☁️",
                title: "Cloud Computing",
                description: "Master cloud platforms like AWS, Azure, and Google Cloud with hands-on experience in deployment and scalability.",
                features: ["AWS Services", "Azure Cloud", "Google Cloud", "DevOps Practices"]
              },
              {
                icon: "🎨",
                title: "UI/UX Design",
                description: "Create stunning user interfaces and experiences using design thinking, Figma, and modern design principles.",
                features: ["Design Thinking", "Figma/Adobe XD", "User Research", "Prototyping"]
              },
              {
                icon: "📊",
                title: "Data Analytics",
                description: "Transform data into insights using advanced analytics tools, visualization techniques, and business intelligence.",
                features: ["Data Visualization", "Statistical Analysis", "Business Intelligence", "Reporting Tools"]
              }
            ]
          },

          // Training Section - Complete
          training: {
            title: "Training Programs",
            subtitle: "Skill-Building Programs Designed for Success",
            description: "Our comprehensive training programs are designed by industry experts to provide you with the skills and knowledge needed to excel in your career.",
            programs: [
              {
                id: "web-dev",
                title: "Web Development Bootcamp",
                description: "Comprehensive 6-month program covering full-stack web development",
                duration: "6 months",
                level: "Beginner to Advanced",
                price: "$2,999",
                image: "/images/training/web-dev.jpg",
                highlights: ["100% Job Placement Assistance", "Live Projects", "Industry Mentorship", "Certificate of Completion"],
                curriculum: ["HTML/CSS/JavaScript", "React.js", "Node.js", "Database Management", "API Development", "Deployment"]
              },
              {
                id: "ai-ml",
                title: "AI & Machine Learning Program",
                description: "Advanced 8-month program in artificial intelligence and machine learning",
                duration: "8 months",
                level: "Intermediate to Advanced",
                price: "$3,999",
                image: "/images/training/ai-basics.jpg",
                highlights: ["Industry Projects", "Research Opportunities", "Expert Mentorship", "Global Certification"],
                curriculum: ["Python Programming", "Statistics & Math", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"]
              },
              {
                id: "mobile-dev",
                title: "Mobile App Development",
                description: "Create native and cross-platform mobile applications",
                duration: "5 months",
                level: "Beginner to Intermediate",
                price: "$2,499",
                image: "/images/training/mobile-dev.jpg",
                highlights: ["App Store Deployment", "Real Client Projects", "Portfolio Development", "Industry Standards"],
                curriculum: ["React Native", "Flutter", "iOS Development", "Android Development", "App Store Optimization"]
              },
              {
                id: "ui-ux",
                title: "UI/UX Design Mastery",
                description: "Complete design thinking and user experience program",
                duration: "4 months",
                level: "Beginner to Advanced",
                price: "$1,999",
                image: "/images/training/ui-ux.jpg",
                highlights: ["Design Portfolio", "Client Projects", "Industry Tools", "Creative Mentorship"],
                curriculum: ["Design Principles", "User Research", "Figma/Adobe XD", "Prototyping", "Usability Testing"]
              },
              {
                id: "data-analytics",
                title: "Data Analytics & BI",
                description: "Transform data into business insights and intelligence",
                duration: "6 months",
                level: "Beginner to Advanced",
                price: "$2,799",
                image: "/images/training/data-analysis.jpg",
                highlights: ["Real Business Cases", "Industry Tools", "Certification Prep", "Job Placement"],
                curriculum: ["Excel/SQL", "Python/R", "Tableau/Power BI", "Statistical Analysis", "Business Intelligence"]
              },
              {
                id: "digital-marketing",
                title: "Digital Marketing Expert",
                description: "Master modern digital marketing strategies and tools",
                duration: "3 months",
                level: "Beginner to Intermediate",
                price: "$1,499",
                image: "/images/training/digital-marketing.jpg",
                highlights: ["Live Campaigns", "Google Certifications", "Social Media Mastery", "ROI Optimization"],
                curriculum: ["SEO/SEM", "Social Media Marketing", "Content Strategy", "Analytics", "Paid Advertising"]
              }
            ]
          },

          // Testimonials Section - Complete
          testimonials: {
            title: "Success Stories",
            subtitle: "What Our Students Say About Their Journey",
            description: "Hear from our successful graduates who have transformed their careers through our programs.",
            testimonials: [
              {
                id: 1,
                name: "Sarah Johnson",
                role: "Full-Stack Developer at Google",
                image: "/images/testimonials/testimonial-1.jpg",
                rating: 5,
                text: "ArSa Nexus completely transformed my career. The web development bootcamp was intensive but incredibly rewarding. I landed my dream job at Google within 2 months of graduation!",
                program: "Web Development Bootcamp",
                company: "Google"
              },
              {
                id: 2,
                name: "Michael Chen",
                role: "AI Engineer at Microsoft",
                image: "/images/testimonials/testimonial-2.jpg",
                rating: 5,
                text: "The AI & ML program exceeded my expectations. The hands-on projects and expert mentorship prepared me perfectly for my current role. Best investment I've ever made!",
                program: "AI & Machine Learning Program",
                company: "Microsoft"
              },
              {
                id: 3,
                name: "Emily Rodriguez",
                role: "Senior UX Designer at Apple",
                image: "/images/testimonials/testimonial-3.jpg",
                rating: 5,
                text: "The UI/UX program helped me transition from graphic design to UX design seamlessly. The portfolio I built during the course got me hired at Apple!",
                program: "UI/UX Design Mastery",
                company: "Apple"
              },
              {
                id: 4,
                name: "David Kim",
                role: "Data Scientist at Amazon",
                image: "/images/testimonials/testimonial-4.jpg",
                rating: 5,
                text: "From zero programming knowledge to Data Scientist at Amazon - ArSa Nexus made it possible. The support and guidance throughout the journey was exceptional.",
                program: "Data Analytics & BI",
                company: "Amazon"
              }
            ]
          },

          // Contact Section - Complete
          contact: {
            title: "Get In Touch",
            subtitle: "Ready to Transform Your Career?",
            description: "Contact us today to learn more about our training programs and how we can help you achieve your professional goals.",
            contactInfo: {
              email: {
                label: "Email Us",
                value: "info@arsanexus.com",
                icon: "📧"
              },
              phone: {
                label: "Call Us",
                value: "+1 (555) 123-4567",
                icon: "📞"
              },
              address: {
                label: "Visit Us",
                value: "123 Tech Street, Innovation City, IC 12345",
                icon: "📍"
              },
              hours: {
                label: "Business Hours",
                value: "Monday - Friday: 9 AM - 6 PM",
                icon: "⏰"
              }
            },
            socialMedia: {
              facebook: { url: "https://facebook.com/arsanexus", icon: "📘" },
              twitter: { url: "https://twitter.com/arsanexus", icon: "🐦" },
              linkedin: { url: "https://linkedin.com/company/arsanexus", icon: "💼" },
              instagram: { url: "https://instagram.com/arsanexus", icon: "📷" },
              youtube: { url: "https://youtube.com/arsanexus", icon: "📺" }
            },
            form: {
              title: "Send us a Message",
              fields: {
                name: "Your Name",
                email: "Email Address",
                subject: "Subject",
                message: "Your Message"
              },
              submitButton: "Send Message",
              successMessage: "Thank you! Your message has been sent successfully.",
              errorMessage: "Sorry, there was an error sending your message. Please try again."
            }
          },

          // Footer Section - Complete
          footer: {
            company: {
              name: "ArSa Nexus LLC",
              description: "ArSa Nexus LLC is a leading provider of professional training and development solutions, helping individuals and organizations thrive in the digital economy through cutting-edge education and innovative technology solutions.",
              tagline: "Empowering Tomorrow's Leaders Today"
            },
            quickLinks: {
              title: "Quick Links",
              links: [
                { text: "About Us", url: "/about" },
                { text: "Training Programs", url: "/training" },
                { text: "Services", url: "/services" },
                { text: "Contact", url: "/contact" },
                { text: "Blog", url: "/blog" },
                { text: "Careers", url: "/careers" }
              ]
            },
            programs: {
              title: "Programs",
              links: [
                { text: "Web Development", url: "/training/web-development" },
                { text: "AI & Machine Learning", url: "/training/ai-ml" },
                { text: "Mobile Development", url: "/training/mobile-dev" },
                { text: "UI/UX Design", url: "/training/ui-ux" },
                { text: "Data Analytics", url: "/training/data-analytics" },
                { text: "Digital Marketing", url: "/training/digital-marketing" }
              ]
            },
            support: {
              title: "Support",
              links: [
                { text: "Help Center", url: "/help" },
                { text: "Student Portal", url: "/student-portal" },
                { text: "FAQs", url: "/faq" },
                { text: "Privacy Policy", url: "/privacy" },
                { text: "Terms of Service", url: "/terms" },
                { text: "Refund Policy", url: "/refund-policy" }
              ]
            },
            contact: {
              title: "Contact Info",
              email: "info@arsanexus.com",
              phone: "+1 (555) 123-4567",
              address: "123 Tech Street, Innovation City, IC 12345"
            },
            socialLinks: {
              facebook: "https://facebook.com/arsanexus",
              twitter: "https://twitter.com/arsanexus",
              linkedin: "https://linkedin.com/company/arsanexus",
              instagram: "https://instagram.com/arsanexus",
              youtube: "https://youtube.com/arsanexus"
            },
            copyright: "© 2024 ArSa Nexus LLC. All rights reserved.",
            bottomLinks: [
              { text: "Privacy Policy", url: "/privacy" },
              { text: "Terms of Service", url: "/terms" },
              { text: "Cookie Policy", url: "/cookies" }
            ]
          },

          // Navigation/Header - Complete
          navigation: {
            logo: {
              text: "ArSa Nexus",
              tagline: "Professional Excellence"
            },
            menuItems: [
              { text: "Home", url: "/" },
              { text: "About", url: "/about" },
              { text: "Training", url: "/training" },
              { text: "Services", url: "/services" },
              { text: "Contact", url: "/contact" },
              { text: "Blog", url: "/blog" }
            ],
            ctaButton: {
              text: "Get Started",
              url: "/training"
            }
          },

          // Meta/SEO - Complete
          seo: {
            global: {
              siteName: "ArSa Nexus - Professional Training & Development",
              defaultTitle: "ArSa Nexus | Transform Your Career with Professional Training",
              defaultDescription: "Leading provider of professional training and development solutions. Master web development, AI/ML, mobile apps, UI/UX design, and more with expert guidance.",
              keywords: "professional training, web development, AI machine learning, mobile app development, UI UX design, data analytics, career transformation",
              author: "ArSa Nexus LLC",
              ogImage: "/images/og-image.jpg"
            },
            pages: {
              home: {
                title: "ArSa Nexus | Transform Your Career with Professional Training",
                description: "Leading provider of professional training in web development, AI/ML, mobile apps, and more. 95% job placement rate with expert mentorship.",
                keywords: "professional training, career transformation, web development bootcamp, AI training"
              },
              about: {
                title: "About ArSa Nexus | Leading Professional Development Provider",
                description: "Learn about ArSa Nexus's mission to provide world-class training and development solutions. Discover our story, values, and commitment to excellence.",
                keywords: "about arsa nexus, professional development, training company, career transformation"
              },
              training: {
                title: "Training Programs | Professional Development Courses - ArSa Nexus",
                description: "Explore our comprehensive training programs in web development, AI/ML, mobile apps, UI/UX design, and data analytics. Expert-led courses with job placement.",
                keywords: "training programs, web development bootcamp, AI machine learning course, mobile app development"
              }
            }
          }
        };

        // Save default content
        for (const [section, content] of Object.entries(defaultContent)) {
          await WebsiteContent.findOneAndUpdate(
            { section },
            {
              content,
              lastUpdated: new Date(),
              updatedBy: session.user.id
            },
            { upsert: true, new: true }
          );
        }

        return res.status(200).json({
          success: true,
          content: defaultContent
        });
      }

      res.status(200).json({
        success: true,
        content: structuredContent
      });

    } else if (req.method === 'POST') {
      const { content, section } = req.body;

      // Handle saving complete content object (from frontend)
      if (content && !section) {
        const updatedSections = [];

        // Save each section separately
        for (const [sectionName, sectionContent] of Object.entries(content)) {
          const updatedContent = await WebsiteContent.findOneAndUpdate(
            { section: sectionName },
            {
              content: sectionContent,
              lastUpdated: new Date(),
              updatedBy: session.user.id
            },
            { upsert: true, new: true, runValidators: true }
          ).populate('updatedBy', 'name email');

          updatedSections.push(updatedContent);
        }

        // Real-time content cache update
        try {
          const allContent = await WebsiteContent.find({}).lean();
          const structuredContent = {};
          allContent.forEach(item => {
            structuredContent[item.section] = item.content;
          });

          // Store in global cache for instant access
          global.websiteContentCache = structuredContent;

          console.log('✅ Content cache updated successfully - changes will appear instantly on user site');
        } catch (error) {
          console.error('❌ Error updating content cache:', error);
        }

        return res.status(200).json({
          success: true,
          message: 'All content sections updated successfully and synchronized to live site',
          data: updatedSections,
          timestamp: new Date().toISOString()
        });
      }

      // Handle saving individual section (legacy support)
      if (section && content) {
        const updatedContent = await WebsiteContent.findOneAndUpdate(
          { section },
          {
            content,
            lastUpdated: new Date(),
            updatedBy: session.user.id
          },
          { upsert: true, new: true, runValidators: true }
        ).populate('updatedBy', 'name email');

        // Update cache for individual section
        if (!global.websiteContentCache) {
          global.websiteContentCache = {};
        }
        global.websiteContentCache[section] = content;

        return res.status(200).json({
          success: true,
          message: 'Content section updated successfully',
          data: updatedContent
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Content data is required'
      });

    } else if (req.method === 'DELETE') {
      const { section } = req.body;

      if (!section) {
        return res.status(400).json({
          success: false,
          message: 'Section name is required for deletion'
        });
      }

      await WebsiteContent.findOneAndDelete({ section });

      // Update cache
      if (global.websiteContentCache && global.websiteContentCache[section]) {
        delete global.websiteContentCache[section];
      }

      return res.status(200).json({
        success: true,
        message: 'Content section deleted successfully'
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }

  } catch (error) {
    console.error('Content management error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
} 