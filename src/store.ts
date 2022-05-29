import { defineStore } from 'pinia'

export const useStore = defineStore('app', {
  state: (): State => ({
    projects: [],
  }),
  actions: {
    addProject (project: Project) {
      this.projects.push(project)
    },
  },
  persist: true,
})
