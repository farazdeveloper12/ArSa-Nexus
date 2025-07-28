// SIMPLE PASSWORD VALIDATION FIX
// Replace the validateForm function in src/pages/admin/users/new.js with this:

const validateForm = () => {
  const newErrors = {};

  // Basic validations
  if (!formData.name || formData.name.trim().length === 0) {
    newErrors.name = 'Name is required';
  }

  if (!formData.email || formData.email.trim().length === 0) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  }

  // Simple password comparison
  if (formData.password && formData.confirmPassword) {
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      console.log('❌ Password mismatch:', {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        passwordChars: formData.password.split(''),
        confirmChars: formData.confirmPassword.split('')
      });
    } else {
      console.log('✅ Passwords match!');
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}; 