/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    {
      pattern: /(?:bg|from|text|to)-\w+-(?:700|900)/u,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
