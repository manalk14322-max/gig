/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F6F8FB',
        primary: '#0F766E',
        secondary: '#2563EB',
        accent: '#F59E0B',
        ink: '#102033',
        muted: '#64748B',
        soft: '#E6F4F1',
        'card-bg': '#FFFFFF',
        'border-color': '#D8E2EA',
        'bg-light': '#F3F7FA',
      },
      boxShadow: {
        soft: '0 18px 48px rgba(16, 32, 51, 0.08)',
        lift: '0 24px 70px rgba(16, 32, 51, 0.14)',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [forms, typography],
};
