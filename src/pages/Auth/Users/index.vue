<template>
  <LayoutDefault>
    <v-row>
      <v-col cols="12">
        <IBreadcrumb :items="breadcrumbs"/>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar dense elevation="0">
            <v-toolbar-title>DANH SÁCH</v-toolbar-title>
            <v-spacer/>
            <v-text-field
                v-model="keySearch"
                label="Tìm kiếm"
                placeholder="Nhập từ khóa"
                hide-details
                dense
                style="max-width: 210px"
                class="mr-2"
            />
            <v-tooltip top color="primary">
              <template #activator="{ on }">
                <v-btn
                    icon
                    color="primary"
                    :to="`Users/create`"
                    v-on="on"
                >
                  <v-icon>
                    mdi-plus-circle
                  </v-icon>
                </v-btn>
              </template>
              <span>Thêm mới</span>
            </v-tooltip>
            <v-tooltip top color="red">
              <template #activator="{ on }">
              <span v-on="on">
                <v-btn color="error" class="mr-1" icon :disabled="rowSelected.length === 0" @click="fnConfirm(true)">
                  <v-icon>mdi-delete-circle</v-icon>
                </v-btn>
              </span>
              </template>
              <span>Xóa </span>
            </v-tooltip>
          </v-toolbar>
          <v-divider/>
          <IDataTable
              :headers="headers"
              :items="items"
              :total="totalRow"
              :loading="loading"
              @datatable::pagination="pagination = $event"
              @datatable::selected="rowSelected = $event"
          >
            <template #[`item.organizationId`]="{ item }">
              <span v-if="item.organization">{{ item.organization.tenDonVi }}</span>
              <span v-else>-</span>
            </template>
            <template #[`item.roles`]="{ value }">
              <span v-if="value.length > 0">

                <v-chip
                    label
                    outlined
                    small
                    v-for="v of value"
                    :key="v.id"
                    :color="colors[(v.id - 1) > 0 ? v.id - 1 : 0 ]"
                >{{ v.name }}</v-chip>
              </span>
              <span v-else>-</span>
            </template>
            <template #[`item.action`]="{ item }">
              <ContextMenu
                  :items="[
                { name: 'Chỉnh sửa', icon: 'mdi-file-document-edit-outline', color: 'blue', url: `Users/${item.id}` },
                { name: 'Xóa', icon: 'mdi-delete-circle', color: 'red', fn: () => fnConfirm(false, item) }
              ]"
              />
            </template>
          </IDataTable>
        </v-card>

        <v-dialog
            v-model="dialog"
            scrollable
            max-width="400px"
        >
          <v-card width="400">
            <v-card-title>HỆ THỐNG</v-card-title>
            <v-divider/>
            <v-card-text class="pa-4">
              <p style="font-size: 15px">
                Mọi thông tin liên quan sẽ bị mất theo. Bạn chắc chắn muốn xóa?
              </p>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer/>
              <v-btn
                  elevation="0"
                  color="warning darken-1"
                  @click="dialog = false"
              >
                Không
              </v-btn>
              <v-btn
                  dark
                  elevation="0"
                  color="red"
                  @click="fnDelete"
              >
                Có
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";
import IDataTable from "@/components/IDataTable";
import ContextMenu from "@/components/ContextMenu";

export default {
  name: 'user-index',
  components: {LayoutDefault, IBreadcrumb, IDataTable, ContextMenu},
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'Dashboard'
        },
        {
          text: 'Người dùng',
          disabled: false,
          href: '/Auth/Users'
        }
      ],
      singleSelected: {},
      rowSelected: [],
      pagination: null,
      keySearch: null,
      headers: [
        {text: 'Tài khoản', value: 'userName', width: 160},
        {text: 'Họ tên', value: 'fullName', width: 310},
        {text: 'Phân quyền', value: 'roles', width: 210, sortable: false},
        {text: 'Đơn vị', value: 'organizationId', sortable: false, width: 360},
        {text: null, value: 'action', align: 'end', width: 50, sortable: false}
      ],
      items: [],
      totalRow: 0,
      loading: false,
      dialog: false
    }
  },
  watch: {
    pagination() {
      this.fnGetList()
    },
    keySearch() {
      clearTimeout(this._timerId)
      this._timerId = setTimeout(() => {
        this.fnGetList()
      }, 600)
    }
  },
  computed: {
    colors() {
      return [
        '#ff1a1a',
        '#0040ff',
        '#4d0000',
        '#ff00ff',
        '#00ffff',
        '#ff1a1a',
        '#0040ff',
        '#4d0000',
        '#ff00ff',
        '#00ffff'
      ]
    }
  },
  methods: {
    async fnGetList() {
      this.loading = true
      await this.axios.get('auth/users', {
        params: {
          page: this.pagination.page,
          limit: this.pagination.itemsPerPage,
          sortBy: this.pagination.sortBy[0],
          sortDesc: this.pagination.sortDesc[0],
          content: this.keySearch
        }
      })
          .then((res) => {
            this.items = (res.data.data).map(item => ({
              id: item.id,
              userName: item.userName,
              fullName: item.fullName,
              organizationId: item?.organizationId,
              organization: item?.organization,
              roles: item.roles ?? [],
              status: item.status
            }))
            this.totalRow = res.data.totalRow
          })
          .finally(() => {
            this.loading = false
          })
    },
    fnConfirm(multi, item) {
      this.dialog = true
      if (!multi) {
        this.singleSelected = item
        this.rowSelected = []
      }
    },
    async fnDelete() {
      this.dialog = false
      let ids = []
      if (this.rowSelected.length > 0) {
        ids = (this.rowSelected).map(row => row.id)
      } else {
        ids.push(this.singleSelected?.id)
      }
      await this.axios.post('auth/users/delete', {ids}).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnGetList()
      }).catch()
    }
  }
}
</script>
