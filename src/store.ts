/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { emit, objectSum, sleep, storage } from 'shuutils'
import { computed, reactive } from 'vue'
import type { Project } from './models/project.model'
import type { Step } from './models/step.model'
import { debouncedScrollToElement, focusInput, unfocusActiveElement } from './utils/dom.utils'
import { debouncedPersist, getId, read, type GistState } from './utils/gist.utils'
import { stringToStepData, stringToStepDuration } from './utils/step.utils'

storage.prefix = 'ging_'

// A TESTER
// export function useStore () {
//   return {
//     activeProject,
//     activeStep,
//     actions,
//     ...store,
//   }
// }

export const store = reactive({
  activeProjectIndex: 0,
  activeStepIndex: 0,
  addProjectModalOpened: false,
  addStepModalOpened: false,
  debugMode: false,
  deleteProjectModalOpened: false,
  deleteStepModalOpened: false,
  editMode: false,
  gistId: storage.get('gistId', ''),
  gistToken: storage.get('gistToken', ''),
  gistState: storage.get<GistState>('gistState', { isGistState: false, projects: [] }),
  gistStateLastSum: storage.get('gistStateLastSum', -1), // eslint-disable-line @typescript-eslint/no-magic-numbers
  isLoading: false,
  projects: [] as Project[], // eslint-disable-line @typescript-eslint/consistent-type-assertions
})

export type Store = typeof store

export type StoreKey = keyof Store

export const activeStep = computed(() => store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex])

export const activeProject = computed(() => store.projects[store.activeProjectIndex])

export const nbSteps = computed(() => store.projects[store.activeProjectIndex]?.steps.length ?? 0)

