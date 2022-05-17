import { dateIso10, div, em, h2 } from 'shuutils'

const renderDivider = (index: number): HTMLElement => {
  const divider = div('divider opacity-20 hover:opacity-100 hover:w-auto hover:text-4xl w-1 h-12 text-center transition-all duration-200 bg-white rounded-md cursor-pointer')
  divider.textContent = '+'
  divider.dataset['index'] = index.toString()
  return divider
}

const renderStep = (step: Step): HTMLElement => {
  const element = div('step flex flex-col gap-2 px-4 text-center')
  const date = step.days ? dateIso10(step.start) : step.start?.toLocaleTimeString().replace(/:\d\d$/, '')
  element.append(em('date-start opacity-30 text-xs text-white', date))
  element.append(div('title text-white', step.title))
  const subtitle = step.days ? `${step.days} day${step.days === 1 ? '' : 's'}` : `${step.hours} hour${step.hours === 1 ? '' : 's'}`
  element.append(em('duration opacity-30 text-xs text-white', subtitle))
  return element
}

const renderSteps = (steps: Step[], color: string): HTMLElement => {
  const element = div(`steps rounded-xl bg-gradient-to-br from-${color}-700 to-${color}-900 flex flex-row items-center float-left p-2 overflow-hidden`)
  element.append(renderDivider(0))
  steps.forEach((step, index) => element.append(renderStep(step), renderDivider(index + 1)))
  return element
}

const fillData = (group: Group): Group => {
  const date = group.steps[0]?.start ?? new Date()
  group.steps.forEach((step) => {
    step.start = new Date(date)
    if (!step.days && !step.hours) step.days = 1
    if (step.days) date.setDate(date.getDate() + step.days)
    if (step.hours) date.setHours(date.getHours() + step.hours)
    step.end = date
  })
  console.log(group.steps)
  return group
}

const renderGroup = (group: Group): HTMLElement => {
  const { title, steps, color = 'indigo' } = fillData(group)
  const element = div(`group text-${color}-700`)
  element.append(h2('text-3xl mb-4', title))
  element.append(renderSteps(steps, color))
  return element
}

export const render = (element: HTMLElement | null, data?: Data) => {
  if (!element) return console.error('no element to render')
  element.innerHTML = ''
  if (!data) return console.error('no data to render')
  for (const group of data.groups) element.append(renderGroup(group))
}
