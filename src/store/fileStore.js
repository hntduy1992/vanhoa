import axios from 'axios'
const actions = {
  // eslint-disable-next-line no-unused-vars
  upload({ commit }, item) {
    return axios.post('auth/file-manager/singleUpload', item, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
}

export const fileStore = {
  namespaced: true,
  actions
}
