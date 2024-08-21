import { snackbarModel } from '@/models/snackbarModel'

export const getters = {
  iSnackbar(state) {
    return state.snackbar
  }
}
export const state = () => ({
  snackbar: {}
})

export const mutations = {
  ShowSnackbar(state, item) {
    state.snackbar = item
  }
}

export const actions = {
  showSnackBar({ commit }, item) {
    commit('ShowSnackbar', snackbarModel.fromJson(item))
  }
}

export const SnackbarStore = {
  namespaced: true,
  actions,
  getters,
  state,
  mutations
}
