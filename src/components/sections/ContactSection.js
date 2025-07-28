import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const ContactSection = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from('.contact-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top center',
          toggleActions: 'play none none none',
        }
      });
      
      gsap.from('.contact-form', {
        opacity: 0,
        x: -100,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.contact-container',
          start: 'top bottom',
          toggleActions: 'play none none none',
        }
      });
      
      gsap.from('.contact-info', {
        opacity: 0,
        x: 100,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.contact-container',
          start: 'top bottom',
          toggleActions: 'play none none none',
        }
      });
    }
  }, []);

  return (
    <section ref={contactRef} className="section w-screen h-screen flex items-center px-4 bg-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="contact-title text-4xl font-bold mb-6 text-gray-800">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interested in our programs or have questions? Reach out to us!
          </p>
        </div>

        <div className="contact-container grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="contact-form bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Send Us a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          </div>
          
          <div className="contact-info flex flex-col justify-between">
            <div className="bg-blue-900 text-white rounded-xl shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-200 text-sm">Address</p>
                    <p>123 Innovation Drive, Tech City, TC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-blue-200 text-sm">Email</p>
                    <p>info@arsanexus.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-blue-200 text-sm">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Operating Hours</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-600">
                  Follow us on social media for the latest updates:
                </p>
                <div className="flex space-x-4 mt-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                    <a 
                      key={platform} 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <span className="sr-only">{platform}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;