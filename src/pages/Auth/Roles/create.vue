<template>
  <LayoutDefault>
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
                <VTextValidation
                    v-model="item.name"
                    dense
                    outlined
                    label="Tên phân quyền"
                    :rules="{ required: true }"
                />
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-select
                    v-model="item.guard_name"
                    dense
                    outlined
                    label="Guard"
                    :items="['api','web']"
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
  </LayoutDefault>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import VTextValidation from '@/components/Validations/VTextValidation'
import { roleModel } from '@/models/roleModel'
import { moduleModel } from '@/models/moduleModel'
import IBreadcrumb from "@/components/IBreadcrumb";
import LayoutDefault from "@/layouts/default";

export default {
  name: 'Role-create',
  components: {
    LayoutDefault,
    VTextValidation,
    ValidationObserver,
    IBreadcrumb
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
      item: roleModel.baseJson(),
      items: [{
        id: 'Root-1',
        displayName: 'Toàn quyền',
        children: []
      }],
      search: null,
      permissions: []
    }
  },
  watch: {
    permissions(val) {
      this.item.permissions = val.map(item => item.id)
    }
  },
  methods: {
    async fnGetPermission() {
      await this.axios.get('auth/roles/modules').then((item) => {
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
      this.axios.post('auth/roles/create', roleModel.toJson(this.item)).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnReset()
      }).catch().finally(() => {
        this.loading = false
      })
    },
    async fnReset() {
      await this.$refs.observer.reset()
      this.item = roleModel.baseJson()
      this.permissions = []
    }
  }
}
</script>
