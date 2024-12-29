import { isBrowserEnvironment, Logger, type LoggerOptions } from 'shuutils'
import { storage } from './storage.utils'

export const logger = new Logger({
  minimumLevel: storage.get<LoggerOptions['minimumLevel']>('logLevel', '3-info'),
  willOutputToConsole: isBrowserEnvironment(),
})
