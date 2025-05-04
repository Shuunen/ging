import { expect, it } from 'vitest'
import { colorToGradient } from '../src/utils/colors.utils'

it('colorToGradient A', () => {
  expect(colorToGradient('red')).toStrictEqual('bg-linear-to-br from-red-700 to-red-900')
})

it('colorToGradient B', () => {
  expect(colorToGradient('red', 500)).toStrictEqual('bg-linear-to-br from-red-500 to-red-900')
})

it('colorToGradient C', () => {
  expect(colorToGradient('red', 500, 'blue')).toStrictEqual('bg-linear-to-br from-red-500 to-blue-900')
})

it('colorToGradient D', () => {
  expect(colorToGradient('red', 500, 'blue', 300)).toStrictEqual('bg-linear-to-br from-red-500 to-blue-300')
})
