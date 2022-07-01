export class Step {
  id = Date.now()
  title?: string
  duration?: string
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  start?: Date
  end?: Date
  constructor (data: Partial<Step> = {}) {
    Object.assign(this, data)
  }
}
