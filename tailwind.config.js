/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          // Softer green palette
          green: '#00D66E',
          'green-light': '#4ADE80',
          'green-dark': '#059669',
          // From live site: Yellow accent
          yellow: '#FFCB05',
          'yellow-light': '#FFF203',
          'yellow-dark': '#FFB800',
          // Supporting colors
          blue: '#0066FF',
          'blue-dark': '#004499',
          'blue-gradient-start': '#0052CC',
          'blue-gradient-end': '#00CCCC',
          black: '#0F0F16',
          white: '#FFFFFF',
          gray: {
            50: '#F8F9FA',
            100: '#F1F3F5',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#2C2D30',
            900: '#111827',
          }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Barlow', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0052CC 0%, #00CCCC 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0066FF 0%, #00CCCC 50%, #00FF99 100%)',
      }
    },
  },
  plugins: [],
}