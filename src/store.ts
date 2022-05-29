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
    projects: [] as Project[],
    edit: false,
  }),
  actions: {
    addProject (project: Project) {
      this.projects.push(project)
    },
    deleteProject (id: number) {
      const index = this.projects.findIndex(p => p.id === id)
      this.projects.splice(index, 1)
    },
    addStep (id: number, step: Step, at = 0) {
      const project = this.projects.find(p => p.id === id)
      if (!project) throw new Error(`Project with id ${id} not found`)
      if (at === project.steps.length) project.steps.push(step)
      else project.steps.splice(at, 0, step)
      fillSteps(project.steps)
    },
    toggleEdit () {
      this.edit = !this.edit
    },
  },
  persist: true,
})
