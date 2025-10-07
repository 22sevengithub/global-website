/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Marketing Website Colors (vault-*)
        vault: {
          // Brand colors from Vault22
          green: '#73dd73',
          'green-light': '#4ADE80',
          'green-dark': '#059669',
          // From live site: Yellow accent
          yellow: '#FFCB05',
          'yellow-light': '#FFF203',
          'yellow-dark': '#FFB800',
          // Supporting colors
          blue: '#26b1c9',
          'blue-dark': '#004499',
          'blue-gradient-start': '#0052CC',
          'blue-gradient-end': '#00CCCC',
          pink: '#e84eb8',
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
        },
        // Mobile App Colors (thanos, bulbasaur, sonic, etc.)
        thanos: {
          50: '#f1f2f3',
          100: '#d5d3df',
          200: '#aba8bf',
          300: '#88879b',
          400: '#75728e',
          500: '#4e4c6a',
          600: '#474560',
          700: '#37364b',
          800: '#2b2a3a',
          900: '#21202d',
          950: '#16151f',
        },
        bulbasaur: {
          100: '#d4f4f1',
          200: '#a8e9e3',
          400: '#52d1c6',
          500: '#27c5b8',
          600: '#23b3a7',
          700: '#1c8c83',
          800: '#156c65',
          900: '#10534d',
        },
        sonic: {
          100: '#d4e7fc',
          200: '#a9cff9',
          400: '#599ef7',
          500: '#0069f1',
          600: '#045fd7',
          800: '#09489a',
          900: '#042e67',
        },
        yellow: '#fff203',
        pikachu: {
          100: '#fff9e5',
          200: '#fff3cc',
          400: '#ffdf71',
          500: '#ffd74e',
          600: '#f5c91e',
          700: '#ddb200',
        },
        peach: {
          400: '#fd9596',
          500: '#fd7a7c',
          600: '#f75e61',
          700: '#db3041',
          900: '#6b1820',
        },
        kermit: {
          400: '#a1e97e',
          500: '#89e35e',
          600: '#6bc944',
          700: '#55b12b',
        },
        garfield: {
          100: '#fff0e5',
          200: '#ffe1cc',
          400: '#fda86f',
          500: '#fd924b',
          600: '#ea7a2e',
          700: '#c25e15',
          900: '#5a2b08',
        },
        dumbledore: {
          500: '#9b59b6',
          600: '#8e44ad',
        },
        megaman: {
          500: '#3498db',
          600: '#2980b9',
        },
        // Vault-prefixed aliases for consistency
        'vault-dumbledore': {
          500: '#9b59b6',
          600: '#8e44ad',
        },
        'vault-megaman': {
          500: '#3498db',
          600: '#2980b9',
        },
        'vault-spongebob': {
          500: '#fff203',
          600: '#f5e100',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Barlow', 'Inter', 'sans-serif'],
      },
      fontSize: {
        // Mobile App Typography
        'display-lg': ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'display-md': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-xl': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'title-lg': ['20px', { lineHeight: '1.2', fontWeight: '600' }],
        'title-md': ['16px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-sm': ['14px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-sm': ['12px', { lineHeight: '1.3', fontWeight: '500' }],
        'label-lg': ['17px', { lineHeight: '1.2', fontWeight: '600' }],
        'label-md': ['14px', { lineHeight: '1.3', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '1.2', fontWeight: '500' }],
        'number-32': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
        'number-24': ['24px', { lineHeight: '1.1', fontWeight: '600' }],
        'number-20': ['20px', { lineHeight: '1.1', fontWeight: '600' }],
        'number-16': ['16px', { lineHeight: '1.1', fontWeight: '700' }],
      },
      spacing: {
        // Keep Tailwind defaults and add custom values
        '128': '32rem',
        '192': '48rem',
        '256': '64rem',
        '384': '96rem',
        '512': '128rem',
        '640': '160rem',
        '768': '192rem',
      },
      borderRadius: {
        // Mobile App Border Radius
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'primary': '16px',
        'full': '9999px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0052CC 0%, #00CCCC 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0066FF 0%, #00CCCC 50%, #00FF99 100%)',
      },
      animation: {
        // Page transitions
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        // Element animations
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        // Stagger animations for lists
        'stagger-1': 'fadeInUp 0.4s ease-out 0.1s both',
        'stagger-2': 'fadeInUp 0.4s ease-out 0.2s both',
        'stagger-3': 'fadeInUp 0.4s ease-out 0.3s both',
        'stagger-4': 'fadeInUp 0.4s ease-out 0.4s both',
        'stagger-5': 'fadeInUp 0.4s ease-out 0.5s both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
