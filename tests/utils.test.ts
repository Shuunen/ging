import { requiredRules } from '@/utils/form-rules'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

test('required form rule', () => {
  equal(requiredRules[0]('im ok'), true)
  equal(requiredRules[0](''), 'Please fill out this field')
})

test.run()
