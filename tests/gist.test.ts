/* eslint-disable total-functions/no-unsafe-readonly-mutable-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { State, Store } from '@/store'
import { body, create, file, fileName, getId, headers, persist, read, request, update } from '@/utils/gist'
import { check } from './utils'

const token = 'aUnitTest_gist_token'
check('gist headers contains Accept', headers('').Accept, 'application/vnd.github+json')
check('gist headers contains Authorization', headers(token).Authorization, `Bearer ${token}`)

const gistStateA = { projects: [], isGistState: true }
const fileA = file(gistStateA)
check('gist file contains FILE_NAME', fileA[fileName].content, JSON.stringify(gistStateA, undefined, 2))

check('gist body contains description', JSON.parse(body(gistStateA)).description, 'GING Web App Data')
check('gist body is not public', JSON.parse(body(gistStateA)).public, false)
check('gist body contains files', JSON.parse(body(gistStateA)).files, fileA)

const id = 'aUnitTest_gist_id'
// eslint-disable-next-line @typescript-eslint/no-shadow
const fetch = {
  fail: async (): Promise<Response> => ({ json: async () => ({ message: fetch.failMessage }) } as never),
  failMessage: 'a fake server error occurred',
  failReadEmpty: async (): Promise<Response> => ({ json: async () => (fetch.failReadEmptyContent) } as never),
  failReadEmptyContent: { files: {} },
  success: async (): Promise<Response> => ({ json: async () => (fetch.successContent) } as never),
  successContent: { id },
  successList: async (): Promise<Response> => ({ json: async () => (fetch.successListContent) } as never),
  successListContent: [{ id, files: { [fileName]: { content: JSON.stringify(gistStateA, undefined, 2) } } }],
  successListEmpty: async (): Promise<Response> => ({ json: async () => (fetch.successListEmptyContent) } as never),
  successListEmptyContent: [],
  successRead: async (): Promise<Response> => ({ json: async () => (fetch.successReadContent) } as never),
  successReadContent: { files: { [fileName]: { content: JSON.stringify(gistStateA, undefined, 2) } } },
}
check('gist request fails', request('GET', '/url/A', token, gistStateA, fetch.fail), { success: false, message: fetch.failMessage })
check('gist request success', request('GET', '/url/B', token, gistStateA, fetch.success), { success: true, message: 'GET request on /url/B succeed', data: fetch.successContent })

check('gist create fails', create(gistStateA, token, fetch.fail), { success: false, message: fetch.failMessage })
check('gist create success', create(gistStateA, token, fetch.success), { success: true, message: 'gist created', data: id })

check('gist update fails', update(gistStateA, token, id, fetch.fail), { success: false, message: fetch.failMessage })
check('gist update success', update(gistStateA, token, id, fetch.success), { success: true, message: 'gist updated', data: id })

const stateA = {} as State
check('gist getId fails', getId(stateA, fetch.fail), { success: false, message: fetch.failMessage })
check('gist getId success by finding an existing one', getId(stateA, fetch.successList), { success: true, message: 'gist id found', data: id })
// below check is tricky, because fetch stub is given to getId, create function will also use it, so fetch response will not be good for create, hence the success: false & message success ^^'
check('gist getId success by creating a new one', getId(stateA, fetch.successListEmpty), { success: false, message: 'POST request on https://api.github.com/gists succeed' })
const stateB = { gistId: id } as State
check('gist getId with an existing one', getId(stateB, fetch.successList), { success: true, message: 'gist id already set', data: id })

check('gist read fails', read(id, token, fetch.fail), { success: false, message: fetch.failMessage })
check('gist read success', read(id, token, fetch.successRead), { success: true, message: 'gist read', data: gistStateA })
check('gist read fails with empty gist', read(id, token, fetch.failReadEmpty), { success: false, message: `gist read failed to find ${fileName}` })

const storeA = {} as Store
check('gist persist fails', persist('reason A', storeA, fetch.fail), { success: false, message: fetch.failMessage })
const storeB = { gistToken: '' } as Store
check('gist persist fails with empty token', persist('reason B', storeB, fetch.success), { success: false, message: 'Cannot save your work without a Gist token' })
const storeC = { gistToken: token } as Store
// same tricky check as above
check('gist persist update with a token', persist('reason C', storeC, fetch.successList), { success: false, message: 'PATCH request on https://api.github.com/gists/aUnitTest_gist_id succeed' })
