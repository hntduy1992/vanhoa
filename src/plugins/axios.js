"use strict";

import Vue from 'vue';
import axios from "axios";
import store from "@/store";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    baseURL: process.env.VUE_APP_API_URL
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        config.baseURL = process.env.VUE_APP_API_URL
        config.headers.common.Accept = 'application/json';
        config.headers.common['Access-Control-Allow-Origin'] = '*';
        config.headers.Authorization = "Bearer " + store.state.authStore.auth.accessToken;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        // Do something with response data
        if (response.status === 401) {
            window.location.href = '/Auth'
        }
        if (response.status === 403) {
            window.location.href = '/Auth/Unauthorized'
        }
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

// eslint-disable-next-line no-unused-vars
Plugin.install = function (Vue, options) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios;
            }
        },
        $axios: {
            get() {
                return _axios;
            }
        },
    });
};

Vue.use(Plugin)

export default Plugin;
