/**
 * Step model
 */
// eslint-disable-next-line no-restricted-syntax
export class Step {
  public days?: number

  public duration?: string

  public end?: Date

  public hours?: number

  public id = Date.now()

  public minutes?: number

  public months?: number

  public start?: Date

  public title = ''

  public weeks?: number

  /**
   * Constructor
   * @param data the data to use
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public constructor (data: Partial<Step> = {}) {
    Object.assign(this, data)
  }
}
