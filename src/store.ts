/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-statements */
import type { Project, Step } from '@/models'
import { defineStore } from 'pinia'
import { emit, objectSum, sleep } from 'shuutils'
import { debouncedScrollToElement, focusInput, unfocusActiveElement } from './utils/dom'
import { debouncedPersist, getId, read, type GistState } from './utils/gist'
import { stringToStepData, stringToStepDuration } from './utils/step'

const first = 0

export const initialState = {
  activeProjectIndex: 0,
  activeStepIndex: 0,
  addProjectModalOpened: false,
  addStepModalOpened: false,
  debugMode: false,
  deleteProjectModalOpened: false,
  deleteStepModalOpened: false,
  editMode: false,
  gistId: '',
  gistToken: '',
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  gistState: {} as GistState,
  gistStateLastSum: -1,
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  projects: [] as Project[],
}

export type State = typeof initialState

export type StateKey = keyof State

export const useStore = defineStore('app', {
  state: () => initialState,
  getters: {
    activeProject: (state): Project | undefined => state.projects[state.activeProjectIndex],
    activeStep: (state): Step | undefined => {
      const project = state.projects[state.activeProjectIndex]
      if (!project) return undefined
      const step = project.steps[state.activeStepIndex]
      if (!step) return undefined
      return step
    },
  },
  actions: {
    addProject (project: Project) {
      this.projects.push(project)
      void this.updateGistState('addProject')
    },
    deleteActiveStep () {
      if (!this.activeProject) { console.error('cannot delete step: no active project'); return }
      this.activeProject.steps.splice(this.activeStepIndex, 1)
      this.preventStepIndexOverflow()
      this.scrollToStep()
      void this.updateGistState('deleteActiveStep')
    },
    deleteActiveProject () {
      this.projects.splice(this.activeProjectIndex, 1)
      void this.updateGistState('deleteActiveProject')
    },
    deleteProject (projectId: number) {
      const index = this.projects.findIndex(project => project.id === projectId)
      this.projects.splice(index, 1)
      void this.updateGistState('deleteProject')
    },
    addStep (step: Step) {
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      if (this.activeStepIndex === project.steps.length - 1) project.steps.push(step)
      else project.steps.splice(this.activeStepIndex + 1, 0, step)
      const timeBeforeSelect = 100
      // eslint-disable-next-line promise/always-return, promise/prefer-await-to-then
      void sleep(timeBeforeSelect).then(() => { this.selectNextStep() })
      void this.updateGistState('addStep')
    },
    preventStepIndexOverflow () {
      if (!this.activeProject) return
      const maxStepIndex = this.activeProject.steps.length - 1
      if (this.activeStepIndex > maxStepIndex) this.activeStepIndex = maxStepIndex
      const minStepIndex = 0
      if (this.activeStepIndex < minStepIndex) this.activeStepIndex = minStepIndex
    },
    selectPrevProject () {
      this.activeProjectIndex = (this.activeProjectIndex - 1 < 0) ? (this.projects.length - 1) : this.activeProjectIndex - 1
      this.preventStepIndexOverflow()
    },
    selectNextProject () {
      this.activeProjectIndex = (this.projects.length <= this.activeProjectIndex + 1) ? 0 : this.activeProjectIndex + 1
      this.preventStepIndexOverflow()
    },
    selectPrevStep () {
      if (!this.activeProject) return
      this.activeStepIndex = (this.activeStepIndex - 1 < 0) ? (this.activeProject.steps.length - 1) : this.activeStepIndex - 1
      this.scrollToStep()
    },
    selectNextStep () {
      if (!this.activeProject) return
      this.activeStepIndex = (this.activeProject.steps.length <= this.activeStepIndex + 1) ? 0 : this.activeStepIndex + 1
      this.scrollToStep()
    },
    scrollToStep () {
      if (!this.activeStep) { console.log('Cannot scroll to step without an active step'); return }
      const stepElement = document.querySelector(`#step-${this.activeStep.id}`)
      if (!stepElement) { console.log('Cannot scroll to step without an dom element'); return }
      void debouncedScrollToElement(stepElement)
    },
    selectProject (projectId: number) {
      this.activeProjectIndex = this.projects.findIndex(project => project.id === projectId)
    },
    selectStep (stepId: number) {
      if (!this.activeProject) { console.log('Cannot select step without an active project'); return }
      this.activeStepIndex = this.activeProject.steps.findIndex(step => step.id === stepId)
    },
    patchCurrentStepTitle (title: string) {
      if (!this.activeStep) { console.warn('Cannot patch step title without an active step'); return }
      if (title === '') { console.warn('Title cannot be empty'); return }
      const step = this.activeStep
      try {
        const data = stringToStepData(title)
        // if data contains title & one duration, clear the step duration
        if (Object.keys(data).length > 1) this.clearStepDurations(step)
        console.log('updating step with data', data)
        Object.assign(step, data)
        console.log('step got new title & duration', step)
      } catch {
        step.title = title
        console.log('step got new title', step)
      }
    },
    patchCurrentStepDuration (duration: string) {
      if (!this.activeStep) { console.warn('Cannot patch step duration without an active step'); return }
      try {
        const data = stringToStepDuration(duration)
        // if data contains one duration, clear the step duration
        if (Object.keys(data).length > 0) this.clearStepDurations(this.activeStep)
        console.log('updating step with data', data)
        Object.assign(this.activeStep, data)
      } catch (error) {
        if (error instanceof Error) console.error(error.message)
      }
    },
    patchCurrentStepStart (date: Date) {
      if (!this.activeStep) { console.warn('Cannot patch step date without an active step'); return }
      this.activeStep.start = date
    },
    patchCurrentProjectTitle (title: string) {
      if (title === '') { console.warn('Title cannot be empty'); return }
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      project.title = title
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
    toggleEditMode () {
      this.editMode = !this.editMode
      console.log('edit mode is now', this.editMode)
      if (!this.editMode) { unfocusActiveElement(); return }
      if (this.activeStepIndex === first) { focusInput(`input#project-title-${this.activeProject?.id ?? 'UNKNOWN'}`); return }
      focusInput(`input#step-title-${this.activeStep?.id ?? 'UNKNOWN'}`)
    },
    toggleDebugMode () {
      this.debugMode = !this.debugMode
      console.log('debug mode is now', this.debugMode)
    },
    moveStep (direction: 'after' | 'before' | 'UNKNOWN') {
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      const step = project.steps[this.activeStepIndex]
      if (!step) throw new Error(`Step at index ${this.activeStepIndex} not found`)
      const index = project.steps.indexOf(step)
      if (direction === 'before') {
        if (index === first) return
        project.steps.splice(index, 1)
        project.steps.splice(index - 1, 0, step)
        this.activeStepIndex -= 1
      } else if (direction === 'after') {
        if (index === project.steps.length - 1) return
        project.steps.splice(index, 1)
        project.steps.splice(index + 1, 0, step)
        this.activeStepIndex += 1
      } else throw new Error(`Invalid direction : ${direction}`)
      void this.updateGistState('moveStep')
    },
    openAddProjectModal () {
      this.addProjectModalOpened = true
    },
    openAddStepModal () {
      this.addStepModalOpened = true
    },
    openDeleteStepModal () {
      this.deleteStepModalOpened = true
    },
    openDeleteProjectModal () {
      this.deleteProjectModalOpened = true
    },
    async setGistToken (token: string) {
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (token === '') {
        console.log('clearing gist token')
        this.setGistId('')
        this.gistToken = ''
        return
      }
      console.log('setting gist token to', token)
      this.gistToken = token
      this.isLoading = true
      if (this.gistId === '') await this.getGistId()
      await this.fetchGist()
      this.isLoading = false
    },
    async getGistId () {
      const { success, message, data: id } = await getId(this)
      if (!success || id === undefined) { console.error(message); return }
      console.log('got gist id', id)
      this.setGistId(id)
    },
    async fetchGist () {
      if (!this.gistId) { console.log('Cannot fetch gist without an id'); return }
      if (!this.gistToken) { console.log('Cannot fetch gist without a token'); return }
      console.log('fetching gist', this.gistId)
      const { success, message, data } = await read(this.gistId, this.gistToken)
      if (!success || !data) { this.emitToast(message); return }
      console.log('fetched gist content :', data)
      const same = JSON.stringify(data.projects) === JSON.stringify(this.projects)
      if (same) { console.log('no changes detected'); return }
      if (data.projects.length > 0) this.projects = data.projects
    },
    setGistId (id: string) {
      if (this.gistId === id) return
      if (id === '') console.log('clearing gist id')
      else console.log('setting gist id', id)
      this.gistId = id
    },
    async updateGistState (reason: string) {
      console.log('updating gist state, cause :', reason, this.projects)
      this.gistState = {
        projects: this.projects,
        isGistState: true,
      }
      const gistStateSum = objectSum(this.gistState)
      if (gistStateSum === this.gistStateLastSum) { console.log('prevent update : no changes detected'); return }
      this.gistStateLastSum = gistStateSum
      if (!this.gistToken) { console.log('cannot persist without a gist token'); return }
      this.isLoading = true
      const { success, message, data } = await debouncedPersist('updateGistState', this)
      console.log('persisted', { success, message, data })
      if (data !== undefined) this.setGistId(String(data))
      this.isLoading = false
      if (!message) return
      if (!success) this.emitToast(message)
      console.log(message)
    },
    emitToast (message: string) {
      emit('toast', message)
    },
  },
  persist: true,
})

export const store = useStore()

export type Store = typeof store
