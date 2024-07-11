
import { execSync } from 'child_process'
// eslint-disable-next-line import/no-extraneous-dependencies
import { bench, describe } from 'vitest'

describe('tasks', () => {
  bench('tsc', () => { execSync('pnpm lint:tsc') }, { warmupIterations: 1, iterations: 5 })     // 5 x  2s = 10 seconds in average
  bench('vue-tsc', () => { execSync('pnpm lint:vue') }, { warmupIterations: 1, iterations: 4 }) // 4 x  3s = 12 seconds in average
  bench('eslint', () => { execSync('npx eslint src') }, { warmupIterations: 0, iterations: 3 }) // 3 x 10s = 30 seconds in average
  bench('build', () => { execSync('npx vite build') }, { warmupIterations: 1, iterations: 4 })  // 4 x  3s = 12 seconds in average
  bench('test', () => { execSync('npx vitest --run') }, { warmupIterations: 1, iterations: 5 }) // 5 x  2s = 10 seconds in average
})


