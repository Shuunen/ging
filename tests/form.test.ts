import { requiredRules } from '../src/utils/form.utils'

describe('form utils', () => {
  const [requiredRule] = requiredRules

  test('required rule accepts a filled value', () => {
    expect(requiredRule?.('im ok')).toBe(true)
  })

  test('required rule rejects an empty value', () => {
    expect(requiredRule?.('')).toBe('Please fill out this field')
  })
})
