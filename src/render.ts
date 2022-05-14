import { dateIso10, div, em, h2 } from 'shuutils'


const renderStep = (step: Step): HTMLElement => {
  const el = div('step flex flex-col gap-2 px-6 py-2 text-center bg-current')
  const date = step.days ? dateIso10(step.start) : step.start?.toLocaleTimeString().replace(/\:\d\d$/, '')
  el.append(em('date-start opacity-30 text-xs text-white', date))
  el.append(div('title text-white', step.title))
  const subtitle = step.days ? `${step.days} day${step.days === 1 ? '' : 's'}` : `${step.hours} hour${step.hours === 1 ? '' : 's'}`
  el.append(em('duration opacity-30 text-xs text-white', subtitle))
  return el
}

const renderSteps = (steps: Step[]): HTMLElement => {
  const el = div('steps flex')
  steps.forEach((step, index) => {
    const s = renderStep(step)
    if (index === 0) s.classList.add('rounded-l-xl')
    if (index === steps.length - 1) s.classList.add('rounded-r-xl')
    else s.classList.add('mr-1')
    el.append(s)
  })
  return el
}

const fillData = (group: Group): Group => {
  let date = group.steps[0]?.start ?? new Date()
  console.log('detected date :', date)
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
  const el = div(`group text-${group.color ?? 'indigo'}-700`)
  el.append(h2('text-3xl mb-4', group.title))
  el.append(renderSteps(fillData(group).steps))
  return el
}

export const render = (el: HTMLElement | null, data?: Data) => {
  if (!el) return console.error('no element to render')
  el.innerHTML = ''
  if (!data) return console.error('no data to render')
  for (let group of data.groups) el.append(renderGroup(group))
}
