export class Step {
  id = Date.now()
  title?: string
  days?: number
  hours?: number
  start?: Date
  end?: Date
  constructor (data: Partial<Step> = {}) {
    Object.assign(this, data)
  }
}

export class Project {
  id = Date.now()
  title = ''
  color?: string
  steps: Step[] = []
  constructor (data: Partial<Project> = {}) {
    Object.assign(this, data)
  }
}
