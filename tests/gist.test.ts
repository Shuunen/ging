import { body, create, file, fileName, getId, headers, persist, read, request, update } from '../src/utils/gist.utils'

const token = 'aUnitTest_gist_token'
const id = 'aUnitTest_gist_id'
const gistStateA = { isGistState: true, projects: [] }
const emptyState = { isGistState: false, projects: [] }
const fileA = file(gistStateA)
const gistContent = JSON.stringify(gistStateA, undefined, 2)

/**
 * Build a fetch stub resolving with the given json payload
 * @param payload the json payload to resolve with
 * @returns a fetch-like function
 */
function stubFetch(payload: unknown) {
  return (): Promise<Response> => Promise.resolve({ json: () => Promise.resolve(payload) } as never)
}

const failMessage = 'a fake server error occurred'
const fetchStub = {
  fail: stubFetch({ message: failMessage }),
  failReadEmpty: stubFetch({ files: {} }),
  success: stubFetch({ id }),
  successList: stubFetch([{ files: { [fileName]: { content: gistContent } }, id }]),
  successListEmpty: stubFetch([]),
  successRead: stubFetch({ files: { [fileName]: { content: gistContent } } }),
}

describe('gist headers', () => {
  test('contains Accept', () => {
    expect(headers('').Accept).toBe('application/vnd.github+json')
  })

  test('contains Authorization', () => {
    expect(headers(token).Authorization).toBe(`Bearer ${token}`)
  })
})

describe('gist file', () => {
  test('contains the serialized state', () => {
    expect(fileA[fileName]?.content).toBe(gistContent)
  })
})

describe('gist body', () => {
  const parsed = JSON.parse(body(gistStateA)) as { description: string; files: unknown; public: boolean }

  test('contains description', () => {
    expect(parsed.description).toBe('GING Web App Data')
  })

  test('is not public', () => {
    expect(parsed.public).toBe(false)
  })

  test('contains files', () => {
    expect(parsed.files).toStrictEqual(fileA)
  })
})

describe('gist request', () => {
  test('fails', async () => {
    await expect(request({ fetch: fetchStub.fail, method: 'GET', state: gistStateA, token, url: '/url/A' })).resolves.toStrictEqual({ message: failMessage, success: false })
  })

  test('succeeds', async () => {
    await expect(request({ fetch: fetchStub.success, method: 'GET', state: gistStateA, token, url: '/url/B' })).resolves.toStrictEqual({ data: { id }, message: 'GET request on /url/B succeed', success: true })
  })
})

describe('gist create', () => {
  test('fails', async () => {
    await expect(create(gistStateA, token, fetchStub.fail)).resolves.toStrictEqual({ message: failMessage, success: false })
  })

  test('succeeds', async () => {
    await expect(create(gistStateA, token, fetchStub.success)).resolves.toStrictEqual({ data: id, message: 'gist created', success: true })
  })
})

describe('gist update', () => {
  test('fails', async () => {
    await expect(update({ fetch: fetchStub.fail, id, state: gistStateA, token })).resolves.toStrictEqual({ message: failMessage, success: false })
  })

  test('succeeds', async () => {
    await expect(update({ fetch: fetchStub.success, id, state: gistStateA, token })).resolves.toStrictEqual({ data: id, message: 'gist updated', success: true })
  })
})

describe('gist getId', () => {
  test('fails', async () => {
    await expect(getId({ fetch: fetchStub.fail, gistId: '', gistState: emptyState, gistToken: '' })).resolves.toStrictEqual({ message: failMessage, success: false })
  })

  test('finds an existing gist', async () => {
    await expect(getId({ fetch: fetchStub.successList, gistId: '', gistState: emptyState, gistToken: '' })).resolves.toStrictEqual({ data: id, message: 'gist id found', success: true })
  })

  // the same fetch stub is given to getId and used by create, so its response does not fit create, hence success: false
  test('creates a new gist when none exists', async () => {
    await expect(getId({ fetch: fetchStub.successListEmpty, gistId: '', gistState: emptyState, gistToken: '' })).resolves.toStrictEqual({ message: 'POST request on https://api.github.com/gists succeed', success: false })
  })

  test('keeps an already set id', async () => {
    await expect(getId({ fetch: fetchStub.successList, gistId: id, gistState: emptyState, gistToken: '' })).resolves.toStrictEqual({ data: id, message: 'gist id already set', success: true })
  })
})

describe('gist read', () => {
  test('fails', async () => {
    await expect(read(id, token, fetchStub.fail)).resolves.toStrictEqual({ message: failMessage, success: false })
  })

  test('succeeds', async () => {
    await expect(read(id, token, fetchStub.successRead)).resolves.toStrictEqual({ data: gistStateA, message: 'gist read', success: true })
  })

  test('fails with an empty gist', async () => {
    await expect(read(id, token, fetchStub.failReadEmpty)).resolves.toStrictEqual({ message: `gist read failed to find ${fileName}`, success: false })
  })
})

describe('gist persist', () => {
  test('fails with an empty token', async () => {
    await expect(persist({ fetch: fetchStub.success, gistId: '', gistState: emptyState, gistToken: '', reason: 'reason B' })).resolves.toStrictEqual({ message: 'Cannot save your work without a Gist token', success: false })
  })

  // same fetch stub caveat as getId above
  test('updates with a token', async () => {
    await expect(persist({ fetch: fetchStub.successList, gistId: '', gistState: emptyState, gistToken: token, reason: 'reason C' })).resolves.toStrictEqual({
      message: 'PATCH request on https://api.github.com/gists/aUnitTest_gist_id succeed',
      success: false,
    })
  })
})
