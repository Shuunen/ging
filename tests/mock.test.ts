import { getRandomProject, getRandomStep, projects } from '../src/utils/mock.utils'

describe('mock utils', () => {
  test('provides some projects', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  test('getRandomStep returns a step with an id', () => {
    expect(getRandomStep().id).toBeDefined()
  })

  test('getRandomProject returns a project with an id', () => {
    expect(getRandomProject().id).toBeDefined()
  })
})
