import { gistActions } from './gist.actions'
import { projectActions } from './project.actions'
import { selectionActions } from './selection.actions'
import { uiActions } from './ui.actions'

export { activeProject, activeStep, isHotkeysActive, nbSteps, store, type Store, type StoreKey } from './state'

export const actions = { ...gistActions, ...projectActions, ...selectionActions, ...uiActions }
