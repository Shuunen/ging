import { bar } from '@/utils/foo'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

test('bar works', () => {
  equal(bar(4, 3), 7)
})

test.run()
