import { Step } from './step'

export class Project {
  id = Date.now()
  title = ''
  color?: string
  steps: Step[] = []
  constructor (data: Partial<Project> = {}) {
    Object.assign(this, data)
  }
}
