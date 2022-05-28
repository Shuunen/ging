import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { store } from '../src/store'

test('store contains an empty array of projects', () => {
  equal(store.state.projects, [])
})

test.run()
