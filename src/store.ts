import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

export const store = createStore<State>({
  state () {
    return {
      projects: [],
    }
  },
  getters: {},
  mutations: {
    // increment (state) {
    //   state.count++
    // },
  },
  actions: {},
  modules: {},
  /* c8 ignore next */
  plugins: process.browser ? [(new VuexPersistence({ storage: window.localStorage })).plugin] : [],
})
