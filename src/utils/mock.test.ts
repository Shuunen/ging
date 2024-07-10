import { expect, it } from 'vitest'
import { getRandomProject, getRandomStep, projects } from './mock.utils'

it('projects A', () => {
  expect(projects.length).toBeGreaterThan(0)
})

it('getRandomStep A', () => {
  expect(getRandomStep().id).toBeDefined()
})

it('getRandomProject A', () => {
  expect(getRandomProject().id).toBeDefined()
})
