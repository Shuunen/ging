import { objectSum } from '@/utils/object'
import { check, checksRun } from 'shuutils'

const recordA = { projects: [{ id: 1, title: 'a' }, { id: 2, title: 'b' }] }
const recordACopy = { projects: [{ id: 1, title: 'a' }, { id: 2, title: 'b' }] }
check('objectSum default ECMAScript behavior : recordA === recordACopy is false', recordA === recordACopy, false)
check('objectSum default ECMAScript behavior : recordA == recordACopy is false', recordA == recordACopy, false)
check('objectSum A === Abis', objectSum(recordA) === objectSum(recordACopy), true)
check('objectSum A', objectSum(recordA), '155318365220868513741837943954')

const recordASortedDifferently = { projects: [{ id: 2, title: 'b' }, { id: 1, title: 'a' }] }
check('objectSum A !== ASortedDifferently', objectSum(recordA) !== objectSum(recordASortedDifferently), true)

const recordAKeysSortedDifferently = { projects: [{ title: 'a', id: 1 }, { title: 'b', id: 2 }] }
check('objectSum A !== AKeysSortedDifferently', objectSum(recordA) !== objectSum(recordAKeysSortedDifferently), true)

const recordB = { projects: [{ id: 1, title: 'a' }, { id: 2, title: 'b' }], other: 'value' }
check('objectSum A !== B', objectSum(recordA) !== objectSum(recordB), true)

checksRun()
