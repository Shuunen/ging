import type { Project } from '@/models'
import type { Store } from '@/store'
import { debounce } from 'shuutils'

export interface GistState {
  projects: Project[],
  isGistState: boolean,
}

const API_URL = 'https://api.github.com/gists'
const FILE_NAME = 'ging.json'

interface Response {
  id?: string
  message?: string
  files?: Record<string, GistFile>
}

const headers = (token: string): HeadersInit => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
})

type GistFile = { [FILE_NAME]: { content: string } }

const file = (state: GistState): GistFile => {
  const content = JSON.stringify(state, undefined, 2)
  return { [FILE_NAME]: { content } }
}

const body = (state: GistState): string => (JSON.stringify({
  description: 'GING Web App Data',
  public: false,
  files: file(state),
}))

const request = async (method: RequestInit['method'] = 'GET', url: string, token: string, state?: GistState): Promise<Response> => {
  const options: RequestInit = { method, headers: headers(token) }
  if (state) options.body = body(state)
  const request = await fetch(url, options)
  return request.json()
}

const create = async (state: GistState, token: string): Promise<Result> => {
  const response = await request('POST', API_URL, token, state)
  console.log('gist created', response)
  if (response.id) return { success: true, message: 'gist created', data: response.id }
  if (response.message) return { success: false, message: response.message }
  return { success: false, message: 'gist creation failed for an unknown reason' }
}

const update = async (state: GistState, token: string, id: string): Promise<Result> => {
  const response = await request('PATCH', `${API_URL}/${id}`, token, state)
  if (response.message) {
    console.warn('gist update failed', response, 'trying to create a new gist')
    return create(state, token)
  }
  return { success: true, message: 'gist updated', data: id }
}

const list = async (state: GistState, token: string): Promise<Result> => {
  console.log('listing gists to find a potential existing one')
  const response = await request('GET', API_URL, token)
  if (response.message) return { success: false, message: response.message }
  if (Array.isArray(response)) {
    const gist = (response as Response[]).find((gist) => (gist.files && gist.files[FILE_NAME]))
    return gist?.id ? update(state, token, gist.id) : create(state, token)
  }
  return { success: false, message: 'gist list failed for an unknown reason' }
}

/**
 * Persist state in a gist
 * @returns true if the state was persisted
 */
export const persist = async (reason = 'unknown', store: Store): Promise<Result> => {
  if (store.gistToken === '') return { success: false, message: 'Cannot save your work without a Gist token' }
  if (typeof window === 'undefined') return { success: true, message: `will persist to gist, cause : ${reason}` } // unit tests stop here
  /* c8 ignore next */
  return store.gistId.length > 0 ? update(store.gistState, store.gistToken, store.gistId) : list(store.gistState, store.gistToken)
}

export const debouncedPersist = debounce(persist, 1000)
