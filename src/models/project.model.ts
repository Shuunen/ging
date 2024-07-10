import type { Step } from './step.model'

/**
 * Project model
 */
// eslint-disable-next-line no-restricted-syntax
export class Project {
  public color?: string

  public id = Date.now()

  public isDateDisplayed?: boolean

  public isTimeDisplayed?: boolean

  public steps: Step[] = []

  public title = ''

  /**
   * Constructor
   * @param data the data to use
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public constructor (data: Partial<Project> = {}) {
    Object.assign(this, data)
  }
}
