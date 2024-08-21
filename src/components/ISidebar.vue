<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="miniVariant"
    :clipped="clipped"
    fixed
    app
    @input="fnSidebarHandle"
  >
    <v-list dense nav class="pa-0">
      <div v-for="item in items" :key="item.name + item.id">
        <template v-if="item.children.length > 0">
          <v-subheader :class="{ 'd-none': miniVariant, 'text-uppercase': true}">
            {{ item.name }}
          </v-subheader>
          <ListItemGroup :items="item.children" />
        </template>
        <template v-else>
          <ItemLink :item="item" />
        </template>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import ListItemGroup from "@/components/ListItemGroup";
import ItemLink from "@/components/ItemLink";

export default {
  name: 'ISidebar',
  components: {
    ListItemGroup,
    ItemLink
  },
  data() {
    return {
      items: []
    }
  },
  computed: {
    ...mapState('Sidebar', ['clipped', 'fixed', 'title', 'miniVariant']),
    current() {
      return this.drawer
    },
    drawer: {
      get() {
        return this.$store.state.Sidebar.drawer
      },
      set(state) {
        if (state) {
          return state
        }
      }
    }
  },
  created() {
    this.fnGetSidebar()
  },
  methods: {
    ...mapActions('Sidebar', ['showClipped', 'showClipped']),
    fnGetSidebar() {
      this.axios.get('auth/sidebars/tree').then((res) => {
        this.items = res.data.data
      }).catch()
    },
    fnSidebarHandle(e) {
      this.$store.dispatch('Sidebar/touchSidebar', e)
    }
  }
}
</script>
