import { debouncedScrollToElement } from '../utils/dom.utils'
import { logger } from '../utils/logger.utils'
import { activeProject, activeStep, nbSteps, store } from './state'

function preventStepIndexOverflow() {
  if (!store.projects[store.activeProjectIndex]) return
  const maxStepIndex = nbSteps.value - 1
  if (store.activeStepIndex > maxStepIndex) store.activeStepIndex = maxStepIndex
  const minStepIndex = 0
  if (store.activeStepIndex < minStepIndex) store.activeStepIndex = minStepIndex
}

function scrollToProject() {
  if (!activeProject.value) {
    logger.debug('Cannot scroll to project without an active project')
    return
  }
  const projectElement = document.querySelector('.app-active')
  if (!projectElement) {
    logger.debug('Cannot scroll to project without an dom element')
    return
  }
  void debouncedScrollToElement(projectElement)
}

function scrollToStep() {
  if (!activeStep.value) {
    logger.debug('Cannot scroll to step without an active step')
    return
  }
  const stepElement = document.querySelector(`#step-${activeStep.value.id}`)
  if (!stepElement) {
    logger.debug('Cannot scroll to step without an dom element')
    return
  }
  void debouncedScrollToElement(stepElement)
}

function selectNextProject() {
  store.activeProjectIndex = store.projects.length <= store.activeProjectIndex + 1 ? 0 : store.activeProjectIndex + 1
  preventStepIndexOverflow()
  scrollToProject()
}

function selectNextStep() {
  if (!store.projects[store.activeProjectIndex]) return
  store.activeStepIndex = nbSteps.value <= store.activeStepIndex + 1 ? 0 : store.activeStepIndex + 1
  scrollToStep()
}

function selectPrevProject() {
  store.activeProjectIndex = store.activeProjectIndex - 1 < 0 ? store.projects.length - 1 : store.activeProjectIndex - 1
  preventStepIndexOverflow()
  scrollToStep()
}

function selectPrevStep() {
  if (!store.projects[store.activeProjectIndex]) return
  store.activeStepIndex = store.activeStepIndex - 1 < 0 ? nbSteps.value - 1 : store.activeStepIndex - 1
  scrollToProject()
}

function selectProject(projectId: number) {
  store.activeProjectIndex = store.projects.findIndex(project => project.id === projectId)
}

function selectStep(stepId: number) {
  if (!store.projects[store.activeProjectIndex]) {
    logger.debug('Cannot select step without an active project')
    return
  }
  store.activeStepIndex = store.projects[store.activeProjectIndex]?.steps.findIndex(step => step.id === stepId) ?? 0
}

export const selectionActions = { preventStepIndexOverflow, scrollToProject, scrollToStep, selectNextProject, selectNextStep, selectPrevProject, selectPrevStep, selectProject, selectStep }
