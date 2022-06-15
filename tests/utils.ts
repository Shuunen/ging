import { test } from 'uvu'
import { equal } from 'uvu/assert'

export const check = <T> (title: string, actual: T, expected?: T) => {
  return test(title, () => equal(actual, expected))
}

check.done = test.run
