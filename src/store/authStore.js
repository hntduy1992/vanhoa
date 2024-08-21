
const getters = {
  auth(state) {
    return state.auth
  }
}

const state = () => ({
  auth: {}
})

const mutations = {
  auth(state, item) {
    state.auth = item
  },
  update(state, user) {
    const item = state.auth.user
    Object.assign(item, user);
  },
  cleaAuth(state) {
    state.auth = {}
  }
}

const actions = {
  // eslint-disable-next-line require-await
  async logout({ commit }) {
    commit('cleaAuth')
    window.location.href = '/Auth'
  },
  async auth({ commit }, item) {
    await commit('auth', item)
  }
}

export const authStore = {
  namespaced: true,
  actions,
  getters,
  state,
  mutations
}
