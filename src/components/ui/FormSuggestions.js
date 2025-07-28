import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FormSuggestions = ({
  fieldType,
  value,
  onChange,
  placeholder,
  className = "",
  suggestions = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Default suggestions for common form fields
  const defaultSuggestions = {
    name: [
      'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
      'David Wilson', 'Lisa Anderson', 'James Miller', 'Maria Garcia'
    ],
    email: [
      'john.smith@example.com', 'sarah.j@example.com', 'mike.brown@example.com',
      'emily.davis@example.com', 'david.w@example.com', 'lisa.a@example.com'
    ],
    phone: [
      '+1 (555) 123-4567', '+1 (555) 987-6543', '+1 (555) 456-7890',
      '+1 (555) 321-9876', '+1 (555) 789-0123', '+1 (555) 654-3210'
    ],
    education: [
      'Bachelor\'s in Computer Science',
      'Master\'s in Software Engineering',
      'Bachelor\'s in Information Technology',
      'Associate Degree in Web Development',
      'PhD in Computer Science',
      'Bachelor\'s in Business Administration',
      'Master\'s in Data Science',
      'Bachelor\'s in Electrical Engineering'
    ],
    experience: [
      '2+ years in web development using React and Node.js',
      '3+ years in mobile app development with React Native',
      '1+ year in data analysis using Python and SQL',
      '4+ years in digital marketing and SEO',
      '2+ years in UI/UX design with Figma and Adobe Creative Suite',
      '3+ years in project management and team leadership',
      'Fresh graduate with internship experience in software development',
      '5+ years in cybersecurity and network administration'
    ],
    motivation: [
      'I want to advance my career in technology and learn cutting-edge skills that will help me secure better job opportunities.',
      'Looking to transition into the tech industry and build a strong foundation in programming and development.',
      'Seeking to enhance my current skills and stay updated with the latest industry trends and technologies.',
      'Interested in developing expertise in AI and machine learning to work on innovative projects.',
      'Want to improve my technical skills to start my own technology business.',
      'Looking to gain certifications and credentials that will boost my professional profile.',
      'Passionate about technology and want to turn my hobby into a successful career.'
    ],
    schedule: [
      'Weekdays - Morning (9 AM - 12 PM)',
      'Weekdays - Evening (6 PM - 9 PM)',
      'Weekends - Saturday & Sunday',
      'Flexible - Any time that works',
      'Part-time - 3 days per week',
      'Full-time - Monday to Friday',
      'Online - Self-paced learning'
    ],
    company: [
      'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix',
      'Tesla', 'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel',
      'Startup Company', 'Freelancer', 'Self-employed', 'Student'
    ],
    jobTitle: [
      'Software Developer', 'Web Developer', 'Data Scientist', 'Product Manager',
      'UI/UX Designer', 'Marketing Specialist', 'Business Analyst', 'Project Manager',
      'Systems Administrator', 'Cybersecurity Analyst', 'DevOps Engineer', 'Student'
    ]
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e);

    if (inputValue.length > 0) {
      const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions[fieldType] || [];
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (!value || value.length === 0) {
      const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions[fieldType] || [];
      setFilteredSuggestions(allSuggestions.slice(0, 5)); // Show first 5 suggestions
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`${className} pr-10`}
        />
        {/* Quick Fill Icon */}
        <button
          type="button"
          onClick={handleInputFocus}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
          title="Quick Fill Suggestions"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Fill Suggestions
              </div>
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200 block"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormSuggestions; 