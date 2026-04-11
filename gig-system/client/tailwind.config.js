/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F9FAFB',
        primary: '#1E3A8A',
        secondary: '#6D28D9',
        accent: '#3B82F6',
        ink: '#111827',
        muted: '#6B7280',
        soft: '#EEF2FF',
        'card-bg': '#FFFFFF',
        'border-color': '#E5E7EB',
        'bg-light': '#F3F4F6',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.12)',
        lift: '0 14px 30px rgba(15, 23, 42, 0.12)',
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
