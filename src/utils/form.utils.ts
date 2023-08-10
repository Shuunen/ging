export const requiredRules = [
  // eslint-disable-next-line putout/putout
  (value: string): string | true => Boolean(value) || 'Please fill out this field',
]
