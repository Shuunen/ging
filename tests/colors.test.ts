import { colorToGradient } from '../src/utils/colors.utils'

describe('colorToGradient', () => {
  test('uses default shades with a single color', () => {
    expect(colorToGradient('red')).toBe('bg-linear-to-br from-red-700 to-red-900')
  })

  test('uses a custom start shade', () => {
    expect(colorToGradient('red', { from: 500 })).toBe('bg-linear-to-br from-red-500 to-red-900')
  })

  test('uses a custom end color', () => {
    expect(colorToGradient('red', { colorB: 'blue', from: 500 })).toBe('bg-linear-to-br from-red-500 to-blue-900')
  })

  test('uses a custom end shade', () => {
    expect(colorToGradient('red', { colorB: 'blue', from: 500, to: 300 })).toBe('bg-linear-to-br from-red-500 to-blue-300')
  })
})
