import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import router from "@/router/index";
import store from "@/store/index";
import { computed } from '@vue/composition-api';
import { createAcl, defineAclRules } from 'vue-simple-acl/dist/vue-simple-acl.vue2';

Vue.use(VueCompositionAPI);

const user = computed(() => store.state.authStore.auth.user);
const rules = () => defineAclRules((setRule) => {
    if (user.value != null && user.value.permission != null) {
        user.value.permission.forEach((permission) => {
            setRule(permission, () => true);
        })
    }
});


const simpleAcl = createAcl({
    user,
    rules,
    router,
    onDeniedRoute: '/Auth/Unauthorized'
});

export default simpleAcl;
