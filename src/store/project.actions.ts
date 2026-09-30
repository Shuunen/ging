import { nbSecondsInMinute, sleep } from 'shuutils'
import type { Project } from '../models/project.model'
import type { Step } from '../models/step.model'
import { logger } from '../utils/logger.utils'
import { stringToStepData, stringToStepDuration } from '../utils/step.utils'
import { gistActions } from './gist.actions'
import { selectionActions } from './selection.actions'
import { activeProject, store } from './state'

async function selectNextStepLater() {
  await sleep(nbSecondsInMinute)
  selectionActions.selectNextStep()
}

function addProject(project: Project) {
  store.projects.push(project)
  void gistActions.updateGistState('addProject')
}

function addStep(step: Step) {
  const project = store.projects[store.activeProjectIndex]
  if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
  if (store.activeStepIndex === project.steps.length - 1) project.steps.push(step)
  else project.steps.splice(store.activeStepIndex + 1, 0, step)
  void selectNextStepLater()
  void gistActions.updateGistState('addStep')
}

function clearStepDurations(step: Step) {
  delete step.months
  delete step.weeks
  delete step.days
  delete step.hours
  delete step.minutes
}

function deleteProject(projectId: number) {
  const index = store.projects.findIndex(project => project.id === projectId)
  store.projects.splice(index, 1)
  void gistActions.updateGistState('deleteProject')
  selectionActions.selectPrevProject()
}

function deleteActiveProject() {
  deleteProject(activeProject.value?.id ?? -1)
}

function deleteActiveStep() {
  if (!store.projects[store.activeProjectIndex]) {
    logger.error('cannot delete step: no active project')
    return
  }
  store.projects[store.activeProjectIndex]?.steps.splice(store.activeStepIndex, 1)
  selectionActions.preventStepIndexOverflow()
  selectionActions.scrollToStep()
  void gistActions.updateGistState('deleteActiveStep')
}

function moveStep(direction: 'after' | 'before' | 'UNKNOWN') {
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
  void gistActions.updateGistState('moveStep')
}

function patchCurrentProjectTitle(title: string) {
  if (title === '') {
    logger.warn('Title cannot be empty')
    return
  }
  const project = store.projects[store.activeProjectIndex]
  if (!project) throw new Error(`Project at index ${store.activeProjectIndex} not found`)
  project.title = title
  // let the edit toggle trigger => void gistActions.updateGistState('patchCurrentProjectTitle')
}

function patchCurrentStepDuration(duration: string) {
  const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
  if (!step) {
    logger.warn('Cannot patch step duration without an active step')
    return
  }
  try {
    const data = stringToStepDuration(duration)
    // if data contains one duration, clear the step duration
    if (Object.keys(data).length > 0) clearStepDurations(step)
    logger.debug('updating step with data', data)
    Object.assign(step, data)
    // let the edit toggle trigger => void gistActions.updateGistState('patchCurrentStepDuration')
  } catch (error) {
    if (error instanceof Error) logger.error(error.message)
  }
}

function patchCurrentStepStart(date: Date) {
  const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
  if (!step) {
    logger.warn('Cannot patch step date without an active step')
    return
  }
  step.start = date
  // let the edit toggle trigger => void gistActions.updateGistState('patchCurrentStepStart')
}

function patchCurrentStepTitle(title: string) {
  if (title === '') {
    logger.warn('Title cannot be empty')
    return
  }
  const step = store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex]
  if (!step) {
    logger.warn('Cannot patch step title without an active step')
    return
  }
  try {
    const data = stringToStepData(title)
    // if data contains title & one duration, clear the step duration
    if (Object.keys(data).length > 1) clearStepDurations(step)
    logger.debug('updating step with data', data)
    Object.assign(step, data)
    logger.debug('step got new title & duration', step)
  } catch {
    step.title = title
    logger.debug('step got new title', step)
  }
  // let the edit toggle trigger => void gistActions.updateGistState('patchCurrentStepTitle')
}

function toggleDateDisplay() {
  const project = store.projects[store.activeProjectIndex]
  if (!project) {
    logger.warn('Cannot toggle date display without an active project')
    return
  }
  const before = project.isDateDisplayed ?? true
  logger.debug('toggling date display, was', before, 'now', !before)
  project.isDateDisplayed = !before
  void gistActions.updateGistState('toggleDateDisplay')
}

function toggleTimeDisplay() {
  const project = store.projects[store.activeProjectIndex]
  if (!project) {
    logger.warn('Cannot toggle time display without an active project')
    return
  }
  const before = project.isTimeDisplayed ?? true
  logger.debug('toggling time display, was', before, 'now', !before)
  project.isTimeDisplayed = !before
  void gistActions.updateGistState('toggleTimeDisplay')
}

export const projectActions = {
  addProject,
  addStep,
  clearStepDurations,
  deleteActiveProject,
  deleteActiveStep,
  deleteProject,
  moveStep,
  patchCurrentProjectTitle,
  patchCurrentStepDuration,
  patchCurrentStepStart,
  patchCurrentStepTitle,
  toggleDateDisplay,
  toggleTimeDisplay,
}
