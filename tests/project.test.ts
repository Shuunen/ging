import { daysAgo, getTimestampMs } from 'shuutils'
import { Project } from '../src/models/project.model'

describe('project model', () => {
  const defaults = new Project()

  test('default id is recent', () => {
    expect(defaults.id).toBeGreaterThanOrEqual(getTimestampMs(daysAgo(1)))
  })

  test('default title is empty', () => {
    expect(defaults.title).toBe('')
  })

  test('default color is undefined', () => {
    expect(defaults.color).toBeUndefined()
  })

  test('default has no steps', () => {
    expect(defaults.steps).toStrictEqual([])
  })
})
