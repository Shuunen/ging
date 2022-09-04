import type { Project } from '@/models'
import type { State, Store } from '@/store'
import type { Endpoints } from '@octokit/types'
import { debounce } from 'shuutils'

export interface GistState {
  projects: Project[],
  isGistState: boolean,
}

const API_URL = 'https://api.github.com/gists'
const FILE_NAME = 'ging.json'

const headers = (token: string): HeadersInit => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
})

const file = (state: GistState): { [FILE_NAME]: { content: string } } => {
  const content = JSON.stringify(state, undefined, 2)
  return { [FILE_NAME]: { content } }
}

const body = (state: GistState): string => (JSON.stringify({
  description: 'GING Web App Data',
  public: false,
  files: file(state),
}))

const request = async <T> (method: RequestInit['method'] = 'GET', url: string, token: string, state?: GistState): Promise<Result<T>> => {
  const options: RequestInit = { method, headers: headers(token) }
  if (state) options.body = body(state)
  const request = await fetch(url, options)
  const response = await request.json()
  if (response.message) return { success: false, message: response.message }
  return { success: true, message: `${method} request on ${url} succeed`, data: response as T }
}

const create = async (state: GistState, token: string): Promise<Result> => {
  const { success, message, data: gist } = await request<Endpoints['POST /gists']['response']['data']>('POST', API_URL, token, state)
  if (!success || !gist || !gist.id) return { success, message }
  console.log('gist created', { gist })
  if (gist.id) return { success: true, message: 'gist created', data: gist.id }
  return { success: false, message: 'gist create failed' }
}

const update = async (state: GistState, token: string, id: string): Promise<Result> => {
  const { success, message, data: gist } = await request<Endpoints['PATCH /gists/{gist_id}']['response']['data']>('PATCH', `${API_URL}/${id}`, token, state)
  if (!success || !gist || !gist.id) return { success, message }
  return { success: true, message: 'gist updated', data: gist.id }
}

export const getId = async (state: State): Promise<Result> => {
  if (state.gistId) return { success: true, message: 'gist id already set', data: state.gistId }
  console.log('listing gists to find a potential existing one')
  const { success, message, data: gists } = await request<Endpoints['GET /gists']['response']['data']>('GET', API_URL, state.gistToken)
  if (!success || !gists) return { success, message }
  const gist = gists.find(gist => gist.files[FILE_NAME])
  if (gist?.id) return { success: true, message: 'gist found', data: gist.id }
  return create(state.gistState, state.gistToken)
}

export const read = async (id: string, token: string): Promise<Result<GistState>> => {
  const { success, message, data } = await request<Endpoints['GET /gists/{gist_id}']['response']['data']>('GET', `${API_URL}/${id}`, token)
  if (!success || !data) return { success, message }
  if (data.files && data.files[FILE_NAME]) {
    const content = String(data.files[FILE_NAME].content)
    const state = JSON.parse(content) as GistState
    return { success: true, message: 'gist read', data: state }
  }
  return { success: false, message: 'gist read failed to find ' + FILE_NAME }
}

/**
 * Persist state in a gist
 * @returns true if the state was persisted
 */
export const persist = async (reason = 'unknown', store: Store): Promise<Result> => {
  if (store.gistToken === '') return { success: false, message: 'Cannot save your work without a Gist token' }
  if (typeof window === 'undefined') return { success: true, message: `will persist to gist, cause : ${reason}` } // unit tests stop here
  /* c8 ignore next */
  const { success, message, data: id } = await getId(store)
  if (!success) return { success, message }
  if (id) return update(store.gistState, store.gistToken, id)
  return { success: false, message: 'unknown persist error' }
}

export const debouncedPersist = debounce(persist, 1000)
