/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { requiredRules } from '../src/utils/form.utils'
import { check } from './utils'

check('required form rule ok', requiredRules[0]!('im ok'), true)
check('required form rule nok', requiredRules[0]!(''), 'Please fill out this field')
