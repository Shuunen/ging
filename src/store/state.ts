import { computed, reactive } from 'vue'
import type { Project } from '../models/project.model'
import type { GistState } from '../utils/gist.utils'
import { storage } from '../utils/storage.utils'

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
  projects: [] as Project[],
})

export type Store = typeof store

export type StoreKey = keyof Store

export const activeStep = computed(() => store.projects[store.activeProjectIndex]?.steps[store.activeStepIndex])

export const activeProject = computed(() => store.projects[store.activeProjectIndex])

export const nbSteps = computed(() => store.projects[store.activeProjectIndex]?.steps.length ?? 0)

export const isHotkeysActive = computed(() => !store.editMode && !store.addProjectModalOpened && !store.addStepModalOpened && !store.deleteProjectModalOpened && !store.deleteStepModalOpened)
