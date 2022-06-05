import { dateIso10, div, dom, em, emit, h2 } from 'shuutils'

const formValues = (form: HTMLFormElement) => {
  const values: Record<string, FormDataEntryValue> = {}
  const formData = new FormData(form)
  for (const key of formData.keys()) {
    const value = formData.get(key)
    if (value) values[key] = value
  }
  return values
}

const addStep = (event: Event, form: HTMLFormElement, index:number) => {
  event.preventDefault()
  const data = { step: formValues(form), index }
  emit('add-step', data)
  return false
}

const expandDivider = (divider: HTMLElement) => {
  const classes = divider.className
  if (classes.includes('expanded')) return
  divider.className = 'divider expanded shrink-0 flex flex-row w-48 h-20 gap-2 p-2 transition-all duration-200 bg-white rounded-md'
  divider.innerHTML = ''
  const form = dom('form', 'flex flex-col justify-center gap-2', '<input class="bg-slate-200 w-full p-1" name=start type=date /><input class="bg-slate-200 w-full p-1" name=title type=text />')
  const add = dom('button', 'add hover:opacity-100 hover:text-xl text-lg transition-all opacity-50', '✔️')
  const cancel = dom('button', 'cancel hover:opacity-100 hover:text-2xl text-xl transition-all rotate-45 opacity-50', '➕')
  const buttons = div('buttons flex flex-col justify-center gap-2')
  const index = Number.parseInt(divider.dataset['index'] as string)
  buttons.append(add, cancel)
  divider.append(form, buttons)
  add.scrollIntoView()
  form.addEventListener('submit', (event) => addStep(event, form, index))
  add.addEventListener('click', (event) => addStep(event, form, index))
  cancel.addEventListener('click', (event) => {
    event.stopPropagation()
    divider.className = classes
    divider.innerHTML = '➕'
  })
}

const renderDivider = (index: number, step?: Step): HTMLElement => {
  const divider = div('divider opacity-20 hover:opacity-100 hover:w-auto hover:text-xl hover:text-inherit flex flex-col justify-center w-1 h-12 overflow-hidden text-center text-transparent transition-all duration-200 bg-white rounded-md cursor-pointer')
  divider.textContent = '➕'
  divider.dataset['index'] = index.toString()
  if (step && step.start) divider.dataset['start'] = Math.round(step.start.getTime() / 1000).toString()
  divider.addEventListener('click', () => expandDivider(divider))
  return divider
}

const renderStep = (step: Step): HTMLElement => {
  const element = div('step flex flex-col gap-2 px-4 text-center')
  const date = step.days ? dateIso10(step.start) : step.start?.toLocaleTimeString().replace(/:\d\d$/, '')
  const dateElement = em('date-start whitespace-nowrap text-ellipsis opacity-30 text-xs text-white', date)
  dateElement.title = step.start?.toLocaleString() ?? ''
  element.append(dateElement)
  element.append(div('title whitespace-nowrap text-ellipsis text-white', step.title))
  const subtitle = step.days ? `${step.days} day${step.days === 1 ? '' : 's'}` : `${step.hours} hour${step.hours === 1 ? '' : 's'}`
  element.append(em('duration opacity-30 text-xs text-white', subtitle))
  return element
}

const renderSteps = (steps: Step[], color: string): HTMLElement => {
  const element = div(`steps rounded-xl bg-gradient-to-br from-${color}-700 to-${color}-900 flex flex-row items-center float-left max-w-full p-2 overflow-hidden overflow-x-auto`)
  element.append(renderDivider(0))
  steps.forEach((step, index) => element.append(renderStep(step), renderDivider(index + 1, step)))
  return element
}

const fillData = (group: Group): Group => {
  const date = new Date(group.steps[0]?.start ?? new Date())
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
  const element = div(`group text-${color}-700 max-w-full`)
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
