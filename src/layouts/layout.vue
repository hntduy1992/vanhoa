<template>
  <v-app dark>
    <ISidebar />
    <IAppbar />
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <ISnackbar />
  </v-app>
</template>

<script>
import ISidebar from "@/components/ISidebar";
import ISnackbar from "@/components/ISnackbar";
import IAppbar from "@/components/IAppbar";
export default {
  name: 'layout-vuetify',
  components: {
    IAppbar,
    ISidebar,
    ISnackbar
  },
  data() {
    return {
      fixed: true
    }
  },
  created() {
  }
}
</script>
