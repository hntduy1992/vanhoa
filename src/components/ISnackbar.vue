<template>
  <v-snackbar v-model="showSnackbar" :timeout="4500" :color="color" top right>
    <div v-html="message" />
    <template #action="{ attrs }">
      <v-btn text v-bind="attrs" @click="close">
        Đóng
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showSnackbar: false,
      color: 'black',
      message: ''
    }
  },
  computed: {
    ...mapState('SnackbarStore', ['snackbar'])
  },
  watch: {
    snackbar(showSnackbar) {
      this.showSnackbar = showSnackbar.active
      this.color = showSnackbar.color
      this.message = showSnackbar.message
    }
  },
  methods: {
    close() {
      this.showSnackbar = false
    }
  }
}
</script>

<style scoped>

</style>
