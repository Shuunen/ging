/* c8 ignore next */
import { Step } from '@/models'

const msInSecond = 1000
const secondsInMinute = 60
const minutesInHour = 60
const hoursInDay = 24
const daysInMonth = 30
const daysInWeek = 7
const monthsInYear = 12

export const units = ['month', 'week', 'day', 'hour', 'minute'] as const

export function stepToString (step: Step) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const unit = units.find(unitItem => Boolean(step[(`${unitItem}s`) as keyof Step]))
  if (!unit) return step.title
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const value = step[(`${unit}s`) as keyof Step] as number
  const time = `${value} ${unit}${value > 1 ? 's' : ''}`
  return `${step.title}, ${time}`
}

// eslint-disable-next-line prefer-named-capture-group, regexp/prefer-named-capture-group, regexp/no-super-linear-move
export const durationRegex = /(\d+)\s?([a-z]+)/u

export function stringToStepDuration (input: string) {
  const [, duration, unitInput] = durationRegex.exec(input) ?? []
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!duration || !unitInput) throw new Error(`Invalid duration string : ${input}`)
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const unitSingular = unitInput.endsWith('s') ? unitInput.slice(0, -1) : unitInput
  const unit = units.find(item => item.startsWith(unitSingular)) ?? ''
  if (unit === '') throw new Error(`Invalid step unit : ${unitInput}`)
  const value = Number.parseInt(duration, 10)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return { [`${unit}s` as keyof Step]: value }
}

// eslint-disable-next-line prefer-named-capture-group, regexp/prefer-named-capture-group, regexp/no-super-linear-move, regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
export const titleWithDurationRegex = /([^,]*)[\s,]+(\d+\s?[a-z]+)/u

export function stringToStepData (input: string) {
  const [, title, duration] = titleWithDurationRegex.exec(input) ?? []
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!title || !duration) throw new Error(`Invalid title with duration string ${input}`)
  const step: Partial<Step> = { title: title.trim() }
  Object.assign(step, stringToStepDuration(duration))
  return step
}

export function stepToHumanDuration (step: Step) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const unit = units.find(key => Boolean(step[(`${key}s`) as keyof Step]))
  if (!unit) return ''
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const value = step[(`${unit}s`) as keyof Step] as number
  return `${value} ${unit}${value > 1 ? 's' : ''}`
}

export function processStepsDurations (steps: Step[]) {
  const date = new Date(steps[0]?.start ?? new Date())
  return steps.map((input) => {
    const step = new Step(input)
    step.start = new Date(date)
    if (step.months !== undefined) date.setDate(date.getDate() + step.months * daysInMonth)
    if (step.weeks !== undefined) date.setDate(date.getDate() + step.weeks * daysInWeek)
    if (step.days !== undefined) date.setDate(date.getDate() + step.days)
    if (step.hours !== undefined) date.setHours(date.getHours() + step.hours)
    if (step.minutes !== undefined) date.setMinutes(date.getMinutes() + step.minutes)
    step.end = new Date(date)
    step.duration = stepToHumanDuration(step)
    return step
  })
}

// eslint-disable-next-line max-statements, complexity, sonarjs/cognitive-complexity
export function durationBetweenDates (start: Date, end: Date): string {
  const ms = end.getTime() - start.getTime()
  const seconds = Math.floor(ms / msInSecond)
  const minutes = Math.floor(seconds / secondsInMinute)
  const hours = Math.floor(minutes / minutesInHour)
  const days = Math.floor(hours / hoursInDay)
  const months = Math.floor(days / daysInMonth)
  const years = Math.floor(months / monthsInYear)
  if (years) return `${years} year${years > 1 ? 's' : ''}`
  if (months) return `${months} month${months > 1 ? 's' : ''}`
  if (days) return `${days} day${days > 1 ? 's' : ''}`
  if (hours) return `${hours} hour${hours > 1 ? 's' : ''}`
  if (minutes) return `${minutes} minute${minutes > 1 ? 's' : ''}`
  return `${seconds} second${seconds > 1 ? 's' : ''}`
}

