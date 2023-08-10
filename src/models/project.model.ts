import type { Step } from './step.model'

export class Project {
  public id = Date.now()

  public title = ''

  public color?: string

  public steps: Step[] = []

  public isDateDisplayed?: boolean

  public isTimeDisplayed?: boolean

  public constructor (data: Partial<Project> = {}) {
    Object.assign(this, data)
  }
}
