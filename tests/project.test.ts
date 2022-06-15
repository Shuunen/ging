import { Project } from '@/types'
import { check } from './utils'

check('project default', new Project().id >= Date.now(), true)

check.done()
