<template>
  <div>
    <div v-for="(item, idx) in items" :key="`${item.name}-${idx}`">
      <v-list-group
        v-if="item.children.length > 0"
        :key="item.name"
        no-action
        link
        color="red"
      >
        <template #activator>
          <v-list-item-icon v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <div v-for="(sub, i) in item.children" :key="`${sub.name}-${i}`">
          <ItemLink :item="sub" />
        </div>
      </v-list-group>
      <ItemLink v-else :item="item" />
    </div>
  </div>
</template>

<script>
import ItemLink from './ItemLink'

export default {
  name: 'ListItemGroup',
  components: {
    ItemLink
  },
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
