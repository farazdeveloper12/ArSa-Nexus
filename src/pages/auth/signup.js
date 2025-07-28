import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { signIn, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const SignupPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError('');

    try {
      // Register user API call would go here
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // Sign in the user after successful registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (signInResult?.error) {
        setError('Registration successful, but failed to sign in automatically. Please sign in manually.');
        router.push('/auth/login');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  // Animation for the signup button when form is invalid
  const animateButton = (isValid) => {
    if (!isValid && attemptedSubmit) {
      setButtonPos({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
      });
    } else {
      setButtonPos({ x: 0, y: 0 });
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Arsa Nexus</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link href="/" legacyBehavior>
              <a className="inline-flex items-center mb-6">
                <div className="h-10 w-10 relative mr-2">
                  <div className="absolute inset-0 bg-blue-500 rounded-md opacity-80"></div>
                  <div className="absolute inset-0 bg-purple-500 rounded-md opacity-50 ml-1 mt-1"></div>
                </div>
                <span className="text-2xl font-bold text-white">Arsa Nexus</span>
              </a>
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
            <p className="text-gray-300">Join our community of learners and innovators</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '', terms: false }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty, isSubmitting, values }) => {
              // Check form validity for button animation
              useEffect(() => {
                animateButton(isValid);
              }, [isValid, values]);

              return (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                      Full Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                      Email Address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a strong password"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-400" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-400" />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Field
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-white/10 border-gray-300/30 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-300">
                        I agree to the{' '}
                        <Link href="/terms" legacyBehavior>
                          <a className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" legacyBehavior>
                          <a className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                        </Link>
                      </label>
                      <ErrorMessage name="terms" component="div" className="mt-1 text-sm text-red-400" />
                    </div>
                  </div>

                  {/* Signup button with animation */}
                  <motion.div
                    animate={{
                      x: buttonPos.x,
                      y: buttonPos.y,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      onClick={() => setAttemptedSubmit(true)}
                    >
                      {isLoading || isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </motion.div>

                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-500/30"></div>
                    </div>
                    <div className="relative bg-transparent px-4">
                      <span className="text-sm text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                    Google
                  </button>
                </Form>
              );
            }}
          </Formik>

          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link href="/auth/login" legacyBehavior>
                <a className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign In</a>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;