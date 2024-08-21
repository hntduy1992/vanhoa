export const getters = {
    bangDiem(state) {
        return state.bangDiem
    },
    bangDiemCauHoi(state) {
        return state.bangDiemCauHoi
    },
    bangDiemTong(state) {
        return state.bangDiemTong
    },
    cauHoi(state) {
        return state.cauHoi
    },
    eventChange(state) {
        return state.eventChange
    }
}

export const state = () => ({
    bangDiem: [],
    bangDiemCauHoi: [],
    bangDiemTong: [],
    cauHoi: [],
    eventChange: {},
    disableTuDanhGia: true,
    disableThamDinh: true,
    permissions: [],
    disableYKien: false,
    bangYKien: [],
    capNhatFileDanhGia: []
})

export const mutations = {
    bangDiem(state, items) {
        state.bangDiem = items
    },
    bangYKien(state, item) {
        const yKien = state.bangYKien.find((value) => value.id === item.id);
        if (yKien) {
            Object.assign(yKien, item);
        } else {
            //var json = JSON.stringify(state.bangYKien);
            state.bangYKien.push(item);
        }
    },
    capNhatBangDiem(state, item) {
        state.bangDiem.splice(item.index, 1, item.value)
    },
    capNhatFile(state, item) {
        state.capNhatFileDanhGia.push(item)
    },
    bangDiemCauHoi(state, items) {
        state.bangDiemCauHoi = items
    },
    bangDiemTong(state, items) {
        state.bangDiemTong = items
    },
    cauHoi(state, items) {
        state.cauHoi = items
    },
    eventChange(state, item) {
        state.eventChange = item
    },
    kiemTraTuDanhGia(state, item) {
        state.disableTuDanhGia = item
    },
    kiemTraThamDinh(state, item) {
        state.disableThamDinh = item
    },
    kiemTraYKien(state, item) {
        state.disableYKien = item
    },
    permissions(state, item) {
        state.permissions = item
    }
}

export const actions = {
    capNhatBangDiem({commit, dispatch}, item) {
        commit('capNhatBangDiem', item)
        dispatch('capNhatDiemCapTren', item.value)
    },
    // eslint-disable-next-line no-unused-vars
    capNhatDiemCapTren({commit, state, dispatch}, item) {
        const findChildren = state.cauHoi.filter(a => a.parentId === item?.parentId)
        let diemTuDanhGia = 0
        let diemThamdinh = 0
        findChildren.forEach((a) => {
            if (a.maCauHoi === item.maCauHoi) {
                a.diemThamDinh = item.diemThamDinh
                a.diem = item.diem
            }
            diemThamdinh += a.diemThamDinh
            diemTuDanhGia += a.diem
        })
        const parent = state.cauHoi.find(a => a.maCauHoi === item?.parentId)
        if (parent) {
            parent.diemThamDinh = diemThamdinh
            parent.diem = diemTuDanhGia
            if (parent.parentId > 0) {
                dispatch('capNhatDiemCapTren', parent)
            }
        }
    }
}

export const khaoSatStore = {
    namespaced: true,
    actions,
    getters,
    state,
    mutations
}
