import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIFormSuggestions = ({
  fieldType,
  currentValue,
  onSuggestionSelect,
  placeholder = "",
  category = "",
  context = {}
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Suggestion Database
  const suggestionDatabase = {
    title: {
      training: [
        "Complete Web Development Bootcamp",
        "Advanced AI & Machine Learning Course",
        "Full Stack JavaScript Mastery",
        "Data Science & Analytics Program",
        "Digital Marketing & SEO Essentials",
        "Mobile App Development with React Native",
        "Cloud Computing & DevOps Training",
        "Cybersecurity Fundamentals",
        "UI/UX Design Masterclass",
        "Python Programming for Beginners"
      ],
      job: [
        "Senior Frontend Developer",
        "Full Stack Software Engineer",
        "Data Scientist",
        "Digital Marketing Manager",
        "UI/UX Designer",
        "DevOps Engineer",
        "Product Manager",
        "Business Analyst",
        "Cybersecurity Specialist",
        "Mobile App Developer"
      ],
      product: [
        "Professional Website Template",
        "AI-Powered Analytics Dashboard",
        "E-commerce Starter Kit",
        "Mobile App UI Kit",
        "Digital Marketing Toolkit",
        "Data Visualization Components",
        "Authentication System Package",
        "Payment Integration Solution"
      ]
    },
    description: {
      training: [
        "Transform your career with comprehensive hands-on training designed by industry experts. Learn cutting-edge technologies and practical skills that employers demand.",
        "Master the fundamentals and advanced concepts through project-based learning. Get personalized mentorship and career guidance throughout your journey.",
        "Intensive program covering real-world applications and industry best practices. Build a portfolio of projects while learning from experienced professionals.",
        "Comprehensive curriculum designed for career advancement. Includes practical exercises, case studies, and direct industry exposure."
      ],
      job: [
        "Join our dynamic team and contribute to innovative projects that impact millions of users. We offer competitive compensation and excellent growth opportunities.",
        "Exciting opportunity to work with cutting-edge technology in a collaborative environment. Perfect for passionate professionals looking to make a difference.",
        "Lead challenging projects and work alongside talented professionals. We value creativity, innovation, and continuous learning.",
        "Be part of a fast-growing company where your ideas matter. Excellent benefits, flexible work arrangements, and career development opportunities."
      ],
      product: [
        "Professional-grade solution designed to accelerate your development process. Includes comprehensive documentation and expert support.",
        "Cutting-edge technology stack with modern design principles. Fully customizable and scalable for any business need.",
        "Enterprise-ready solution with robust security and performance optimization. Trusted by leading companies worldwide.",
        "Innovative tools designed to boost productivity and streamline workflows. Easy to integrate and use with excellent customer support."
      ]
    },
    duration: {
      training: [
        "8 weeks",
        "12 weeks",
        "16 weeks",
        "6 months",
        "3 months",
        "4 weeks",
        "20 weeks",
        "1 year",
        "6 weeks",
        "10 weeks"
      ]
    },
    price: {
      training: ["499", "799", "999", "1299", "1599", "299", "399", "1999", "2499"],
      product: ["29", "49", "99", "149", "199", "299", "399", "499", "99", "149"]
    },
    category: {
      training: [
        "Web Development",
        "Mobile Development",
        "AI & Machine Learning",
        "Data Science",
        "Digital Marketing",
        "UI/UX Design",
        "Cloud Computing",
        "Cybersecurity",
        "Business Development",
        "Content Creation"
      ],
      job: [
        "Web Development",
        "Mobile Development",
        "AI & Machine Learning",
        "Data Science",
        "Digital Marketing",
        "UI/UX Design",
        "Cloud Computing",
        "Cybersecurity",
        "Business Development",
        "Content Creation",
        "Project Management",
        "Sales & Marketing"
      ]
    },
    requirements: {
      training: [
        "Basic computer knowledge",
        "High school diploma or equivalent",
        "Passion for learning technology",
        "Commitment to complete the program",
        "Access to computer and internet"
      ],
      job: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of relevant experience",
        "Strong problem-solving skills",
        "Excellent communication skills",
        "Experience with modern development tools",
        "Portfolio of relevant projects"
      ]
    }
  };

  // Generate contextual suggestions
  const generateSuggestions = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let newSuggestions = [];

      if (suggestionDatabase[fieldType]) {
        if (category && suggestionDatabase[fieldType][category]) {
          newSuggestions = suggestionDatabase[fieldType][category];
        } else {
          // Get suggestions from all categories for this field type
          const allSuggestions = Object.values(suggestionDatabase[fieldType]).flat();
          newSuggestions = allSuggestions;
        }
      }

      // Filter suggestions based on current value
      if (currentValue) {
        newSuggestions = newSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(currentValue.toLowerCase()) ||
          currentValue.toLowerCase().includes(suggestion.toLowerCase()) ||
          suggestion.toLowerCase().startsWith(currentValue.toLowerCase())
        );
      }

      // Limit to top 5 suggestions
      setSuggestions(newSuggestions.slice(0, 5));
      setIsGenerating(false);
    }, 500);
  };

  // Smart validation and warnings
  const getFieldValidation = () => {
    const warnings = [];

    if (fieldType === 'duration' && currentValue) {
      const durationPattern = /^(\d+)\s*(weeks?|months?|days?|hours?|years?)$/i;
      if (!durationPattern.test(currentValue.trim())) {
        warnings.push("Duration should be in format like '8 weeks', '3 months', or '40 hours'");
      }
    }

    if (fieldType === 'price' && currentValue) {
      const pricePattern = /^\d+(\.\d{2})?$/;
      if (!pricePattern.test(currentValue.trim())) {
        warnings.push("Price should be a number like '299' or '499.99'");
      }
    }

    if (fieldType === 'title' && currentValue && currentValue.length < 10) {
      warnings.push("Title should be descriptive and at least 10 characters long");
    }

    if (fieldType === 'description' && currentValue && currentValue.length < 50) {
      warnings.push("Description should be detailed and at least 50 characters long");
    }

    return warnings;
  };

  const warnings = getFieldValidation();

  return (
    <div className="relative">
      {/* AI Suggestion Button */}
      <div className="flex items-center gap-2 mb-2">
        <motion.button
          type="button"
          onClick={() => {
            generateSuggestions();
            setShowSuggestions(!showSuggestions);
          }}
          className="flex items-center gap-2 px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xs">🤖</span>
          <span>AI Suggest</span>
        </motion.button>

        {fieldType === 'duration' && (
          <div className="text-xs text-gray-500">
            Use formats like: 8 weeks, 3 months, 40 hours
          </div>
        )}

        {fieldType === 'price' && (
          <div className="text-xs text-gray-500">
            Enter amount in USD (e.g., 299, 499.99)
          </div>
        )}
      </div>

      {/* Validation Warnings */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-2"
          >
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm"
              >
                <span>⚠️</span>
                <span>{warning}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          >
            {isGenerating ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-600">Generating AI suggestions...</span>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>🎯</span>
                    <span>AI Suggestions for {fieldType}</span>
                  </div>
                </div>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSuggestionSelect(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-purple-500 mt-0.5">✨</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{suggestion}</div>
                        {fieldType === 'description' && (
                          <div className="text-xs text-gray-500 mt-1">
                            Click to use this suggestion
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <span>🤖</span>
                <div className="text-sm">No suggestions available for this field</div>
              </div>
            )}

            <div className="p-2 bg-gray-50 text-center">
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Close suggestions
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Smart Input Component with AI suggestions
export const SmartInput = ({
  label,
  type = "text",
  fieldType,
  value,
  onChange,
  placeholder = "",
  required = false,
  category = "",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <AIFormSuggestions
        fieldType={fieldType}
        currentValue={value}
        onSuggestionSelect={onChange}
        placeholder={placeholder}
        category={category}
      />

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

// Smart Textarea Component
export const SmartTextarea = ({
  label,
  fieldType,
  value,
  onChange,
  placeholder = "",
  required = false,
  category = "",
  rows = 4,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <AIFormSuggestions
        fieldType={fieldType}
        currentValue={value}
        onSuggestionSelect={onChange}
        placeholder={placeholder}
        category={category}
      />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-vertical ${className}`}
        {...props}
      />
    </div>
  );
};

// Smart Select Component with duration presets
export const SmartSelect = ({
  label,
  fieldType,
  value,
  onChange,
  options = [],
  required = false,
  className = "",
  ...props
}) => {
  // Duration presets for duration fields
  const durationOptions = [
    "4 weeks", "6 weeks", "8 weeks", "10 weeks", "12 weeks",
    "3 months", "4 months", "6 months", "9 months", "1 year",
    "40 hours", "60 hours", "80 hours", "100 hours", "120 hours"
  ];

  const selectOptions = fieldType === 'duration' ? durationOptions : options;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${className}`}
        {...props}
      >
        <option value="">Select {label}</option>
        {selectOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AIFormSuggestions; 