import { pickOne, randomNumber, randomString } from 'shuutils'
import { Project } from '../models/project.model'
import { Step } from '../models/step.model'

export function getRandomStep () {
  return new Step({
    id: randomNumber() + randomNumber(),
    title: randomString(),
  })
}

export function getRandomProject () {
  return new Project({
    color: pickOne([
      'red',
      'blue',
      'green',
      'yellow',
      'purple',
      'pink',
      'orange',
      'teal',
      'cyan',
      'gray',
      'indigo',
    ]),
    id: randomNumber() + randomNumber(),
    steps: new Array(randomNumber(3, 10)).map(() => getRandomStep()), // eslint-disable-line @typescript-eslint/no-magic-numbers, unicorn/no-new-array
    title: randomString(),
  })
}

export const projects = new Array(randomNumber(2, 4)).map(() => getRandomProject()) // eslint-disable-line @typescript-eslint/no-magic-numbers, unicorn/no-new-array










