/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AIRA Brand Colors
        'aira-white': '#FFFFFF',
        'aira-gray': '#F5F6F8',
        'aira-grid': '#F2F3F4',
        'aira-blue': '#4B9EFF',
        'aira-violet': '#9A7AFF',
        'aira-coral': '#FF5A64',
        'aira-cyan': '#42F0F5',
        'aira-yellow': '#F8D66E',
        'aira-purple': '#9B5CFF',
        'aira-accent-blue': '#6E83F7',
        'aira-text-primary': '#333333',
        'aira-text-secondary': '#888888',
        'aira-text-light': '#4D4D4D',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
