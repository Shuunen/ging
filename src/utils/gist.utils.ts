/* c8 ignore next */
import type { Endpoints } from '@octokit/types'
import { debounce } from 'shuutils'
import type { Project } from '../models/project.model'
import { logger } from './logger.utils'

const apiUrl = 'https://api.github.com/gists'
const debouncePersistDelay = 1000
const jsonSpaceIndent = 2
type Method = 'GET' | 'PATCH' | 'POST'

export type GistState = {
  isGistState: boolean
  projects: Project[]
}

export const fileName = 'ging.json'

export function headers(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  }
}

export function file(state: GistState) {
  const content = JSON.stringify(state, undefined, jsonSpaceIndent)
  return { [fileName]: { content } }
}

export function body(state: GistState) {
  return JSON.stringify({
    description: 'GING Web App Data',
    files: file(state),
    public: false,
  })
}

type FetchFunction = typeof globalThis.fetch

type RequestOptions = { fetch?: FetchFunction; method: Method; state?: GistState; token: string; url: string }

export async function request<Type>({ fetch = globalThis.fetch, method, state, token, url }: RequestOptions): Promise<Result<Type>> {
  const options: RequestInit = { headers: headers(token), method }
  if (state) options.body = body(state)
  const query = await fetch(url, options)
  const response = await query.json()
  if (response.message) return { message: response.message, success: false }
  return { data: response as Type, message: `${method} request on ${url} succeed`, success: true }
}

export async function create(state: GistState, token: string, fetch = globalThis.fetch) {
  const { data: gist, message, success } = await request<Endpoints['POST /gists']['response']['data']>({ fetch, method: 'POST', state, token, url: apiUrl })
  if (!success || gist?.id === undefined) return { message, success: false }
  return { data: gist.id, message: 'gist created', success: true }
}

type UpdateOptions = { fetch?: FetchFunction; id: string; state: GistState; token: string }

export async function update({ fetch = globalThis.fetch, id, state, token }: UpdateOptions) {
  const { data: gist, message, success } = await request<Endpoints['PATCH /gists/{gist_id}']['response']['data']>({ fetch, method: 'PATCH', state, token, url: `${apiUrl}/${id}` })
  if (!success || gist?.id === undefined) return { message, success: false }
  return { data: gist.id, message: 'gist updated', success: true }
}

type GetIdOptions = { fetch?: FetchFunction; gistId: string; gistState: GistState; gistToken: string }

export async function getId({ fetch = globalThis.fetch, gistId, gistState, gistToken }: GetIdOptions) {
  if (gistId) return { data: gistId, message: 'gist id already set', success: true }
  logger.debug('listing gists to find a potential existing one')
  const { data: gists, message, success } = await request<Endpoints['GET /gists']['response']['data']>({ fetch, method: 'GET', token: gistToken, url: apiUrl })
  if (!success || !gists) return { message, success: false }
  const target = gists.find(gist => gist.files[fileName])
  if (target) return { data: target.id, message: 'gist id found', success: true }
  return create(gistState, gistToken, fetch)
}

export async function read(id: string, token: string, fetch = globalThis.fetch) {
  const { data, message, success } = await request<Endpoints['GET /gists/{gist_id}']['response']['data']>({ fetch, method: 'GET', token, url: `${apiUrl}/${id}` })
  if (!success || !data) return { message, success: false }
  if (data.files?.[fileName]) {
    const content = String(data.files[fileName].content)
    const state = JSON.parse(content) as GistState
    return { data: state, message: 'gist read', success: true }
  }
  return { message: `gist read failed to find ${fileName}`, success: false }
}

/**
 * Persist state in a gist
 * @param options the persist options
 * @param options.reason the reason to persist the state
 * @param options.gistId the gist id
 * @param options.gistState the state to persist
 * @param options.gistToken the gist token
 * @param options.fetch the fetch function to use
 * @returns true if the state was persisted
 */
type PersistOptions = { fetch?: FetchFunction; gistId: string; gistState: GistState; gistToken: string; reason: string }

export async function persist({ fetch = globalThis.fetch, gistId, gistState, gistToken, reason }: PersistOptions) {
  logger.debug(`persisting state because ${reason}`)
  if (gistToken === '') return { message: 'Cannot save your work without a Gist token', success: false }
  const { data: id, message, success } = await getId({ fetch, gistId, gistState, gistToken })
  /* c8 ignore next */
  if (!success || id === undefined) return { data: undefined, message, success: false }
  return update({ fetch, id, state: gistState, token: gistToken })
}

export const debouncedPersist = debounce(persist, debouncePersistDelay)
