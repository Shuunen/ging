import { Project } from '@/models/project.model'
import { Step } from '@/models/step.model'
import { getRandomNumber, getRandomString, pickOne } from 'shuutils'

function getRandomStep () {
  return new Step({
    id: getRandomNumber() + getRandomNumber(),
    title: getRandomString(),
  })
}

function getRandomProject () {
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
    id: getRandomNumber() + getRandomNumber(),
    title: getRandomString(),
    steps: new Array(getRandomNumber(3, 10)).map(() => getRandomStep()), // eslint-disable-line @typescript-eslint/no-magic-numbers, unicorn/no-new-array
  })
}

export const projects = new Array(getRandomNumber(2, 4)).map(() => getRandomProject()) // eslint-disable-line @typescript-eslint/no-magic-numbers, unicorn/no-new-array










