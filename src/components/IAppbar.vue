<template>
  <v-app-bar
    :clipped-left="clipped"
    fixed
    app
    color="#4076b4"
    dark
    elevation="0"
  >
    <v-app-bar-nav-icon @click.stop="showSidebar" />
    <v-toolbar-title v-text="title" />
    <v-spacer />
    <BarUserMenu />
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BarUserMenu from "@/components/BarUserMenu";

export default {
  name: 'IAppbar',
  components: {BarUserMenu},
  data() {
    return {
      title: 'CHẤM ĐIỂM VĂN HÓA XÃ PHƯỜNG - TP. SA ĐÉC'
    }
  },
  computed: {
    ...mapState('Sidebar', ['clipped', 'miniVariant'])
  },
  methods: {
    ...mapActions('Sidebar', ['showClipped', 'showClipped', 'showSidebar'])
  }
}
</script>

<style scoped>

</style>
