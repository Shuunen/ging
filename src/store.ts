import type { Project, Step } from '@/models'
import { defineStore } from 'pinia'
import { emit, sleep } from 'shuutils'
import { debouncedScrollToElement } from './utils/dom'
import { debouncedPersist, getId, GistState, read } from './utils/gist'
import { objectSum } from './utils/object'
import { stringToStepData, stringToStepDuration } from './utils/step'

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
  gistState: {} as GistState,
  gistStateLastSum: '',
  isLoading: false,
  projects: [] as Project[],
}

export type State = typeof initialState

export type StateKey = keyof State

export const useStore = defineStore('app', {
  state: () => initialState,
  getters: {
    activeProject: (state): Project | undefined => {
      return state.projects[state.activeProjectIndex]
    },
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
      this.updateGistState('addProject')
    },
    deleteActiveStep () {
      if (!this.activeProject) return console.error('cannot delete step: no active project')
      this.activeProject.steps.splice(this.activeStepIndex, 1)
      this.preventStepIndexOverflow()
      this.scrollToStep()
      this.updateGistState('deleteActiveStep')
    },
    deleteActiveProject () {
      this.projects.splice(this.activeProjectIndex, 1)
      this.updateGistState('deleteActiveProject')
    },
    deleteProject (projectId: number) {
      const index = this.projects.findIndex(p => p.id === projectId)
      this.projects.splice(index, 1)
      this.updateGistState('deleteProject')
    },
    addStep (step: Step) {
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      if (this.activeStepIndex === project.steps.length - 1) project.steps.push(step)
      else project.steps.splice(this.activeStepIndex + 1, 0, step)
      sleep(100).then(() => this.selectNextStep())
      this.updateGistState('addStep')
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
      this.activeProjectIndex = (this.activeProjectIndex + 1 >= this.projects.length) ? 0 : this.activeProjectIndex + 1
      this.preventStepIndexOverflow()
    },
    selectPrevStep () {
      if (!this.activeProject) return
      this.activeStepIndex = (this.activeStepIndex - 1 < 0) ? (this.activeProject.steps.length - 1) : this.activeStepIndex - 1
      this.scrollToStep()
    },
    selectNextStep () {
      if (!this.activeProject) return
      this.activeStepIndex = (this.activeStepIndex + 1 >= this.activeProject.steps.length) ? 0 : this.activeStepIndex + 1
      this.scrollToStep()
    },
    scrollToStep () {
      if (!this.activeStep) return console.log('Cannot scroll to step without an active step')
      const stepElement = document.querySelector(`#step-${this.activeStep.id}`)
      if (!stepElement) return console.log('Cannot scroll to step without an dom element')
      debouncedScrollToElement(stepElement)
    },
    selectProject (projectId: number) {
      this.activeProjectIndex = this.projects.findIndex(p => p.id === projectId)
    },
    selectStep (stepId: number) {
      if (!this.activeProject) return console.log('Cannot select step without an active project')
      this.activeStepIndex = this.activeProject.steps.findIndex(s => s.id === stepId)
    },
    patchCurrentStepTitle (title: string) {
      if (!this.activeStep) return console.warn('Cannot patch step title without an active step')
      if (title.length === 0) return console.warn('Title cannot be empty')
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
      if (!this.activeStep) return console.warn('Cannot patch step duration without an active step')
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
      if (!this.activeStep) return console.warn('Cannot patch step date without an active step')
      this.activeStep.start = date
    },
    patchCurrentProjectTitle (title: string) {
      if (title.length === 0) return console.warn('Title cannot be empty')
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      project.title = title
    },
    clearStepDurations (step: Step) {
      delete step.months
      delete step.weeks
      delete step.days
      delete step.hours
      delete step.minutes
    },
    toggleEditMode () {
      this.editMode = !this.editMode
      console.log('edit mode is now', this.editMode)
      if (this.editMode === false) {
        const active = document.activeElement
        if (active && active instanceof HTMLInputElement) active.blur()
        this.updateGistState('toggleEditMode to false')
        return
      }
      if (this.activeStepIndex === 0) {
        const input = document.querySelector('input#project-title-' + this.activeProject?.id)
        if (input && input instanceof HTMLInputElement) input.focus()
      } else {
        const input = document.querySelector('input#step-title-' + this.activeStep?.id)
        console.log('selector', 'input#step-title-' + this.activeStep?.id)
        console.log('input', input)
        if (input && input instanceof HTMLInputElement) input.focus()
      }
    },
    toggleDebugMode () {
      this.debugMode = !this.debugMode
      console.log('debug mode is now', this.debugMode)
    },
    moveStep (direction: 'before' | 'after') {
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      const step = project.steps[this.activeStepIndex]
      if (!step) throw new Error(`Step at index ${this.activeStepIndex} not found`)
      const index = project.steps.indexOf(step)
      if (direction === 'before') {
        if (index === 0) return
        project.steps.splice(index, 1)
        project.steps.splice(index - 1, 0, step)
        this.activeStepIndex--
      } else if (direction === 'after') {
        if (index === project.steps.length - 1) return
        project.steps.splice(index, 1)
        project.steps.splice(index + 1, 0, step)
        this.activeStepIndex++
      } else throw new Error('Invalid direction : ' + direction)
      this.updateGistState('moveStep')
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
      if (token === '') {
        console.log('clearing gist token')
        this.setGistId('')
        this.gistToken = ''
        return
      }
      console.log('setting gist token to', token)
      this.gistToken = token
      this.isLoading = true
      if (this.gistId.length === 0) await this.getGistId()
      await this.fetchGist()
      this.isLoading = false
    },
    async getGistId () {
      const { success, message, data: id } = await getId(this)
      if (!success || id === undefined) return console.error(message)
      console.log('got gist id', id)
      this.setGistId(id)
    },
    async fetchGist () {
      if (!this.gistId) return console.log('Cannot fetch gist without an id')
      if (!this.gistToken) return console.log('Cannot fetch gist without a token')
      console.log('fetching gist', this.gistId)
      const { success, message, data } = await read(this.gistId, this.gistToken)
      if (!success || !data) return this.emitToast(message)
      console.log('fetched gist content :', data)
      const same = JSON.stringify(data.projects) === JSON.stringify(this.projects)
      if (same) return console.log('no changes detected')
      this.projects = data.projects
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
      if (gistStateSum === this.gistStateLastSum) return console.log('prevent update : no changes detected')
      this.gistStateLastSum = gistStateSum
      if (!this.gistToken) return console.log('cannot persist without a gist token')
      this.isLoading = true
      const { success, message, data } = await debouncedPersist('updateGistState', this)
      console.log('persisted', { success, message, data })
      if (data) this.setGistId(String(data))
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
