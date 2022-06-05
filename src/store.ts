import { Project, Step } from '@/types'
import { defineStore } from 'pinia'

const fillSteps = (steps: Step[]) => {
  const date = new Date(steps[0]?.start ?? new Date())
  steps.forEach((step) => {
    step.start = new Date(date)
    if (!step.days && !step.hours) step.days = 1
    if (step.days) date.setDate(date.getDate() + step.days)
    if (step.hours) date.setHours(date.getHours() + step.hours)
    step.end = date
  })
  return steps
}

export const useStore = defineStore('app', {
  state: () => ({
    activeProjectIndex: 0,
    activeStepIndex: 0,
    projects: [] as Project[],
  }),
  actions: {
    addProject (project: Project) {
      this.projects.push(project)
    },
    deleteActiveStep () {
      const project = this.projects[this.activeProjectIndex]
      project.steps.splice(this.activeStepIndex, 1)
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
      fillSteps(project.steps)
    },
    preventStepIndexOverflow () {
      const maxStepIndex = this.projects[this.activeProjectIndex].steps.length - 1
      if (this.activeStepIndex > maxStepIndex) this.activeStepIndex = maxStepIndex
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
  },
  persist: true,
})
