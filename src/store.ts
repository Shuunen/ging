import { Project, Step } from '@/types'
import { defineStore } from 'pinia'

export const useStore = defineStore('app', {
  state: () => ({
    activeProjectIndex: 0,
    activeStepIndex: 0,
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
    },
    selectNextStep () {
      this.activeStepIndex = (this.activeStepIndex + 1 >= this.projects[this.activeProjectIndex].steps.length) ? 0 : this.activeStepIndex + 1
    },
    selectProject (projectId: number) {
      this.activeProjectIndex = this.projects.findIndex(p => p.id === projectId)
    },
    selectStep (stepId: number) {
      const project = this.projects[this.activeProjectIndex]
      this.activeStepIndex = project.steps.findIndex(s => s.id === stepId)
    },
  },
  persist: true,
})
