import Vue from 'vue'
import './plugins/axios'
import './plugins/vee-validate'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import acl from './plugins/acl'
import VueMeta from 'vue-meta'

import './style.css'


Vue.config.productionTip = false

Vue.use(acl);

Vue.use(VueMeta, {
    // optional pluginOptions
    refreshOnceOnNavigation: true
})

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
