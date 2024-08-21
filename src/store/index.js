import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import {authStore} from "@/store/authStore";
import {Sidebar} from "@/store/Sidebar";
import {SnackbarStore} from "@/store/SnackbarStore";
import {khaoSatStore} from "@/store/khaoSatStore";
import {fileStore} from "@/store/fileStore";

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        authStore,
        Sidebar,
        SnackbarStore,
        khaoSatStore,
        fileStore
    },
    plugins: [createPersistedState({
        key: 'codebase',
        paths: ['authStore','Sidebar']
    })],
    strict : false
})
export default store
