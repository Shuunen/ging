/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { emit, nbSecondsInMinute, objectSum, sleep } from 'shuutils'
import { computed, reactive } from 'vue'
import type { Project } from './models/project.model'
import type { Step } from './models/step.model'
import { debouncedScrollToElement, focusInput, unfocusActiveElement } from './utils/dom.utils'
import { type GistState, debouncedPersist, getId, read } from './utils/gist.utils'
import { logger } from './utils/logger.utils'
import { stringToStepData, stringToStepDuration } from './utils/step.utils'
import { storage } from './utils/storage.utils'

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
  gistState: storage.get<GistState>('gistState', { isGistState: false, projects: [] }),
  gistStateLastSum: storage.get('gistStateLastSum', -1),
  gistToken: storage.get('gistToken', ''),
  isLoading: false,
  projects: [] as Project[], // eslint-disable-line @typescript-eslint/consistent-type-assertions
})

export type Store = typeof store

export type StoreKey = keyof Store

export const activeStep = computed(() => store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex])

export const activeProject = computed(() => store.projects[store.activeProjectIndex])

export const nbSteps = computed(() => store.projects[store.activeProjectIndex]?.steps.length ?? 0)

export const isHotkeysActive = computed(() => !store.editMode && !store.addProjectModalOpened && !store.addStepModalOpened && !store.deleteProjectModalOpened && !store.deleteStepModalOpened)

