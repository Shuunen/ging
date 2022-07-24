/* c8 ignore next */
import { Step } from '@/models'

export const units = ['month', 'week', 'day', 'hour', 'minute']

export const stepToString = (step: Step): string | undefined => {
  const unit = units.find(unit => Boolean(step[(unit + 's') as keyof Step]))
  const value = step[(unit + 's') as keyof Step] as number
  if (!value) return step.title
  const time = `${value} ${unit}${value > 1 ? 's' : ''}`
  return step.title + `, ${time}`
}

export const titleWithDurationRegex = /([^,]*)[\s,]+(\d+\s?[a-z]+)/

export const stringToStepData = (input: string): Partial<Step> => {
  if (titleWithDurationRegex.test(input) === false) throw new Error('Invalid title with duration string ' + input)
  const [, title = '', duration = ''] = titleWithDurationRegex.exec(input) ?? []
  const step: Partial<Step> = { title: title.trim() }
  Object.assign(step, stringToStepDuration(duration))
  return step
}

export const durationRegex = /(\d+)\s?([a-z]+)/

export const stringToStepDuration = (input: string): Partial<Step> => {
  if (durationRegex.test(input) === false) throw new Error('Invalid duration string : ' + input)
  const [, duration = '', unitInput = ''] = durationRegex.exec(input) ?? []
  const unitSingular = unitInput.endsWith('s') ? unitInput.slice(0, -1) : unitInput
  const unit = units.find(unit => unit.startsWith(unitSingular)) ?? ''
  if (unit === '') throw new Error('Invalid step unit : ' + unitInput)
  const value = Number.parseInt(duration)
  return { [unit + 's' as keyof Step]: value }
}

export const stepToHumanDuration = (step: Step): string => {
  const unit = units.find(unit => Boolean(step[(unit + 's') as keyof Step]))
  const value = step[(unit + 's') as keyof Step] as number
  if (!value) return ''
  const time = `${value} ${unit}${value > 1 ? 's' : ''}`
  return time
}

export const processStepsDurations = (steps: Step[]): Step[] => {
  const date = new Date(steps[0]?.start ?? new Date())
  return steps.map((input) => {
    const step = new Step(input)
    step.start = new Date(date)
    if (step.months) date.setDate(date.getDate() + step.months * 30)
    if (step.weeks) date.setDate(date.getDate() + step.weeks * 7)
    if (step.days) date.setDate(date.getDate() + step.days)
    if (step.hours) date.setHours(date.getHours() + step.hours)
    if (step.minutes) date.setMinutes(date.getMinutes() + step.minutes)
    step.end = new Date(date)
    step.duration = stepToHumanDuration(step)
    return step
  })
}

export const durationBetweenDates = (start: Date, end: Date): string => {
  const ms = end.getTime() - start.getTime()
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  if (years) return `${years} year${years > 1 ? 's' : ''}`
  if (months) return `${months} month${months > 1 ? 's' : ''}`
  if (days) return `${days} day${days > 1 ? 's' : ''}`
  if (hours) return `${hours} hour${hours > 1 ? 's' : ''}`
  if (minutes) return `${minutes} minute${minutes > 1 ? 's' : ''}`
  return `${seconds} second${seconds > 1 ? 's' : ''}`
}
