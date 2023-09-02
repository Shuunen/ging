export const requiredRules = [
  (value: string): string | true => Boolean(value) || 'Please fill out this field',
]
