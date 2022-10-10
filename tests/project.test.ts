import { Project } from '@/models'
import { check, checksRun, daysAgo, getTimestampMs } from 'shuutils'

const defaults = new Project()
check('project default id', defaults.id >= getTimestampMs(daysAgo(1)), true)
check('project default title is empty', defaults.title, '')
check('project default color is undefined', defaults.color)
check('project default has no steps', defaults.steps, [])

checksRun()
