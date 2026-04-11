/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F8F6F2',
        primary: '#0B1F3A',
        secondary: '#B88A2E',
        accent: '#E6D7B8',
        ink: '#111827',
        muted: '#6B7280',
        soft: '#F3EFE7',
        'card-bg': '#FFFFFF',
        'border-color': '#E5E7EB',
        'bg-light': '#F3F4F6',
      },
      boxShadow: {
        soft: '0 24px 70px rgba(11, 31, 58, 0.12)',
        lift: '0 18px 36px rgba(11, 31, 58, 0.16)',
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
