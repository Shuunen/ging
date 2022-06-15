import { requiredRules } from '@/utils/form-rules'
import { check } from './utils'

check('required form rule ok', requiredRules[0]('im ok'), true)
check('required form rule nok', requiredRules[0](''), 'Please fill out this field')

check.done()
