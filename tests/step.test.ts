import { Step } from '../src/models/step.model'
import { durationBetweenDates, processStepsDurations, stepToHumanDuration, stepToString, stringToStepData, stringToStepDuration } from '../src/utils/step.utils'

describe('stepToString', () => {
  test.each([
    ['days', { days: 1, hours: 0, title: 'A' }, 'A, 1 day'],
    ['hours', { days: 0, hours: 1, title: 'B' }, 'B, 1 hour'],
    ['plural days', { days: 3, title: 'C' }, 'C, 3 days'],
    ['months', { months: 2, title: 'D' }, 'D, 2 months'],
    ['title only', { title: 'E' }, 'E'],
    ['no title and no duration', { days: 0 }, ''],
  ])('%s', (_name, data, expected) => {
    expect(stepToString(new Step(data))).toBe(expected)
  })
})

describe('stringToStepData', () => {
  test('parses title and days', () => {
    const step = stringToStepData('A, 2 days')
    expect(step.title).toBe('A')
    expect(step.days).toBe(2)
  })

  test('parses minutes', () => {
    expect(stringToStepData('B, 1 minute').minutes).toBe(1)
    expect(stringToStepData('D,1 min').minutes).toBe(1)
  })

  test('throws on an unknown unit', () => {
    expect(() => stringToStepData('C, 12 monkeys')).toThrow('Invalid step unit : monkeys')
  })

  test('keeps the whole input as title when no unit is given', () => {
    expect(stringToStepData('E, 21').title).toBe('E, 21')
    expect(stringToStepData('F,').title).toBe('F,')
    expect(stringToStepData('new 2').title).toBe('new 2')
  })

  test('parses a duration without comma', () => {
    const step = stringToStepData('SUper duper 20 min')
    expect(step.title).toBe('SUper duper')
    expect(step.minutes).toBe(20)
  })

  test('parses hours', () => {
    expect(stringToStepData('H, 1 h').hours).toBe(1)
  })

  test('parses a title containing parentheses and months', () => {
    const step = stringToStepData('I am legend (2007) 1 m')
    expect(step.title).toBe('I am legend (2007)')
    expect(step.months).toBe(1)
  })
})

describe('stringToStepDuration', () => {
  test.each([
    ['2 days', { days: 2 }],
    ['1 minute', { minutes: 1 }],
    ['32 minutes', { minutes: 32 }],
  ])('parses %s', (input, expected) => {
    expect(stringToStepDuration(input)).toStrictEqual(expected)
  })

  test('throws on an unknown unit', () => {
    expect(() => stringToStepDuration('12 monkeys')).toThrow('Invalid step unit : monkeys')
  })

  test('throws on a missing number', () => {
    expect(() => stringToStepDuration('monkeys')).toThrow('Invalid duration string : monkeys')
  })
})

describe('stepToHumanDuration', () => {
  test.each([
    ['day', { days: 1, hours: 0, title: 'A' }, '1 day'],
    ['hour', { days: 0, hours: 1, title: 'B' }, '1 hour'],
    ['days', { days: 3, title: 'C' }, '3 days'],
    ['no duration', { title: 'D' }, ''],
  ])('%s', (_name, data, expected) => {
    expect(stepToHumanDuration(new Step(data))).toBe(expected)
  })
})

describe('processStepsDurations', () => {
  test('computes durations and end dates from a start date', () => {
    const [first, second] = processStepsDurations([new Step({ days: 2, start: new Date('2020-01-01') }), new Step({ minutes: 3 })])
    expect(first?.duration).toBe('2 days')
    expect(second?.duration).toBe('3 minutes')
    expect(first?.end).toStrictEqual(new Date('2020-01-03'))
    expect(second?.end).toStrictEqual(new Date('2020-01-03T00:03:00.000Z'))
  })

  test('computes durations without a start date', () => {
    const [first, second] = processStepsDurations([new Step({ months: 2 }), new Step({ hours: 3 }), new Step({ weeks: 4 })])
    expect(first?.duration).toBe('2 months')
    expect(second?.duration).toBe('3 hours')
  })
})

describe('durationBetweenDates', () => {
  const start = new Date('2020-01-01')

  test.each([
    ['2020-01-01T00:00:00.000Z', '0 second'],
    ['2020-01-01T00:00:01.000Z', '1 second'],
    ['2020-01-01T00:00:02.000Z', '2 seconds'],
    ['2020-01-01T00:01:00.000Z', '1 minute'],
    ['2020-01-01T00:02:00.000Z', '2 minutes'],
    ['2020-01-01T01:00:00.000Z', '1 hour'],
    ['2020-01-01T02:00:00.000Z', '2 hours'],
    ['2020-01-02T00:00:00.000Z', '1 day'],
    ['2020-01-03T00:00:00.000Z', '2 days'],
    ['2020-02-01T00:00:00.000Z', '1 month'],
    ['2020-03-01T00:00:00.000Z', '2 months'],
    ['2021-01-01T00:00:00.000Z', '1 year'],
    ['2022-01-01T00:00:00.000Z', '2 years'],
  ])('until %s is %s', (end, expected) => {
    expect(durationBetweenDates(start, new Date(end))).toBe(expected)
  })
})
