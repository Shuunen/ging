/* c8 ignore next */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Endpoints } from '@octokit/types'
import { debounce } from 'shuutils'
import type { Project } from '../models/project.model'
import { logger } from './logger.utils'

const apiUrl = 'https://api.github.com/gists'
const debouncePersistDelay = 1000
const jsonSpaceIndent = 2
type Method = 'GET' | 'PATCH' | 'POST'

export interface GistState {
  isGistState: boolean
  projects: Project[]
}

export const fileName = 'ging.json'

export function headers (token: string) {
  return ({
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  })
}

export function file (state: GistState) {
  const content = JSON.stringify(state, undefined, jsonSpaceIndent)
  return { [fileName]: { content } }
}

export function body (state: GistState) {
  return (JSON.stringify({
    description: 'GING Web App Data',
    files: file(state),
    public: false,
  }))
}

// eslint-disable-next-line @typescript-eslint/max-params, no-restricted-syntax
export async function request<Type> (method: Method, url: string, token: string, state?: GistState, fetch = window.fetch): Promise<Result<Type>> {
  const options: RequestInit = { headers: headers(token), method }
  if (state) options.body = body(state)
  const query = await fetch(url, options)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await query.json()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/strict-boolean-expressions
  if (response.message) return { message: response.message, success: false }
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return { data: response as Type, message: `${String(method)} request on ${url} succeed`, success: true }
}

export async function create (state: GistState, token: string, fetch = window.fetch) {
  const { data: gist, message, success } = await request<Endpoints['POST /gists']['response']['data']>('POST', apiUrl, token, state, fetch)
  if (!success || gist?.id === undefined) return { message, success: false }
  return { data: gist.id, message: 'gist created', success: true }
}

// eslint-disable-next-line @typescript-eslint/max-params
export async function update (state: GistState, token: string, id: string, fetch = window.fetch) {
  const { data: gist, message, success } = await request<Endpoints['PATCH /gists/{gist_id}']['response']['data']>('PATCH', `${apiUrl}/${id}`, token, state, fetch)
  if (!success || gist?.id === undefined) return { message, success: false }
  return { data: gist.id, message: 'gist updated', success: true }
}

// eslint-disable-next-line @typescript-eslint/max-params
export async function getId (gistId: string, gistState: GistState, gistToken: string, fetch = window.fetch) {
  if (gistId) return { data: gistId, message: 'gist id already set', success: true }
  logger.debug('listing gists to find a potential existing one')
  const { data: gists, message, success } = await request<Endpoints['GET /gists']['response']['data']>('GET', apiUrl, gistToken, undefined, fetch)
  if (!success || !gists) return { message, success: false }
  const target = gists.find(gist => gist.files[fileName])
  if (target) return { data: target.id, message: 'gist id found', success: true }
  return create(gistState, gistToken, fetch)
}

export async function read (id: string, token: string, fetch = window.fetch) {
  const { data, message, success } = await request<Endpoints['GET /gists/{gist_id}']['response']['data']>('GET', `${apiUrl}/${id}`, token, undefined, fetch)
  if (!success || !data) return { message, success: false }
  if (data.files?.[fileName]) {
    const content = String(data.files[fileName].content)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const state = JSON.parse(content) as GistState
    return { data: state, message: 'gist read', success: true }
  }
  return { message: `gist read failed to find ${fileName}`, success: false }
}

/**
 * Persist state in a gist
 * @param reason the reason to persist the state
 * @param gistId the gist id
 * @param gistState the state to persist
 * @param gistToken the gist token
 * @param fetch the fetch function to use
 * @returns true if the state was persisted
 */
// eslint-disable-next-line @typescript-eslint/max-params
export async function persist (reason: string, gistId: string, gistState: GistState, gistToken: string, fetch = window.fetch) {
  logger.debug(`persisting state because ${reason}`)
  if (gistToken === '') return { message: 'Cannot save your work without a Gist token', success: false }
  const { data: id, message, success } = await getId(gistId, gistState, gistToken, fetch)
  /* c8 ignore next */
  if (!success || id === undefined) return { data: undefined, message, success: false }
  return update(gistState, gistToken, id, fetch)
}

export const debouncedPersist = debounce(persist, debouncePersistDelay)

