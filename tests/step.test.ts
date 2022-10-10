import { Step } from '@/models'
import { durationBetweenDates, processStepsDurations, stepToHumanDuration, stepToString, stringToStepData, stringToStepDuration } from '@/utils/step'
import { check, checksRun } from 'shuutils'
import { test } from 'uvu'
import { throws } from 'uvu/assert'

check('stepToString A', stepToString(new Step({ title: 'A', days: 1, hours: 0 })), 'A, 1 day')
check('stepToString B', stepToString(new Step({ title: 'B', days: 0, hours: 1 })), 'B, 1 hour')
check('stepToString C', stepToString(new Step({ title: 'C', days: 3 })), 'C, 3 days')
check('stepToString D', stepToString(new Step({ title: 'D', months: 2 })), 'D, 2 months')
check('stepToString incomplete E', stepToString(new Step({ title: 'E' })), 'E')

check('stringToStep A title', stringToStepData('A, 2 days').title, 'A')
check('stringToStep A days', stringToStepData('A, 2 days').days, 2)
check('stringToStep B minutes', stringToStepData('B, 1 minute').minutes, 1)
test('stringToStep invalid C', () => throws(() => stringToStepData('C, 12 monkeys')))
check('stringToStep D', stringToStepData('D,1 min').minutes, 1)
test('stringToStep invalid E', () => throws(() => stringToStepData('E, 21')))
test('stringToStep invalid F', () => throws(() => stringToStepData('F,')))
check('stringToStep G title', stringToStepData('SUper duper 20 min').title, 'SUper duper')
check('stringToStep G minutes', stringToStepData('SUper duper 20 min').minutes, 20)
check('stringToStep H', stringToStepData('H, 1 h').hours, 1)
check('stringToStep I title', stringToStepData('I am legend (2007) 1 m').title, 'I am legend (2007)')
check('stringToStep I month', stringToStepData('I am legend (2007) 1 m').months, 1)

check('stringToStepDuration A', stringToStepDuration('2 days'), { days: 2 })
check('stringToStepDuration B', stringToStepDuration('1 minute'), { minutes: 1 })
test('stringToStepDuration invalid C', () => throws(() => stringToStepDuration('12 monkeys')))
check('stringToStepDuration D', stringToStepDuration('32 minutes'), { minutes: 32 })
test('stringToStepDuration invalid E', () => throws(() => stringToStepDuration('monkeys')))

check('stepToHumanDuration A', stepToHumanDuration(new Step({ title: 'A', days: 1, hours: 0 })), '1 day')
check('stepToHumanDuration B', stepToHumanDuration(new Step({ title: 'B', days: 0, hours: 1 })), '1 hour')
check('stepToHumanDuration C', stepToHumanDuration(new Step({ title: 'C', days: 3 })), '3 days')
check('stepToHumanDuration D without duration', stepToHumanDuration(new Step({ title: 'D' })), '')

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const steps = [new Step({ start: new Date('2020-01-01'), days: 2 }), new Step({ minutes: 3 })]
const processedA = processStepsDurations(steps)
check('processStepsDurations A', processedA[0]!.duration, '2 days')
check('processStepsDurations B', processedA[1]!.duration, '3 minutes')
check('processStepsDurations C', processedA[0]!.end, new Date('2020-01-03'))
check('processStepsDurations D', processedA[1]!.end, new Date('2020-01-03T00:03:00.000Z'))

const stepsWithoutStart = [new Step({ months: 2 }), new Step({ hours: 3 }), new Step({ weeks: 4 })]
const processedB = processStepsDurations(stepsWithoutStart)
check('processStepsDurations E', processedB[0]!.duration, '2 months')
check('processStepsDurations F', processedB[1]!.duration, '3 hours')
/* eslint-enable @typescript-eslint/no-non-null-assertion */

check('durationBetweenDates 0 second', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01')), '0 second')
check('durationBetweenDates 1 second', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01T00:00:01.000Z')), '1 second')
check('durationBetweenDates 2 seconds', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01T00:00:02.000Z')), '2 seconds')
check('durationBetweenDates 1 minute', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01T00:01:00.000Z')), '1 minute')
check('durationBetweenDates 2 minutes', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01T00:02:00.000Z')), '2 minutes')
check('durationBetweenDates 1 hour', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01T01:00:00.000Z')), '1 hour')
check('durationBetweenDates 2 hours', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-01T02:00:00.000Z')), '2 hours')
check('durationBetweenDates 1 day', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-02T00:00:00.000Z')), '1 day')
check('durationBetweenDates 2 days', durationBetweenDates(new Date('2020-01-01'), new Date('2020-01-03T00:00:00.000Z')), '2 days')
check('durationBetweenDates 1 month', durationBetweenDates(new Date('2020-01-01'), new Date('2020-02-01T00:00:00.000Z')), '1 month')
check('durationBetweenDates 2 months', durationBetweenDates(new Date('2020-01-01'), new Date('2020-03-01T00:00:00.000Z')), '2 months')
check('durationBetweenDates 1 year', durationBetweenDates(new Date('2020-01-01'), new Date('2021-01-01T00:00:00.000Z')), '1 year')
check('durationBetweenDates 2 years', durationBetweenDates(new Date('2020-01-01'), new Date('2022-01-01T00:00:00.000Z')), '2 years')

checksRun()
