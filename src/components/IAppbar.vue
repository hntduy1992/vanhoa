<template>
  <v-app-bar
    :clipped-left="clipped"
    fixed
    app
    color="#5E35B1"
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
      title: 'PHẦN MỀM ĐÁNH GIÁ CÁC DANH HIỆU VĂN HÓA'
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
