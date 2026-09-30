import { defineConfig } from 'vitest/config'

// oxlint-disable-next-line import/no-default-export
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
    globals: true,
    pool: 'threads',
  },
})