export const actions = {
  addProject (project: Project) {
    store.projects.push(project)
    void actions.updateGistState('addProject')
  },
  addStep (step: Step) {
    const project = store.projects[store.activeProjectIndex]
    if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
    if (store.activeStepIndex === project.steps.length - 1) project.steps.push(step)
    else project.steps.splice(store.activeStepIndex + 1, 0, step)
    void sleep(nbSecondsInMinute).then(() => { actions.selectNextStep() })
    void actions.updateGistState('addStep')
  },
  clearGistStorage () {
    logger.debug('clearing gist storage')
    storage.clear('gistId')
    storage.clear('gistToken')
    storage.clear('gistState')
    storage.clear('gistStateLastSum')
  },
  clearStepDurations (step: Step) {
    delete step.months
    delete step.weeks
    delete step.days
    delete step.hours
    delete step.minutes
  },
  deleteActiveProject () {
    actions.deleteProject(activeProject.value?.id ?? -1)
  },
  deleteActiveStep () {
    if (!store.projects[store.activeProjectIndex]) { logger.error('cannot delete step: no active project'); return }
    store.projects[store.activeProjectIndex]?.steps.splice(store.activeStepIndex, 1)
    actions.preventStepIndexOverflow()
    actions.scrollToStep()
    void actions.updateGistState('deleteActiveStep')
  },
  deleteProject (projectId: number) {
    const index = store.projects.findIndex(project => project.id === projectId)
    store.projects.splice(index, 1)
    void actions.updateGistState('deleteProject')
    actions.selectPrevProject()
  },
  emitToast (message: string) {
    emit('toast', message)
  },
  enterEditMode () {
    logger.debug('entering edit mode')
    const selector = store.activeStepIndex === 0 ? `input#project-title-${store.projects[store.activeProjectIndex]?.id ?? 'UNKNOWN'}` : `input#step-title-${activeStep.value?.id ?? 'UNKNOWN'}`
    focusInput(selector)
  },
  exitEditMode () {
    logger.debug('exiting edit mode')
    unfocusActiveElement()
    void actions.updateGistState('exitEditMode')
  },
  // eslint-disable-next-line max-statements
  async fetchGist () {
    if (!store.gistId) { logger.debug('Cannot fetch gist without an id'); return }
    if (!store.gistToken) { logger.debug('Cannot fetch gist without a token'); return }
    logger.debug('fetching gist', store.gistId)
    const { data, message, success } = await read(store.gistId, store.gistToken)
    if (!success || !data) { actions.emitToast(message); return }
    logger.debug('fetched gist content :', data)
    const same = JSON.stringify(data.projects) === JSON.stringify(store.projects)
    if (same) { logger.debug('no changes detected'); return }
    if (data.projects.length > 0) store.projects = data.projects
  },
  async getGistId () {
    const { data: id, message, success } = await getId(store.gistId, store.gistState, store.gistToken)
    if (!success || id === undefined) { logger.error(message); return }
    logger.debug('got gist id', id)
    actions.setGistId(id)
  },
  // eslint-disable-next-line max-statements
  moveStep (direction: 'UNKNOWN' | 'after' | 'before') {
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
  openDeleteProjectModal () {
    store.deleteProjectModalOpened = true
  },
  openDeleteStepModal () {
    logger.debug('opening delete step modal')
    store.deleteStepModalOpened = true
  },
  patchCurrentProjectTitle (title: string) {
    if (title === '') { logger.warn('Title cannot be empty'); return }
    const project = store.projects[store.activeProjectIndex]
    if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
    project.title = title
    // let the edit toggle trigger => void actions.updateGistState('patchCurrentProjectTitle')
  },
  patchCurrentStepDuration (duration: string) {
    const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
    if (!step) { logger.warn('Cannot patch step duration without an active step'); return }
    try {
      const data = stringToStepDuration(duration)
      // if data contains one duration, clear the step duration
      if (Object.keys(data).length > 0) actions.clearStepDurations(step)
      logger.debug('updating step with data', data)
      Object.assign(step, data)
      // let the edit toggle trigger => void actions.updateGistState('patchCurrentStepDuration')
    } catch (error) {
      if (error instanceof Error) logger.error(error.message)
    }
  },
  patchCurrentStepStart (date: Date) {
    const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
    if (!step) { logger.warn('Cannot patch step date without an active step'); return }
    step.start = date
    // let the edit toggle trigger => void actions.updateGistState('patchCurrentStepStart')
  },
  // eslint-disable-next-line max-statements
  patchCurrentStepTitle (title: string) {
    if (title === '') { logger.warn('Title cannot be empty'); return }
    const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
    if (!step) { logger.warn('Cannot patch step title without an active step'); return }
    try {
      const data = stringToStepData(title)
      // if data contains title & one duration, clear the step duration
      if (Object.keys(data).length > 1) actions.clearStepDurations(step)
      logger.debug('updating step with data', data)
      Object.assign(step, data)
      logger.debug('step got new title & duration', step)
    } catch {
      step.title = title
      logger.debug('step got new title', step)
    }
    // let the edit toggle trigger => void actions.updateGistState('patchCurrentStepTitle')
  },
  preventStepIndexOverflow () {
    if (!store.projects[store.activeProjectIndex]) return
    const maxStepIndex = nbSteps.value - 1
    if (store.activeStepIndex > maxStepIndex) store.activeStepIndex = maxStepIndex
    const minStepIndex = 0
    if (store.activeStepIndex < minStepIndex) store.activeStepIndex = minStepIndex
  },
  scrollToProject () {
    if (!activeProject.value) { logger.debug('Cannot scroll to project without an active project'); return }
    const projectElement = document.querySelector('.app-active')
    if (!projectElement) { logger.debug('Cannot scroll to project without an dom element'); return }
    void debouncedScrollToElement(projectElement)
  },
  scrollToStep () {
    if (!activeStep.value) { logger.debug('Cannot scroll to step without an active step'); return }
    const stepElement = document.querySelector(`#step-${activeStep.value.id}`)
    if (!stepElement) { logger.debug('Cannot scroll to step without an dom element'); return }
    void debouncedScrollToElement(stepElement)
  },
  selectNextProject () {
    store.activeProjectIndex = (store.projects.length <= store.activeProjectIndex + 1) ? 0 : store.activeProjectIndex + 1
    actions.preventStepIndexOverflow()
    actions.scrollToProject()
  },
  selectNextStep () {
    if (!store.projects[store.activeProjectIndex]) return
    store.activeStepIndex = (nbSteps.value <= store.activeStepIndex + 1) ? 0 : store.activeStepIndex + 1
    actions.scrollToStep()
  },
  selectPrevProject () {
    store.activeProjectIndex = (store.activeProjectIndex - 1 < 0) ? (store.projects.length - 1) : store.activeProjectIndex - 1
    actions.preventStepIndexOverflow()
    actions.scrollToStep()
  },
  selectPrevStep () {
    if (!store.projects[store.activeProjectIndex]) return
    store.activeStepIndex = (store.activeStepIndex - 1 < 0) ? (nbSteps.value - 1) : store.activeStepIndex - 1
    actions.scrollToProject()
  },
  selectProject (projectId: number) {
    store.activeProjectIndex = store.projects.findIndex(project => project.id === projectId)
  },
  selectStep (stepId: number) {
    if (!store.projects[store.activeProjectIndex]) { logger.debug('Cannot select step without an active project'); return }
    store.activeStepIndex = store.projects[store.activeProjectIndex]?.steps.findIndex(step => step.id === stepId) ?? 0
  },
  setGistId (id: string) {
    if (store.gistId === id) return
    if (id === '') logger.debug('clearing gist id')
    else logger.debug('setting gist id', id)
    storage.set('gistId', id)
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
  async setGistToken (token: string) {
    storage.set('gistToken', token)
    if (token === '') {
      logger.debug('clearing gist token')
      actions.setGistId('')
      store.gistToken = ''
      return
    }
    logger.debug('setting gist token to', token)
    store.gistToken = token
    store.isLoading = true
    if (store.gistId === '') await actions.getGistId()
    await actions.fetchGist()
    // eslint-disable-next-line require-atomic-updates
    store.isLoading = false
  },
  toggleDateDisplay () {
    const project = store.projects[store.activeProjectIndex]
    if (!project) { logger.warn('Cannot toggle date display without an active project'); return }
    const before = project.isDateDisplayed ?? true
    logger.debug('toggling date display, was', before, 'now', !before)
    project.isDateDisplayed = !before
    void actions.updateGistState('toggleDateDisplay')
  },
  toggleDebugMode () {
    store.debugMode = !store.debugMode
    logger.debug('debug mode is now', store.debugMode)
  },
  toggleEditMode () {
    store.editMode = !store.editMode
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    store.editMode ? actions.enterEditMode() : actions.exitEditMode()
  },
  toggleTimeDisplay () {
    const project = store.projects[store.activeProjectIndex]
    if (!project) { logger.warn('Cannot toggle time display without an active project'); return }
    const before = project.isTimeDisplayed ?? true
    logger.debug('toggling time display, was', before, 'now', !before)
    project.isTimeDisplayed = !before
    void actions.updateGistState('toggleTimeDisplay')
  },
  // eslint-disable-next-line max-statements
  async updateGistState (reason: string) {
    logger.debug('updating gist state, cause :', reason, store.projects)
    actions.setGistState({ isGistState: true, projects: store.projects })
    const gistStateSum = objectSum(store.gistState)
    if (gistStateSum === store.gistStateLastSum) { logger.debug('prevent update : no changes detected'); return }
    logger.debug('gist state sum changed :', { sumA: store.gistStateLastSum, sumB: gistStateSum })
    actions.setGistStateLastSum(gistStateSum)
    if (!store.gistToken) { logger.debug('cannot persist without a gist token'); return }
    store.isLoading = true
    const { data, message, success } = await debouncedPersist('updateGistState', store.gistId, store.gistState, store.gistToken)
    logger.debug('persisted', { data, message, success })
    if (data !== undefined) actions.setGistId(String(data))
    // eslint-disable-next-line require-atomic-updates
    store.isLoading = false
    if (!message) return
    if (!success) actions.emitToast(message)
    logger.debug(message)
  },
}
