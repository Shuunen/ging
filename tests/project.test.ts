import { Project } from '../src/models/project.model'
import { daysAgo, getTimestampMs } from 'shuutils'
import { check } from './utils'

const defaults = new Project()
check('project default id', defaults.id >= getTimestampMs(daysAgo(1)), true)
check('project default title is empty', defaults.title, '')
check('project default color is undefined', defaults.color)
check('project default has no steps', defaults.steps, [])
