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
                      v-model="item.tenDanhMuc"
                      dense
                      outlined
                      label="Tên bộ tiêu chí"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <VTextValidation
                      v-model="item.namApDung"
                      dense
                      outlined
                      label="Năm áp dụng"
                      :rules="{ required: true, numeric: true }"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                      v-model="item.noiDung"
                      dense
                      outlined
                      label="Mô tả"
                      rows="3"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                      v-model="item.phanLoai"
                      dense
                      outlined
                      label="Phân loại"
                      item-text="name"
                      item-value="id"
                      :items="[{ id: 1, name: 'Xã, Phường'},{ id: 2, name: 'Khóm, Ấp'} ]"
                      :return-object="false"
                      @change="fnGetOrg"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-toolbar dense elevation="0">
              <v-toolbar-title>ĐƠN VỊ ÁP DỤNG</v-toolbar-title>
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
                      v-model="item.donViApDung"
                      selectable
                      :return-object="false"
                      selected-color="error"
                      item-text="name"
                      :items="items"
                      :load-children="fnGetOrg"
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
              <v-btn elevation="0" shaped color="error" :loading="loading" @click="fnSubmit">
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
import {ValidationObserver} from 'vee-validate'
import VTextValidation from '@/components/Validations/VTextValidation'
import {khaoSatDanhMucModel} from '@/models/khaoSatDanhMucModel'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
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
          text: 'DASHBOARD',
          disabled: false,
          href: 'Dashboard'
        },
        {
          text: 'BỘ TIÊU CHÍ',
          disabled: false,
          href: '/Auth/KhaoSat/DanhMuc'
        },
        {
          text: 'Thêm Mới',
          disabled: false,
          href: ''
        }
      ],
      loading: false,
      item: khaoSatDanhMucModel.baseJson(),
      organizations: [],
      items: [{
        id: 'Root-1',
        name: 'Tất cả',
        children: []
      }],
      search: null,
      organizationId: null,
    }
  },
  created() {
  },
  methods: {
    fnGetOrg() {
      this.$axios.get('auth/don-vi/select', {
        params: {
          phanLoai: this.item.phanLoai
        }
      }).then((res) => {
        this.organizations = (res.data.data).map(item => ({
          id: item.id,
          name: item.tenDonVi
        }))
        this.items[0].children = this.organizations
      }).catch()
      this.fnGetDetail()
    },
    fnGetDetail() {
      this.$axios.get('auth/khao-sat/danh-muc/id/' + this.$route.params.id).then((res) => {
        this.item = khaoSatDanhMucModel.fromJson(res.data.data)
      }).catch()
    },
    fnSubmit() {
      this.loading = true
      const valid = this.$refs.observer.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      this.$axios.post('auth/khao-sat/danh-muc/id/' + this.$route.params.id, khaoSatDanhMucModel.toJson(this.item)).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnReset()
      }).catch().finally(() => {
        this.loading = false
      })
    },
    fnReset() {
      this.fnGetDetail()
    }
  }
}
</script>
