import { Project } from '@/models'
import { check } from 'shuutils'

check('project default', new Project().id >= Date.now(), true)

check.run()
