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
    addProject (state, project: Project) {
      state.projects.push(project)
    },
  },
  actions: {},
  modules: {},
  plugins: [vuexLocal.plugin],
})
