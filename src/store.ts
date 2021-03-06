import { Project, Step } from '@/models'
import { defineStore } from 'pinia'
import { sleep } from 'shuutils'
import { stringToStepData, stringToStepDuration } from './utils/step'

export const useStore = defineStore('app', {
  state: () => ({
    activeProjectIndex: 0,
    activeStepIndex: 0,
    addProjectModalOpened: false,
    addStepModalOpened: false,
    debugMode: false,
    deleteProjectModalOpened: false,
    deleteStepModalOpened: false,
    editMode: false,
    projects: [] as Project[],
  }),
  getters: {
    activeProject: (state): Project | undefined => {
      return state.projects[state.activeProjectIndex]
    },
    activeStep: (state): Step | undefined => {
      const project = state.projects[state.activeProjectIndex]
      const step = project.steps[state.activeStepIndex]
      if (!step) return undefined
      return step
    },
  },
  actions: {
    addProject (project: Project) {
      this.projects.push(project)
    },
    deleteActiveStep () {
      const project = this.projects[this.activeProjectIndex]
      project.steps.splice(this.activeStepIndex, 1)
      this.preventStepIndexOverflow()
      this.scrollToStep()
    },
    deleteActiveProject () {
      this.projects.splice(this.activeProjectIndex, 1)
    },
    deleteProject (projectId: number) {
      const index = this.projects.findIndex(p => p.id === projectId)
      this.projects.splice(index, 1)
    },
    addStep (step: Step) {
      const project = this.projects[this.activeProjectIndex]
      if (!project) throw new Error(`Project at index ${this.activeProjectIndex} not found`)
      if (this.activeStepIndex === project.steps.length - 1) project.steps.push(step)
      else project.steps.splice(this.activeStepIndex + 1, 0, step)
      sleep(100).then(() => this.selectNextStep())
    },
    preventStepIndexOverflow () {
      const maxStepIndex = this.projects[this.activeProjectIndex].steps.length - 1
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
      this.activeStepIndex = (this.activeStepIndex - 1 < 0) ? (this.projects[this.activeProjectIndex].steps.length - 1) : this.activeStepIndex - 1
      this.scrollToStep()
    },
    selectNextStep () {
      this.activeStepIndex = (this.activeStepIndex + 1 >= this.projects[this.activeProjectIndex].steps.length) ? 0 : this.activeStepIndex + 1
      this.scrollToStep()
    },
    scrollToStep () {
      if (!this.activeStep) return console.log('Cannot scroll to step without an active step')
      const stepElement = document.querySelector(`#step-${this.activeStep.id}`)
      if (!stepElement) return console.log('Cannot scroll to step without an dom element')
      console.log('scrolling to step', stepElement)
      sleep(100).then(() => stepElement.scrollIntoView({ behavior: 'smooth' }))
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
      step.months = undefined
      step.weeks = undefined
      step.days = undefined
      step.hours = undefined
      step.minutes = undefined
    },
    toggleEditMode () {
      this.editMode = !this.editMode
      console.log('edit mode is now', this.editMode)
      if (!this.editMode) {
        const active = document.activeElement
        if (active && active instanceof HTMLInputElement) active.blur()
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
      const step = project.steps[this.activeStepIndex]
      if (!step) throw new Error(`Step at index ${this.activeStepIndex} not found`)
      const index = project.steps.indexOf(step)
      if (direction === 'before') {
        if (index === 0) return
        project.steps.splice(index, 1)
        project.steps.splice(index - 1, 0, step)
        return this.activeStepIndex--
      }
      if (direction === 'after') {
        if (index === project.steps.length - 1) return
        project.steps.splice(index, 1)
        project.steps.splice(index + 1, 0, step)
        return this.activeStepIndex++
      }
      throw new Error('Invalid direction : ' + direction)
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
  },
  persist: true,
})

export const store = useStore()
