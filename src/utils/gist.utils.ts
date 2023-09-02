/* c8 ignore next */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Project } from '@/models/project.model'
import type { Endpoints } from '@octokit/types'
import { debounce } from 'shuutils'
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

export function headers (token: string): { Accept: string; Authorization: string } {
  return ({
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  })
}

export function file (state: GistState): { [fileName]: { content: string } } {
  const content = JSON.stringify(state, undefined, jsonSpaceIndent)
  return { [fileName]: { content } }
}

export function body (state: GistState): string {
  return (JSON.stringify({
    description: 'GING Web App Data',
    public: false,
    files: file(state),
  }))
}

// eslint-disable-next-line max-params, etc/no-misused-generics, @typescript-eslint/no-shadow
export async function request<Type> (method: Method, url: string, token: string, state?: GistState, fetch = window.fetch): Promise<Result<Type>> {
  const options: RequestInit = { method, headers: headers(token) }
  if (state) options.body = body(state)
  const query = await fetch(url, options)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await query.json()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/strict-boolean-expressions
  if (response.message) return { success: false, message: response.message }
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return { success: true, message: `${String(method)} request on ${url} succeed`, data: response as Type }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export async function create (state: GistState, token: string, fetch = window.fetch): Promise<Result> {
  const { success, message, data: gist } = await request<Endpoints['POST /gists']['response']['data']>('POST', apiUrl, token, state, fetch)
  if (!success || gist?.id === undefined) return { success: false, message }
  return { success: true, message: 'gist created', data: gist.id }
}

// eslint-disable-next-line @typescript-eslint/no-shadow, max-params
export async function update (state: GistState, token: string, id: string, fetch = window.fetch): Promise<Result> {
  const { success, message, data: gist } = await request<Endpoints['PATCH /gists/{gist_id}']['response']['data']>('PATCH', `${apiUrl}/${id}`, token, state, fetch)
  if (!success || gist?.id === undefined) return { success: false, message }
  return { success: true, message: 'gist updated', data: gist.id }
}

// eslint-disable-next-line @typescript-eslint/no-shadow, max-params
export async function getId (gistId: string, gistState: GistState, gistToken: string, fetch = window.fetch): Promise<Result> {
  if (gistId) return { success: true, message: 'gist id already set', data: gistId }
  logger.debug('listing gists to find a potential existing one')
  const { success, message, data: gists } = await request<Endpoints['GET /gists']['response']['data']>('GET', apiUrl, gistToken, undefined, fetch)
  if (!success || !gists) return { success: false, message }
  const target = gists.find(gist => gist.files[fileName])
  if (target) return { success: true, message: 'gist id found', data: target.id }
  return await create(gistState, gistToken, fetch)
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export async function read (id: string, token: string, fetch = window.fetch): Promise<Result<GistState>> {
  const { success, message, data } = await request<Endpoints['GET /gists/{gist_id}']['response']['data']>('GET', `${apiUrl}/${id}`, token, undefined, fetch)
  if (!success || !data) return { success: false, message }
  if (data.files?.[fileName]) {
    const content = String(data.files[fileName].content)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const state = JSON.parse(content) as GistState
    return { success: true, message: 'gist read', data: state }
  }
  return { success: false, message: `gist read failed to find ${fileName}` }
}

/**
 * Persist state in a gist
 * @returns true if the state was persisted
 */
// eslint-disable-next-line @typescript-eslint/no-shadow, max-params
export async function persist (reason: string, gistId: string, gistState: GistState, gistToken: string, fetch = window.fetch): Promise<Result> {
  logger.debug(`persisting state because ${reason}`)
  if (gistToken === '') return { success: false, message: 'Cannot save your work without a Gist token' }
  const { success, message, data: id } = await getId(gistId, gistState, gistToken, fetch)
  /* c8 ignore next */
  if (!success || id === undefined) return { success: false, message }
  return await update(gistState, gistToken, id, fetch)
}

export const debouncedPersist = debounce(persist, debouncePersistDelay)

