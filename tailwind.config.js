/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#f0e6ff',
          100: '#d1b3ff',
          200: '#b380ff',
          300: '#944dff',
          400: '#751aff',
          500: '#6600ff',
          600: '#5200cc',
          700: '#3d0099',
          800: '#290066',
          900: '#140033',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
