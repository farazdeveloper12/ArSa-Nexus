// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
    return { isValid: false, message: 'Please enter a valid phone number (minimum 10 digits)' };
  }
  return { isValid: true, message: '' };
};

export const validateNumber = (value, min = null, max = null, isRequired = true) => {
  if (!value && value !== 0) {
    if (isRequired) {
      return { isValid: false, message: 'This field is required' };
    }
    return { isValid: true, message: '' };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, message: 'Please enter a valid number' };
  }

  if (min !== null && numValue < min) {
    return { isValid: false, message: `Value must be at least ${min}` };
  }

  if (max !== null && numValue > max) {
    return { isValid: false, message: `Value must not exceed ${max}` };
  }

  return { isValid: true, message: '' };
};

export const validateInteger = (value, min = null, max = null, isRequired = true) => {
  if (!value && value !== 0) {
    if (isRequired) {
      return { isValid: false, message: 'This field is required' };
    }
    return { isValid: true, message: '' };
  }

  const numValue = parseInt(value);
  if (isNaN(numValue) || !Number.isInteger(Number(value))) {
    return { isValid: false, message: 'Please enter a whole number' };
  }

  if (min !== null && numValue < min) {
    return { isValid: false, message: `Value must be at least ${min}` };
  }

  if (max !== null && numValue > max) {
    return { isValid: false, message: `Value must not exceed ${max}` };
  }

  return { isValid: true, message: '' };
};

export const validateDate = (date, isFuture = false, isPast = false) => {
  if (!date) {
    return { isValid: false, message: 'Date is required' };
  }

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }

  if (isFuture && dateObj <= today) {
    return { isValid: false, message: 'Date must be in the future' };
  }

  if (isPast && dateObj >= today) {
    return { isValid: false, message: 'Date must be in the past' };
  }

  return { isValid: true, message: '' };
};

export const validateText = (value, minLength = 1, maxLength = null, isRequired = true) => {
  if (!value || value.trim().length === 0) {
    if (isRequired) {
      return { isValid: false, message: 'This field is required' };
    }
    return { isValid: true, message: '' };
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < minLength) {
    return { isValid: false, message: `Minimum ${minLength} characters required` };
  }

  if (maxLength && trimmedValue.length > maxLength) {
    return { isValid: false, message: `Maximum ${maxLength} characters allowed` };
  }

  return { isValid: true, message: '' };
};

export const validateUrl = (url, isRequired = false) => {
  if (!url) {
    if (isRequired) {
      return { isValid: false, message: 'URL is required' };
    }
    return { isValid: true, message: '' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, message: 'URL must start with http:// or https://' };
    }
    return { isValid: true, message: '' };
  } catch (error) {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

export const validatePassword = (password, minLength = 8) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters long` };
  }

  // Check for at least one uppercase, one lowercase, one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    };
  }

  return { isValid: true, message: '' };
};

export const validateArrayField = (array, fieldName, minItems = 1) => {
  if (!array || !Array.isArray(array)) {
    return { isValid: false, message: `${fieldName} must be an array` };
  }

  const nonEmptyItems = array.filter(item => item && item.trim && item.trim().length > 0);

  if (nonEmptyItems.length < minItems) {
    return { isValid: false, message: `At least ${minItems} ${fieldName.toLowerCase()} ${minItems === 1 ? 'is' : 'are'} required` };
  }

  return { isValid: true, message: '' };
};

export const validateSalary = (salary) => {
  if (!salary || typeof salary !== 'object') {
    return { isValid: false, message: 'Salary information is required' };
  }

  const { type, min, max, amount, period } = salary;

  if (!type) {
    return { isValid: false, message: 'Salary type is required' };
  }

  if (type === 'Range') {
    const minValidation = validateNumber(min, 0, null, true);
    if (!minValidation.isValid) {
      return { isValid: false, message: `Minimum salary: ${minValidation.message}` };
    }

    const maxValidation = validateNumber(max, 0, null, true);
    if (!maxValidation.isValid) {
      return { isValid: false, message: `Maximum salary: ${maxValidation.message}` };
    }

    if (parseFloat(min) >= parseFloat(max)) {
      return { isValid: false, message: 'Maximum salary must be greater than minimum salary' };
    }
  }

  if (type === 'Fixed') {
    const amountValidation = validateNumber(amount, 0, null, true);
    if (!amountValidation.isValid) {
      return { isValid: false, message: `Salary amount: ${amountValidation.message}` };
    }
  }

  if (!period && type !== 'Negotiable') {
    return { isValid: false, message: 'Salary period is required' };
  }

  return { isValid: true, message: '' };
};

export const validateStipend = (stipend) => {
  if (!stipend || typeof stipend !== 'object') {
    return { isValid: false, message: 'Stipend information is required' };
  }

  const { amount, period } = stipend;

  if (period === 'Unpaid') {
    return { isValid: true, message: '' };
  }

  const amountValidation = validateNumber(amount, 0, null, true);
  if (!amountValidation.isValid) {
    return { isValid: false, message: `Stipend amount: ${amountValidation.message}` };
  }

  if (!period) {
    return { isValid: false, message: 'Stipend period is required' };
  }

  return { isValid: true, message: '' };
};

// Comprehensive form validation
export const validateForm = (data, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = data[field];

    for (const rule of rules) {
      const validation = rule(value);
      if (!validation.isValid) {
        errors[field] = validation.message;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};

// Validation rules builder
export const required = (message = 'This field is required') => (value) => {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return { isValid: false, message };
  }
  return { isValid: true, message: '' };
};

export const email = (message = 'Please enter a valid email address') => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validateEmail(value);
};

export const phone = (message = 'Please enter a valid phone number') => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validatePhone(value);
};

export const minLength = (min, message) => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validateText(value, min, null, false);
};

export const maxLength = (max, message) => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validateText(value, 1, max, false);
};

export const number = (min = null, max = null, message = 'Please enter a valid number') => (value) => {
  if (!value && value !== 0) return { isValid: true, message: '' };
  return validateNumber(value, min, max, false);
};

export const integer = (min = null, max = null, message = 'Please enter a whole number') => (value) => {
  if (!value && value !== 0) return { isValid: true, message: '' };
  return validateInteger(value, min, max, false);
};

export const futureDate = (message = 'Date must be in the future') => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validateDate(value, true, false);
};

export const pastDate = (message = 'Date must be in the past') => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validateDate(value, false, true);
};

export const url = (message = 'Please enter a valid URL') => (value) => {
  if (!value) return { isValid: true, message: '' };
  return validateUrl(value, false);
}; 