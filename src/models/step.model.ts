export class Step {
  public id = Date.now()

  public title = ''

  public duration?: string

  public months?: number

  public weeks?: number

  public days?: number

  public hours?: number

  public minutes?: number

  public start?: Date

  public end?: Date

  public constructor (data: Partial<Step> = {}) {
    Object.assign(this, data)
  }
}
