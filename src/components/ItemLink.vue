<template>
  <v-list-item
    v-if="item.url"
    :key="item.id"
    :to="item.url"
    color="var(--primary-color)"
    link
  >
    <v-list-item-icon v-if="item.icon">
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'ItemLink',
  props: {
    item: {
      type: [Object, String],
      default: null
    }
  }
}
</script>
