import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Create context
const SmoothScrollContext = createContext({
  scroll: null,
  isReady: false,
});

export const SmoothScrollProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [scroll, setScroll] = useState(null);
  const router = useRouter();

  // Initialize smooth scrolling
  useEffect(() => {
    // Only init on client side (browser)
    if (typeof window === 'undefined') return;

    // Create and configure the smooth scroll setup
    const initSmoothScroll = () => {
      // Reset any existing ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Get the container
      const container = document.querySelector('.smooth-scroll-container');
      if (!container) return;

      // Set height for container to enable scrolling
      const setHeight = () => {
        document.body.style.height = `${container.offsetHeight}px`;
      };
      
      // Update height on window resize
      window.addEventListener('resize', setHeight);
      setHeight();

      // Create the animation that will be controlled by scrolling
      const smoothScroll = gsap.to(container, {
        y: () => -(container.offsetHeight - window.innerHeight),
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing effect
          invalidateOnRefresh: true,
        },
      });

      setScroll(smoothScroll);
      setIsReady(true);

      return () => {
        // Cleanup on unmount
        window.removeEventListener('resize', setHeight);
        document.body.style.height = '';
        smoothScroll.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    };

    const initTimeout = setTimeout(initSmoothScroll, 100);
    
    return () => {
      clearTimeout(initTimeout);
    };
  }, [router.pathname]); // Re-initialize when route changes

  // Setup horizontal scrolling sections where needed
  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;
    
    // Setup horizontal scroll sections (optional)
    const setupHorizontalScroll = () => {
      const horizontalSections = document.querySelectorAll('.horizontal-scroll-section');
      
      horizontalSections.forEach(section => {
        const items = section.querySelectorAll('.horizontal-scroll-item');
        if (!items.length) return;
        
        // Create horizontal scroll animation
        gsap.to(items, {
          xPercent: -100 * (items.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${section.offsetWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
    };
    
    setupHorizontalScroll();
    
    return () => {
      // Clean up section scroll triggers
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger.classList.contains('horizontal-scroll-section')) {
          trigger.kill();
        }
      });
    };
  }, [isReady, router.pathname]);

  // Utility function to scroll to a specific element
  const scrollTo = (target, options = {}) => {
    if (!target || typeof window === 'undefined') return;
    
    const defaults = {
      duration: 1.5,
      ease: 'power3.inOut',
      offset: 0,
    };
    
    const settings = { ...defaults, ...options };
    
    gsap.to(window, {
      duration: settings.duration,
      scrollTo: {
        y: target,
        offsetY: settings.offset,
      },
      ease: settings.ease,
    });
  };

  return (
    <SmoothScrollContext.Provider value={{ scroll, isReady, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

// Custom hook for using the scroll context
export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (context === undefined) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
};

export default SmoothScrollContext;