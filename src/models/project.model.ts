import type { Step } from './step.model'

export class Project {
  public color?: string

  public id = Date.now()

  public isDateDisplayed?: boolean

  public isTimeDisplayed?: boolean

  public steps: Step[] = []

  public title = ''

  public constructor(data: Partial<Project> = {}) {
    Object.assign(this, data)
  }
}
