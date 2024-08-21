export const getters = {
  IDrawer(state) {
    return state.drawer
  }
}

export const setters = {
  IDrawer(state, value) {
    state.drawer = value
  }
}

export const state = () => ({
  drawer: true,
  miniVariant: false,
  clipped: true,
  fixed: false,
  title: ''
})

export const mutations = {
  Drawer(state) {
    state.drawer = !state.drawer
  },
  TouchDrawer(state, value) {
    state.drawer = value
  },
  Clipped(state) {
    state.clipped = !state.clipped
  },
  MiniVariant(state) {
    state.miniVariant = !state.miniVariant
  }
}

export const actions = {
  showSidebar({ commit }) {
    commit('Drawer')
  },
  touchSidebar({ commit }, value) {
    commit('TouchDrawer', value)
  },
  showMiniVariant({ commit }) {
    commit('')
  },
  showClipped({ commit }) {
    commit('Clipped')
  }
}

export const Sidebar = {
  namespaced: true,
  actions,
  getters,
  state,
  mutations
}
