import type { Step } from './step'

export class Project {
  public id = Date.now()

  public title = ''

  public color?: string

  public steps: Step[] = []

  public constructor (data: Partial<Project> = {}) {
    Object.assign(this, data)
  }
}
