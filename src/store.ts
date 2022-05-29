import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({ storage: window.localStorage })

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
  plugins: [vuexLocal.plugin],
})
