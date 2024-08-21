<template>
  <v-data-table
    v-model="rowSelected"
    loading-text="Đang tải dữ liệu"
    :mobile-breakpoint="0"
    :item-key="iKey"
    :fixed-header="true"
    :footer-props="{
      itemsPerPageOptions: [10, 20, 30, 40, 50, 100, 200, 500],
      itemsPerPageText: 'Dòng hiển thị',
      pageText: '{0}-{1} của {2} dòng'
    }"
    :headers="headers"
    :items="items"
    :items-per-page="rowPage"
    :loading="showLoading"
    :server-items-length="totalRow"
    :show-select="showSelected"
    :single-select="singleSelected"
    :checkbox-color="checkedColor"
    @contextmenu:row="(typeof contextMenu === 'function' ? contextMenu: () => {}) "
    @update:options="IPagination = $event"
  >
    <template v-for="(slot, name) in $scopedSlots" #[name]="item">
      <slot :name="name" v-bind="item" />
    </template>
  </v-data-table>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['contextMenu', 'myKey', 'headers', 'items', 'perPage', 'loading', 'showSelect', 'singleSelect', 'checkboxColor', 'total'],
  data() {
    return {
      rowSelected: [],
      singleSelected: this.singleSelect ?? false,
      showSelected: this.showSelect ?? true,
      checkedColor: this.checkboxColor ?? 'red',
      IPagination: null
    }
  },
  computed: {
    totalRow() {
      return this.total ?? 0
    },
    showLoading() {
      return this.loading ?? false
    },
    rowPage() {
      return this.perPage ?? 10
    },
    iKey() {
      return this.myKey ?? 'id'
    }
  },
  watch: {
    IPagination(val) {
      this.$emit('datatable::pagination', val)
    },
    rowSelected(val) {
      this.$emit('datatable::selected', val)
    },
    iKey(val) {
      // eslint-disable-next-line no-console
      console.log('iKey = ', val)
    },
    showLoading(val) {
      // eslint-disable-next-line no-console
      console.log('showLoading = ', val)
    },
    totalRow(val) {
      // eslint-disable-next-line no-console
      console.log('totalRow = ', val)
    }
  }
}
</script>
