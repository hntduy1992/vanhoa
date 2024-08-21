<template>
  <validation-observer ref="observer">
    <v-row>
      <v-col cols="12">
        <IBreadcrumb :items="breadcrumbs" />
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar dense elevation="0">
            <v-toolbar-title>THÔNG TIN</v-toolbar-title>
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-select
                  v-model="sidebar"
                  dense
                  outlined
                  label="sidebars"
                  :items="sidebars"
                  :item-text="`name`"
                  :item-value="`id`"
                  :return-object="false"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar dense elevation="0">
            <v-toolbar-title>CHỨC NĂNG</v-toolbar-title>
            <v-spacer />
            <v-text-field
              v-model="search"
              label="Tìm kiếm"
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
              style="max-width: 210px"
              class="mr-2"
            />
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-treeview
                  v-model="permissions"
                  selectable
                  return-object
                  selected-color="error"
                  item-text="displayName"
                  :items="items"
                  :load-children="fnGetPermission"
                  :search="search"
                  :open-all="true"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="justify-end">
            <v-btn elevation="0" shaped color="warning" @click="fnReset">
              <v-icon>mdi-reload</v-icon>
              Làm lại
            </v-btn>
            <v-btn elevation="0" shaped color="error" @click="fnSubmit">
              <v-icon>mdi-content-save</v-icon>
              Lưu lại
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import { moduleModel } from '@/models/moduleModel'

export default {
  name: 'SidebarIndex',
  components: {
    ValidationObserver
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'Dashboard'
        }, {
          text: 'Quản Lý Phân Quyền',
          disabled: false,
          href: '/auth/roles'
        },
        {
          text: 'Thêm Mới',
          disabled: false,
          href: ''
        }
      ],
      loading: false,
      item: {},
      items: [{
        id: 'Root-1',
        displayName: 'Toàn quyền',
        children: []
      }],
      search: null,
      permissions: [],
      sidebars: [],
      sidebar: 0
    }
  },
  watch: {
    permissions(val) {
      this.item.permissions = val.map(item => item.id)
    }
  },
  created() {
    this.fnSidebars()
  },
  methods: {
    async fnSidebars() {
      await this.$axios.get('auth/sidebars/all').then((item) => {
        this.sidebars = item.data.data
      }).catch()
    },
    async fnGetPermission() {
      await this.$store.dispatch('roleStore/modules').then((item) => {
        this.items[0].children = (item.data.data).map((item, idx) => moduleModel.fromJson(item, idx))
      })
    },
    async fnSubmit() {
      this.loading = true
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      this.$axios.post('auth/sidebars/edit/' + this.sidebar, { permissions: this.item.permissions }).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnReset()
      }).catch().finally(() => {
        this.loading = false
      })
    },
    async fnReset() {
      await this.$refs.observer.reset()
      this.item = {}
      this.permissions = []
    }
  }
}
</script>
