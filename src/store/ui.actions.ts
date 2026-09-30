import { focusInput, unfocusActiveElement } from '../utils/dom.utils'
import { logger } from '../utils/logger.utils'
import { gistActions } from './gist.actions'
import { activeStep, store } from './state'

function enterEditMode() {
  logger.debug('entering edit mode')
  const selector = store.activeStepIndex === 0 ? `input#project-title-${store.projects[store.activeProjectIndex]?.id ?? 'UNKNOWN'}` : `input#step-title-${activeStep.value?.id ?? 'UNKNOWN'}`
  focusInput(selector)
}

function exitEditMode() {
  logger.debug('exiting edit mode')
  unfocusActiveElement()
  void gistActions.updateGistState('exitEditMode')
}

function openAddProjectModal() {
  store.addProjectModalOpened = true
}

function openAddStepModal() {
  store.addStepModalOpened = true
}

function openDeleteProjectModal() {
  store.deleteProjectModalOpened = true
}

function openDeleteStepModal() {
  logger.debug('opening delete step modal')
  store.deleteStepModalOpened = true
}

function toggleDebugMode() {
  store.debugMode = !store.debugMode
  logger.debug('debug mode is now', store.debugMode)
}

function toggleEditMode() {
  store.editMode = !store.editMode
  if (store.editMode) enterEditMode()
  else exitEditMode()
}

export const uiActions = { enterEditMode, exitEditMode, openAddProjectModal, openAddStepModal, openDeleteProjectModal, openDeleteStepModal, toggleDebugMode, toggleEditMode }