export const actions = {
  addProject (project: Project) {
    store.projects.push(project)
    void actions.updateGistState('addProject')
  },
  deleteActiveStep () {
    if (!store.projects[store.activeProjectIndex]) { console.error('cannot delete step: no active project'); return }
    store.projects[store.activeProjectIndex]?.steps.splice(store.activeStepIndex, 1)
    actions.preventStepIndexOverflow()
    actions.scrollToStep()
    void actions.updateGistState('deleteActiveStep')
  },
  deleteActiveProject () {
    store.projects.splice(store.activeProjectIndex, 1)
    void actions.updateGistState('deleteActiveProject')
  },
  deleteProject (projectId: number) {
    const index = store.projects.findIndex(project => project.id === projectId)
    store.projects.splice(index, 1)
    void actions.updateGistState('deleteProject')
  },
  addStep (step: Step) {
    const project = store.projects[store.activeProjectIndex]
    if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
    if (store.activeStepIndex === project.steps.length - 1) project.steps.push(step)
    else project.steps.splice(store.activeStepIndex + 1, 0, step)
    const timeBeforeSelect = 100
    // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
    void sleep(timeBeforeSelect).then(() => { actions.selectNextStep() })
    void actions.updateGistState('addStep')
  },
  preventStepIndexOverflow () {
    if (!store.projects[store.activeProjectIndex]) return
    const maxStepIndex = nbSteps.value - 1
    if (store.activeStepIndex > maxStepIndex) store.activeStepIndex = maxStepIndex
    const minStepIndex = 0
    if (store.activeStepIndex < minStepIndex) store.activeStepIndex = minStepIndex
  },
  selectPrevProject () {
    store.activeProjectIndex = (store.activeProjectIndex - 1 < 0) ? (store.projects.length - 1) : store.activeProjectIndex - 1
    actions.preventStepIndexOverflow()
    actions.scrollToStep()
  },
  selectNextProject () {
    store.activeProjectIndex = (store.projects.length <= store.activeProjectIndex + 1) ? 0 : store.activeProjectIndex + 1
    actions.preventStepIndexOverflow()
    actions.scrollToProject()
  },
  selectPrevStep () {
    if (!store.projects[store.activeProjectIndex]) return
    store.activeStepIndex = (store.activeStepIndex - 1 < 0) ? (nbSteps.value - 1) : store.activeStepIndex - 1
    actions.scrollToProject()
  },
  selectNextStep () {
    if (!store.projects[store.activeProjectIndex]) return
    store.activeStepIndex = (nbSteps.value <= store.activeStepIndex + 1) ? 0 : store.activeStepIndex + 1
    actions.scrollToStep()
  },
  scrollToProject () {
    if (!activeProject.value) { console.log('Cannot scroll to project without an active project'); return }
    const projectElement = document.querySelector('.app-active')
    if (!projectElement) { console.log('Cannot scroll to project without an dom element'); return }
    void debouncedScrollToElement(projectElement)
  },
  scrollToStep () {
    if (!activeStep.value) { console.log('Cannot scroll to step without an active step'); return }
    const stepElement = document.querySelector(`#step-${activeStep.value.id}`)
    if (!stepElement) { console.log('Cannot scroll to step without an dom element'); return }
    void debouncedScrollToElement(stepElement)
  },
  selectProject (projectId: number) {
    store.activeProjectIndex = store.projects.findIndex(project => project.id === projectId)
  },
  selectStep (stepId: number) {
    if (!store.projects[store.activeProjectIndex]) { console.log('Cannot select step without an active project'); return }
    store.activeStepIndex = store.projects[store.activeProjectIndex]?.steps.findIndex(step => step.id === stepId) ?? 0
  },
  // eslint-disable-next-line max-statements
  patchCurrentStepTitle (title: string) {
    if (title === '') { console.warn('Title cannot be empty'); return }
    const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
    if (!step) { console.warn('Cannot patch step title without an active step'); return }
    try {
      const data = stringToStepData(title)
      // if data contains title & one duration, clear the step duration
      if (Object.keys(data).length > 1) actions.clearStepDurations(step)
      console.log('updating step with data', data)
      Object.assign(step, data)
      console.log('step got new title & duration', step)
    } catch {
      step.title = title
      console.log('step got new title', step)
    }
    // let the edit toggle trigger => void actions.updateGistState('patchCurrentStepTitle')
  },
  patchCurrentStepDuration (duration: string) {
    const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
    if (!step) { console.warn('Cannot patch step duration without an active step'); return }
    try {
      const data = stringToStepDuration(duration)
      // if data contains one duration, clear the step duration
      if (Object.keys(data).length > 0) actions.clearStepDurations(step)
      console.log('updating step with data', data)
      Object.assign(step, data)
      // let the edit toggle trigger => void actions.updateGistState('patchCurrentStepDuration')
    } catch (error) {
      if (error instanceof Error) console.error(error.message)
    }
  },
  patchCurrentStepStart (date: Date) {
    const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
    if (!step) { console.warn('Cannot patch step date without an active step'); return }
    step.start = date
    // let the edit toggle trigger => void actions.updateGistState('patchCurrentStepStart')
  },
  patchCurrentProjectTitle (title: string) {
    if (title === '') { console.warn('Title cannot be empty'); return }
    const project = store.projects[store.activeProjectIndex]
    if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
    project.title = title
    // let the edit toggle trigger => void actions.updateGistState('patchCurrentProjectTitle')
  },
  toggleDateDisplay () {
    const project = store.projects[store.activeProjectIndex]
    if (!project) { console.warn('Cannot toggle date display without an active project'); return }
    const before = project.isDateDisplayed ?? true
    console.log('toggling date display, was', before, 'now', !before)
    project.isDateDisplayed = !before
    void actions.updateGistState('toggleDateDisplay')
  },
  toggleTimeDisplay () {
    const project = store.projects[store.activeProjectIndex]
    if (!project) { console.warn('Cannot toggle time display without an active project'); return }
    const before = project.isTimeDisplayed ?? true
    console.log('toggling time display, was', before, 'now', !before)
    project.isTimeDisplayed = !before
    void actions.updateGistState('toggleTimeDisplay')
  },
  clearStepDurations (step: Step) {
    /* eslint-disable no-param-reassign */
    delete step.months
    delete step.weeks
    delete step.days
    delete step.hours
    delete step.minutes
    /* eslint-enable no-param-reassign */
  },
  enterEditMode () {
    console.log('entering edit mode')
    const selector = store.activeStepIndex === 0 ? `input#project-title-${store.projects[store.activeProjectIndex]?.id ?? 'UNKNOWN'}` : `input#step-title-${activeStep.value?.id ?? 'UNKNOWN'}`
    focusInput(selector)
  },
  exitEditMode () {
    console.log('exiting edit mode')
    unfocusActiveElement()
    void actions.updateGistState('exitEditMode')
  },
  toggleEditMode () {
    store.editMode = !store.editMode
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    store.editMode ? actions.enterEditMode() : actions.exitEditMode()
  },
  toggleDebugMode () {
    store.debugMode = !store.debugMode
    console.log('debug mode is now', store.debugMode)
  },
  // eslint-disable-next-line max-statements
  moveStep (direction: 'after' | 'before' | 'UNKNOWN') {
    const project = store.projects[store.activeProjectIndex]
    if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
    const step = project.steps[store.activeStepIndex]
    if (!step) throw new Error(`Step at index ${store.activeStepIndex} not found`)
    const index = project.steps.indexOf(step)
    if (direction === 'before') {
      if (index === 0) return
      project.steps.splice(index, 1)
      project.steps.splice(index - 1, 0, step)
      store.activeStepIndex -= 1
    } else if (direction === 'after') {
      if (index === project.steps.length - 1) return
      project.steps.splice(index, 1)
      project.steps.splice(index + 1, 0, step)
      store.activeStepIndex += 1
    } else throw new Error(`Invalid direction : ${direction}`)
    void actions.updateGistState('moveStep')
  },
  openAddProjectModal () {
    store.addProjectModalOpened = true
  },
  openAddStepModal () {
    store.addStepModalOpened = true
  },
  openDeleteStepModal () {
    store.deleteStepModalOpened = true
  },
  openDeleteProjectModal () {
    store.deleteProjectModalOpened = true
  },
  // eslint-disable-next-line max-statements
  async setGistToken (token: string) {
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (token === '') {
      console.log('clearing gist token')
      actions.setGistId('')
      store.gistToken = ''
      return
    }
    console.log('setting gist token to', token)
    store.gistToken = token
    storage.set('gistToken', token)
    store.isLoading = true
    if (store.gistId === '') await actions.getGistId()
    await actions.fetchGist()
    store.isLoading = false
  },
  async getGistId () {
    const { success, message, data: id } = await getId(store.gistId, store.gistState, store.gistToken)
    if (!success || id === undefined) { console.error(message); return }
    console.log('got gist id', id)
    actions.setGistId(id)
  },
  // eslint-disable-next-line max-statements
  async fetchGist () {
    if (!store.gistId) { console.log('Cannot fetch gist without an id'); return }
    if (!store.gistToken) { console.log('Cannot fetch gist without a token'); return }
    console.log('fetching gist', store.gistId)
    const { success, message, data } = await read(store.gistId, store.gistToken)
    if (!success || !data) { actions.emitToast(message); return }
    console.log('fetched gist content :', data)
    const same = JSON.stringify(data.projects) === JSON.stringify(store.projects)
    if (same) { console.log('no changes detected'); return }
    if (data.projects.length > 0) store.projects = data.projects
  },
  setGistId (id: string) {
    if (store.gistId === id) return
    if (id === '') console.log('clearing gist id')
    else {
      console.log('setting gist id', id)
      storage.set('gistId', id)
    }
    store.gistId = id
  },
  setGistState (state: GistState) {
    store.gistState = state
    storage.set('gistState', state)
  },
  setGistStateLastSum (sum: number) {
    store.gistStateLastSum = sum
    storage.set('gistStateLastSum', sum)
  },
  // eslint-disable-next-line max-statements
  async updateGistState (reason: string) {
    console.log('updating gist state, cause :', reason, store.projects)
    actions.setGistState({ projects: store.projects, isGistState: true })
    const gistStateSum = objectSum(store.gistState)
    if (gistStateSum === store.gistStateLastSum) { console.log('prevent update : no changes detected'); return }
    console.log('gist state sum changed :', { sumA: store.gistStateLastSum, sumB: gistStateSum })
    actions.setGistStateLastSum(gistStateSum)
    if (!store.gistToken) { console.log('cannot persist without a gist token'); return }
    store.isLoading = true
    const { success, message, data } = await debouncedPersist('updateGistState', store.gistId, store.gistState, store.gistToken)
    console.log('persisted', { success, message, data })
    if (data !== undefined) actions.setGistId(String(data))
    store.isLoading = false
    if (!message) return
    if (!success) actions.emitToast(message)
    console.log(message)
  },
  emitToast (message: string) {
    emit('toast', message)
  },
}
