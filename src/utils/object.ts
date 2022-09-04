import { stringSum } from 'shuutils'

export const objectSum = (object: Record<string, unknown>): string => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.keys(object).reduce((accumulator, key) => {
    const value = object[key]
    if (typeof value === 'object') return stringSum(accumulator + key) + objectSum(value as Record<string, unknown>)
    return stringSum(accumulator + key + value).toString()
  }, '')
}
