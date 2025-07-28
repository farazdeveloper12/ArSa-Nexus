import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Main scroll animation wrapper component
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = '',
  once = true,
  stagger = false,
  staggerDelay = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      scale: direction === 'scale' ? 0.8 : 1,
      rotateX: direction === 'flip' ? -90 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...(stagger && {
          staggerChildren: staggerDelay,
          delayChildren: delay
        })
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
      {stagger ? (
        React.Children.map(children, (child, index) => (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: distance },
              visible: { opacity: 1, y: 0 }
            }}
            key={index}
          >
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </motion.div>
  );
};

// Parallax scroll component for background elements
export const ParallaxElement = ({
  children,
  speed = 0.5,
  direction = 'vertical',
  className = ''
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? [0, speed * 200] : [0, 0]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? [0, speed * 200] : [0, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y: direction === 'vertical' ? y : undefined, x: direction === 'horizontal' ? x : undefined }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Advanced GSAP-powered scroll animations
export const GSAPScrollAnimation = ({
  children,
  trigger,
  animation = 'fadeInUp',
  duration = 1,
  delay = 0,
  stagger = 0,
  markers = false,
  className = ''
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const element = ref.current;
      const triggerElement = trigger || element;

      let animation_config = {};

      switch (animation) {
        case 'fadeInUp':
          gsap.set(element, { y: 100, opacity: 0 });
          animation_config = { y: 0, opacity: 1 };
          break;
        case 'fadeInDown':
          gsap.set(element, { y: -100, opacity: 0 });
          animation_config = { y: 0, opacity: 1 };
          break;
        case 'fadeInLeft':
          gsap.set(element, { x: -100, opacity: 0 });
          animation_config = { x: 0, opacity: 1 };
          break;
        case 'fadeInRight':
          gsap.set(element, { x: 100, opacity: 0 });
          animation_config = { x: 0, opacity: 1 };
          break;
        case 'scaleIn':
          gsap.set(element, { scale: 0.5, opacity: 0 });
          animation_config = { scale: 1, opacity: 1 };
          break;
        case 'rotateIn':
          gsap.set(element, { rotation: 180, opacity: 0 });
          animation_config = { rotation: 0, opacity: 1 };
          break;
        case 'slideInUp':
          gsap.set(element, { y: '100%', opacity: 0 });
          animation_config = { y: '0%', opacity: 1 };
          break;
        case 'flipIn':
          gsap.set(element, { rotationX: -90, opacity: 0 });
          animation_config = { rotationX: 0, opacity: 1 };
          break;
        case 'bounceIn':
          gsap.set(element, { scale: 0, opacity: 0 });
          animation_config = {
            scale: 1,
            opacity: 1,
            ease: 'elastic.out(1, 0.5)'
          };
          break;
        default:
          gsap.set(element, { opacity: 0 });
          animation_config = { opacity: 1 };
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
          markers: markers
        }
      });

      if (stagger > 0) {
        const children = element.children;
        tl.to(children, {
          ...animation_config,
          duration,
          delay,
          stagger,
          ease: 'power3.out'
        });
      } else {
        tl.to(element, {
          ...animation_config,
          duration,
          delay,
          ease: 'power3.out'
        });
      }

      return () => {
        tl.kill();
      };
    }
  }, [animation, duration, delay, stagger, markers, trigger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Smooth text reveal animation
export const TextReveal = ({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
  lineHeight = 1.2
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const words = text.split(' ');

  return (
    <div ref={ref} className={className} style={{ lineHeight }}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{
            duration: 0.8,
            delay: delay + (index * staggerDelay),
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Image reveal with parallax effect
export const ImageReveal = ({
  src,
  alt,
  className = '',
  overlayColor = 'rgba(0,0,0,0.3)',
  parallaxSpeed = 0.5
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, parallaxSpeed * 100]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ y }}
        className="relative w-full h-full"
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      </motion.div>
    </div>
  );
};

// Counter animation component
export const CounterAnimation = ({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * end);

        setCount(currentCount);

        if (progress >= 1) {
          clearInterval(timer);
          setCount(end);
        }
      }, 16); // ~60fps

      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

// Typewriter effect component
export const TypewriterText = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  cursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(cursor);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let index = 0;
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (index <= text.length) {
            setDisplayText(text.slice(0, index));
            index++;
          } else {
            clearInterval(interval);
            setTimeout(() => setShowCursor(false), 1000);
          }
        }, speed);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Floating elements animation
export const FloatingElement = ({
  children,
  speed = 2,
  range = 10,
  className = ''
}) => {
  return (
    <motion.div
      animate={{
        y: [-range, range, -range],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Section wrapper with multiple animation effects
export const AnimatedSection = ({
  children,
  className = '',
  backgroundParallax = false,
  fadeIn = true,
  slideDirection = 'up'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <motion.section
      ref={ref}
      initial={fadeIn ? {
        opacity: 0,
        y: slideDirection === 'up' ? 50 : slideDirection === 'down' ? -50 : 0,
        x: slideDirection === 'left' ? 50 : slideDirection === 'right' ? -50 : 0
      } : false}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative ${className}`}
      style={backgroundParallax ? { y: backgroundY } : {}}
    >
      {children}
    </motion.section>
  );
};

export default {
  ScrollReveal,
  ParallaxElement,
  GSAPScrollAnimation,
  TextReveal,
  ImageReveal,
  CounterAnimation,
  TypewriterText,
  FloatingElement,
  AnimatedSection
}; 