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
          // Modern green accent palette - inspired by wio.io
          green: '#00E676',
          'green-light': '#69F0AE',
          'green-dark': '#00C853',
          'green-50': '#E8F5E9',
          'green-100': '#C8E6C9',
          'green-900': '#1B5E20',
          // Accent colors
          yellow: '#FFEB3B',
          'yellow-light': '#FFF176',
          'yellow-dark': '#FBC02D',
          // Supporting colors - cleaner palette
          blue: '#2196F3',
          'blue-dark': '#1565C0',
          'blue-light': '#42A5F5',
          black: '#0A0A0A',
          white: '#FFFFFF',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
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