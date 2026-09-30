import { emit, objectSum } from 'shuutils'
import { type GistState, debouncedPersist, getId, read } from '../utils/gist.utils'
import { logger } from '../utils/logger.utils'
import { storage } from '../utils/storage.utils'
import { store } from './state'

function clearGistStorage() {
  logger.debug('clearing gist storage')
  storage.clear('gistId')
  storage.clear('gistToken')
  storage.clear('gistState')
  storage.clear('gistStateLastSum')
}

function emitToast(message: string) {
  emit('toast', message)
}

async function fetchGist() {
  if (!store.gistId) {
    logger.debug('Cannot fetch gist without an id')
    return
  }
  if (!store.gistToken) {
    logger.debug('Cannot fetch gist without a token')
    return
  }
  logger.debug('fetching gist', store.gistId)
  const { data, message, success } = await read(store.gistId, store.gistToken)
  if (!success || !data) {
    emitToast(message)
    return
  }
  logger.debug('fetched gist content :', data)
  const same = JSON.stringify(data.projects) === JSON.stringify(store.projects)
  if (same) {
    logger.debug('no changes detected')
    return
  }
  if (data.projects.length > 0) store.projects = data.projects
}

function setGistId(id: string) {
  if (store.gistId === id) return
  if (id === '') logger.debug('clearing gist id')
  else logger.debug('setting gist id', id)
  storage.set('gistId', id)
  store.gistId = id
}

async function getGistId() {
  const { data: id, message, success } = await getId({ gistId: store.gistId, gistState: store.gistState, gistToken: store.gistToken })
  if (!success || id === undefined) {
    logger.error(message)
    return
  }
  logger.debug('got gist id', id)
  setGistId(id)
}

function setGistState(state: GistState) {
  store.gistState = state
  storage.set('gistState', state)
}

function setGistStateLastSum(sum: number) {
  store.gistStateLastSum = sum
  storage.set('gistStateLastSum', sum)
}

async function setGistToken(token: string) {
  storage.set('gistToken', token)
  if (token === '') {
    logger.debug('clearing gist token')
    setGistId('')
    store.gistToken = ''
    return
  }
  logger.debug('setting gist token to', token)
  store.gistToken = token
  store.isLoading = true
  if (store.gistId === '') await getGistId()
  await fetchGist()
  store.isLoading = false
}

async function updateGistState(reason: string) {
  logger.debug('updating gist state, cause :', reason, store.projects)
  setGistState({ isGistState: true, projects: store.projects })
  const gistStateSum = objectSum(store.gistState)
  if (gistStateSum === store.gistStateLastSum) {
    logger.debug('prevent update : no changes detected')
    return
  }
  logger.debug('gist state sum changed :', { sumA: store.gistStateLastSum, sumB: gistStateSum })
  setGistStateLastSum(gistStateSum)
  if (!store.gistToken) {
    logger.debug('cannot persist without a gist token')
    return
  }
  store.isLoading = true
  const { data, message, success } = await debouncedPersist({ gistId: store.gistId, gistState: store.gistState, gistToken: store.gistToken, reason: 'updateGistState' })
  logger.debug('persisted', { data, message, success })
  if (data !== undefined) setGistId(data)
  store.isLoading = false
  if (!message) return
  if (!success) emitToast(message)
  logger.debug(message)
}

export const gistActions = { clearGistStorage, emitToast, fetchGist, getGistId, setGistId, setGistState, setGistStateLastSum, setGistToken, updateGistState }
