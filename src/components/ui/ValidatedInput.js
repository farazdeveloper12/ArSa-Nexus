import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidatedInput = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  validation = [],
  required = false,
  disabled = false,
  className = '',
  icon,
  min,
  max,
  step,
  rows = 3,
  options = [], // For select inputs
  ...props
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateField = (fieldValue) => {
    if (!validation || validation.length === 0) {
      return { isValid: true, message: '' };
    }

    for (const validationRule of validation) {
      const result = validationRule(fieldValue);
      if (!result.isValid) {
        return result;
      }
    }

    return { isValid: true, message: '' };
  };

  useEffect(() => {
    if (touched || value) {
      const validation = validateField(value);
      setError(validation.message);
      setIsValid(validation.isValid);
    }
  }, [value, touched, validation]);

  const handleChange = (e) => {
    const newValue = type === 'number' ? e.target.valueAsNumber || e.target.value : e.target.value;
    onChange(e);

    if (touched) {
      const validation = validateField(newValue);
      setError(validation.message);
      setIsValid(validation.isValid);
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    const validation = validateField(value);
    setError(validation.message);
    setIsValid(validation.isValid);

    if (onBlur) {
      onBlur(e);
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border transition-all duration-200 
    ${type === 'textarea' ? 'resize-vertical' : ''}
    ${icon ? 'pl-12' : ''}
    ${error && touched
      ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500'
      : isValid && touched && value
        ? 'border-green-500 bg-green-50 text-green-900 focus:ring-green-500 focus:border-green-500'
        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const darkInputClasses = `
    w-full px-4 py-3 rounded-xl border transition-all duration-200
    ${type === 'textarea' ? 'resize-vertical' : ''}
    ${icon ? 'pl-12' : ''}
    ${error && touched
      ? 'border-red-500/50 bg-red-500/10 text-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500'
      : isValid && touched && value
        ? 'border-green-500/50 bg-green-500/10 text-green-300 focus:ring-green-500 focus:border-green-500'
        : 'border-white/20 bg-white/10 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    backdrop-blur-md
    ${className}
  `;

  const isDarkTheme = className.includes('dark') || className.includes('bg-white/');

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value: value || '',
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      disabled,
      className: isDarkTheme ? darkInputClasses : inputClasses,
      min,
      max,
      step,
      ...props
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={rows} />;

      case 'select':
        return (
          <select {...commonProps}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className={isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        );

      case 'email':
        return (
          <input
            {...commonProps}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        );

      case 'tel':
        return (
          <input
            {...commonProps}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        );

      case 'url':
        return (
          <input
            {...commonProps}
            type="url"
            inputMode="url"
            autoComplete="url"
          />
        );

      case 'date':
        return <input {...commonProps} type="date" />;

      case 'datetime-local':
        return <input {...commonProps} type="datetime-local" />;

      case 'password':
        return (
          <input
            {...commonProps}
            type="password"
            autoComplete="new-password"
          />
        );

      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`w-5 h-5 ${error && touched
                ? 'text-red-400'
                : isValid && touched && value
                  ? 'text-green-400'
                  : isDarkTheme
                    ? 'text-gray-400'
                    : 'text-gray-400'
              }`}>
              {icon}
            </div>
          </div>
        )}

        {renderInput()}

        {/* Validation Icon */}
        {touched && value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isValid ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && touched && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 mt-2 text-sm text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {isValid && touched && value && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 mt-2 text-sm text-green-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Looks good!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidatedInput; 