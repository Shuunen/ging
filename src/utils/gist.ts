import { copy, debounce, emit } from 'shuutils'

let lastState = ''

export const USELESS_KEYS = ['activeProjectIndex', 'activeStepIndex', 'editMode']

/**
 * Persist state in a gist
 * @param reason why the state should be persisted
 * @param newState the new state to persist
 * @returns true if the state was persisted
 */
export const persist = (reason = 'unknown', newState: Record<string, unknown>): boolean => {
  const currentState = copy(newState)
  USELESS_KEYS.forEach(key => delete currentState[key])
  const currentStateString = JSON.stringify(currentState)
  if (lastState === currentStateString) {
    console.log('same state or useless key modified')
    return false
  }
  lastState = currentStateString
  /* c8 ignore start */
  if (typeof window === 'undefined') return true // unit tests stop here
  emit('toast', `persisting to gist, cause : ${reason}`)
  console.log(`persisting to gist, cause : ${reason}`, currentState)
  return true
  /* c8 ignore end */
}

export const debouncedPersist = debounce(persist, 1000)
