<template>
  <v-app dark>
    <v-main>
      <div class="my-7 pt-7">
        <v-container>
          <slot />
        </v-container>
      </div>
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
import ISnackbar from "@/components/ISnackbar";

export default {
  name: 'layout-auth',
  components: {
    ISnackbar
  },
  data() {
    return {
      fixed: true
    }
  }
}
</script>

<style lang="scss">
  #app {
    background: #f8f8fb !important;
  }
</style>
