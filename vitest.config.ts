import { defineConfig } from 'vitest/config'

 
export default defineConfig({
  test: {
    alias: {
      '@': 'src',
    },
    coverage: {
      100: true,
      reporter: ['text', 'lcov', 'html'],
      exclude: ['tests'],
    },
  },
})
