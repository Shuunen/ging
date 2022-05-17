module.exports = {
  content: ['public/*.html', 'src/**/*.ts'],
  safelist: [
    {
      pattern: /(bg|from|to|text)-\w+-(700|900)/,
    },
  ],
  theme: {
    extend: {},
  },
}
