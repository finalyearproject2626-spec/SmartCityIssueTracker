/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-teal': '#1a4d4d',
        'medium-teal': '#2d7a7a',
        'vibrant-green': '#4ade80',
        'pale-green': '#d1fae5',
        'cream': '#fef9f3',
        'teal-dark': '#0f3a3a',
        'teal-light': '#4a9d9d',
        'green-dark': '#22c55e',
        'green-light': '#86efac',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1a4d4d 0%, #2d7a7a 50%, #4ade80 100%)',
        'gradient-soft': 'linear-gradient(135deg, #d1fae5 0%, #fef9f3 100%)',
        'gradient-teal': 'linear-gradient(135deg, #1a4d4d 0%, #2d7a7a 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(26, 77, 77, 0.1), 0 10px 20px -2px rgba(26, 77, 77, 0.1)',
        'teal': '0 4px 6px -1px rgba(26, 77, 77, 0.1), 0 2px 4px -1px rgba(26, 77, 77, 0.06)',
        'glow': '0 0 20px rgba(74, 222, 128, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
