import { getRandomNumber, getRandomString, pickOne } from 'shuutils'
import { Project } from '../models/project.model'
import { Step } from '../models/step.model'

export function getRandomStep () {
  return new Step({
    id: getRandomNumber() + getRandomNumber(),
    title: getRandomString(),
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
    ]) /* c8 ignore next */ ?? 'gray',
    id: getRandomNumber() + getRandomNumber(),
    steps: new Array(getRandomNumber(3, 10)).map(() => getRandomStep()), // eslint-disable-line @typescript-eslint/no-magic-numbers, unicorn/no-new-array
    title: getRandomString(),
  })
}

export const projects = new Array(getRandomNumber(2, 4)).map(() => getRandomProject()) // eslint-disable-line @typescript-eslint/no-magic-numbers, unicorn/no-new-array










