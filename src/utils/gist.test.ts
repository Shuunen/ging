/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { body, create, file, fileName, getId, headers, persist, read, request, update } from './gist.utils'
import { check } from './utils'

const token = 'aUnitTest_gist_token'
check('gist headers contains Accept', headers('').Accept, 'application/vnd.github+json')
check('gist headers contains Authorization', headers(token).Authorization, `Bearer ${token}`)

const gistStateA = { isGistState: true, projects: [] }
const fileA = file(gistStateA)
check('gist file contains FILE_NAME', fileA[fileName].content, JSON.stringify(gistStateA, undefined, 2))

check('gist body contains description', JSON.parse(body(gistStateA)).description, 'GING Web App Data')
check('gist body is not public', JSON.parse(body(gistStateA)).public, false)
check('gist body contains files', JSON.parse(body(gistStateA)).files, fileA)

const id = 'aUnitTest_gist_id'
const fetch = {
  fail: async (): Promise<Response> => ({ json: async () => ({ message: fetch.failMessage }) } as never),
  failMessage: 'a fake server error occurred',
  failReadEmpty: async (): Promise<Response> => ({ json: async () => (fetch.failReadEmptyContent) } as never),
  failReadEmptyContent: { files: {} },
  success: async (): Promise<Response> => ({ json: async () => (fetch.successContent) } as never),
  successContent: { id },
  successList: async (): Promise<Response> => ({ json: async () => (fetch.successListContent) } as never),
  successListContent: [{ files: { [fileName]: { content: JSON.stringify(gistStateA, undefined, 2) } }, id }],
  successListEmpty: async (): Promise<Response> => ({ json: async () => (fetch.successListEmptyContent) } as never),
  successListEmptyContent: [],
  successRead: async (): Promise<Response> => ({ json: async () => (fetch.successReadContent) } as never),
  successReadContent: { files: { [fileName]: { content: JSON.stringify(gistStateA, undefined, 2) } } },
}
check('gist request fails', request('GET', '/url/A', token, gistStateA, fetch.fail), { message: fetch.failMessage, success: false })
check('gist request success', request('GET', '/url/B', token, gistStateA, fetch.success), { data: fetch.successContent, message: 'GET request on /url/B succeed', success: true })

check('gist create fails', create(gistStateA, token, fetch.fail), { message: fetch.failMessage, success: false })
check('gist create success', create(gistStateA, token, fetch.success), { data: id, message: 'gist created', success: true })

check('gist update fails', update(gistStateA, token, id, fetch.fail), { message: fetch.failMessage, success: false })
check('gist update success', update(gistStateA, token, id, fetch.success), { data: id, message: 'gist updated', success: true })

check('gist getId fails', getId('', { isGistState: false, projects: [] }, '', fetch.fail), { message: fetch.failMessage, success: false })
check('gist getId success by finding an existing one', getId('', { isGistState: false, projects: [] }, '', fetch.successList), { data: id, message: 'gist id found', success: true })
// below check is tricky, because fetch stub is given to getId, create function will also use it, so fetch response will not be good for create, hence the success: false & message success ^^'
check('gist getId success by creating a new one', getId('', { isGistState: false, projects: [] }, '', fetch.successListEmpty), { message: 'POST request on https://api.github.com/gists succeed', success: false })
check('gist getId with an existing one', getId(id, { isGistState: false, projects: [] }, '', fetch.successList), { data: id, message: 'gist id already set', success: true })

check('gist read fails', read(id, token, fetch.fail), { message: fetch.failMessage, success: false })
check('gist read success', read(id, token, fetch.successRead), { data: gistStateA, message: 'gist read', success: true })
check('gist read fails with empty gist', read(id, token, fetch.failReadEmpty), { message: `gist read failed to find ${fileName}`, success: false })

check('gist persist fails with empty token', persist('reason B', '', { isGistState: false, projects: [] }, '', fetch.success), { message: 'Cannot save your work without a Gist token', success: false })
// same tricky check as above
check('gist persist update with a token', persist('reason C', '', { isGistState: false, projects: [] }, token, fetch.successList), { message: 'PATCH request on https://api.github.com/gists/aUnitTest_gist_id succeed', success: false })
