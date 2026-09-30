// oxlint-disable no-magic-numbers
import { pickOne, randomNumber, randomString } from 'shuutils'
import { Project } from '../models/project.model'
import { Step } from '../models/step.model'

export function getRandomStep() {
  return new Step({
    id: randomNumber() + randomNumber(),
    title: randomString(),
  })
}

export function getRandomProject() {
  return new Project({
    color: pickOne(['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal', 'cyan', 'gray', 'indigo']),
    id: randomNumber() + randomNumber(),
    steps: Array.from({ length: randomNumber(3, 10) }, () => getRandomStep()),
    title: randomString(),
  })
}

export const projects = Array.from({ length: randomNumber(2, 4) }, () => getRandomProject())
