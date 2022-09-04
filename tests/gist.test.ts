import { check } from 'shuutils'

// const state = copy(initialState)
// const stateCopy = copy(state)
// const gistState = { projects: [{ id: 42, title: 'the best', steps: [] }], isGistState: true }
// const setGistId = (id: string):void => console.log('setGistId', id)
// check('gist persist A : initial state is persisted', persist('reason A', state, gistState, setGistId).success, true)
// check('gist persist B : state is not modified by reference', state, stateCopy)
// check('gist persist C : state is not persisted if not modified', persist('reason C', state, gistState).success, false)
// state.age = 13 // tempting but this will break above tests ^^'
// check('gist persist D : state is modified and should be persisted', persist('reason D', { name: 'John Doe', age: 13 }), true)
// check('gist persist E : state is not persisted if useless key is modified', persist('reason E', { name: 'John Doe', age: 13, activeProjectIndex: 42 }), false)

check.run()
