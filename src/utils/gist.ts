/* c8 ignore next */
import type { Project } from '@/models'
import type { State, Store } from '@/store'
import type { Endpoints } from '@octokit/types'
import { debounce } from 'shuutils'

export interface GistState {
  projects: Project[],
  isGistState: boolean,
}

const API_URL = 'https://api.github.com/gists'

export const FILE_NAME = 'ging.json'

export const headers = (token: string): { Accept: string; Authorization: string } => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
})

export const file = (state: GistState): { [FILE_NAME]: { content: string } } => {
  const content = JSON.stringify(state, undefined, 2)
  return { [FILE_NAME]: { content } }
}

export const body = (state: GistState): string => (JSON.stringify({
  description: 'GING Web App Data',
  public: false,
  files: file(state),
}))

export const request = async <T> (method: RequestInit['method'] = 'GET', url: string, token: string, state?: GistState, fetch = window.fetch): Promise<Result<T>> => {
  const options: RequestInit = { method, headers: headers(token) }
  if (state) options.body = body(state)
  const request = await fetch(url, options)
  const response = await request.json()
  if (response.message) return { success: false, message: response.message }
  return { success: true, message: `${method} request on ${url} succeed`, data: response as T }
}

export const create = async (state: GistState, token: string, fetch = window.fetch): Promise<Result> => {
  const { success, message, data: gist } = await request<Endpoints['POST /gists']['response']['data']>('POST', API_URL, token, state, fetch)
  if (!success || !gist || gist.id === undefined) return { success: false, message }
  return { success: true, message: 'gist created', data: gist.id }
}

export const update = async (state: GistState, token: string, id: string, fetch = window.fetch): Promise<Result> => {
  const { success, message, data: gist } = await request<Endpoints['PATCH /gists/{gist_id}']['response']['data']>('PATCH', `${API_URL}/${id}`, token, state, fetch)
  if (!success || !gist || !gist.id) return { success: false, message }
  return { success: true, message: 'gist updated', data: gist.id }
}

export const getId = async (state: State, fetch = window.fetch): Promise<Result> => {
  if (state.gistId) return { success: true, message: 'gist id already set', data: state.gistId }
  console.log('listing gists to find a potential existing one')
  const { success, message, data: gists } = await request<Endpoints['GET /gists']['response']['data']>('GET', API_URL, state.gistToken, undefined, fetch)
  if (!success || !gists) return { success: false, message }
  const gist = gists.find(gist => gist.files[FILE_NAME])
  if (gist) return { success: true, message: 'gist id found', data: gist.id }
  return create(state.gistState, state.gistToken, fetch)
}

export const read = async (id: string, token: string, fetch = window.fetch): Promise<Result<GistState>> => {
  const { success, message, data } = await request<Endpoints['GET /gists/{gist_id}']['response']['data']>('GET', `${API_URL}/${id}`, token, undefined, fetch)
  if (!success || !data) return { success: false, message }
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
export const persist = async (_reason = 'unknown', store: Store, fetch = window.fetch): Promise<Result> => {
  if (store.gistToken === '') return { success: false, message: 'Cannot save your work without a Gist token' }
  const { success, message, data: id } = await getId(store, fetch)
  if (!success || id === undefined) return { success: false, message }
  return update(store.gistState, store.gistToken, id, fetch)
}

export const debouncedPersist = debounce(persist, 1000)
