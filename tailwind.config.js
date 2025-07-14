/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  theme: {
    screens: {
      'sm': { 'max' : '640px' },
    },
    extend: {},
  },
  plugins: [],
}

