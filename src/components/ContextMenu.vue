<template>
  <v-menu transition="slide-x-transition" bottom right>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list dense class="pa-0">
      <v-list-item-group>
        <template v-for="(item, idx) in items">
          <template v-if="item.url">
            <v-list-item :key="`${item.name}.${idx}`" :to="item.url">
              <v-list-item-icon>
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-if="!item.url && typeof (item.fn) === 'function'">
            <v-list-item :key="`${item.name}.${idx}`" @click="item.fn">
              <v-list-item-icon>
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['items']
}
</script>

<style scoped>

</style>
