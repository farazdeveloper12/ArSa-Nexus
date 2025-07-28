import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const TestimonialsSection = () => {
  const testimonialsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.from('.testimonials-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top center',
          toggleActions: 'play none none none',
        }
      });
      
      gsap.from('.testimonial-card', {
        opacity: 0,
        y: 100,
        stagger: 0.3,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top bottom',
          toggleActions: 'play none none none',
        }
      });
    }
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Development Graduate",
      image: "https://i.pravatar.cc/150?img=1",
      content: "The training program at Arsa Nexus changed my life. I went from knowing nothing about coding to landing a job as a junior developer in just 6 months."
    },
    {
      name: "Michael Chen",
      role: "Data Science Student",
      image: "https://i.pravatar.cc/150?img=3",
      content: "The mentorship I received was invaluable. My mentor connected me with industry professionals and helped me navigate the complex world of data science."
    },
    {
      name: "Jessica Williams",
      role: "Mobile App Developer",
      image: "https://i.pravatar.cc/150?img=5",
      content: "As someone from an underprivileged background, I never thought a career in tech was possible for me. Arsa Nexus provided me with the support and resources I needed to succeed."
    }
  ];

  return (
    <section ref={testimonialsRef} className="section w-screen h-screen flex items-center px-4 bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="testimonials-title text-4xl font-bold mb-6">Success Stories</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Hear from our graduates about how our programs have helped them transform their careers and lives.
          </p>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8"
              whileHover={{ y: -10, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <p className="text-blue-300">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-blue-100">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <motion.button
            className="px-8 py-3 bg-white text-blue-900 rounded-md font-medium hover:bg-blue-50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read More Success Stories
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;