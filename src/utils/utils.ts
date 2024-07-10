/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { expect, it } from 'vitest'

/**
 * Check if the actual value is equal to the expected value
 * @param title the title of the test
 * @param actual the actual value
 * @param expected the expected value
 * @returns nothing
 */
export function check<Type> (title: string, actual: Promise<Type> | Type, expected?: Promise<Type> | Type) {
  if (actual instanceof Promise) return it(title, async () => {
    /* c8 ignore next */
    if (expected instanceof Promise) return expect(await actual).toStrictEqual(await expected)
    return expect(await actual).toStrictEqual(expected)
  })
  return it(title, () => expect(actual).toStrictEqual(expected))
}
