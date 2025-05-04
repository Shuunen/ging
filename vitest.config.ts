import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/utils/dom.utils.ts'],
      include: ['src/utils', 'src/models'],
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        100: true,
      },
    },
    pool: 'threads',
  },
})
