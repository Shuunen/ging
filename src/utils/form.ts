export const requiredRules = [
  (v: string): true | string => !!v || 'Please fill out this field',
]
