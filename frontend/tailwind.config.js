/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette from the design
        'deep-teal': '#1a4d4d',      // Deep teal - dark forest green with blue
        'medium-teal': '#2d7a7a',    // Medium teal - lighter blue-green
        'vibrant-green': '#4ade80',  // Vibrant green - bright lime green
        'pale-green': '#d1fae5',     // Pale green - light chartreuse
        'cream': '#fef9f3',          // Off-white/cream - warm beige
        // Additional shades for gradients and variations
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
      }
    },
  },
  plugins: [],
}
