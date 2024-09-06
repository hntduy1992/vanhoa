<template>
  <LayoutDefault>
    <validation-observer ref="observer">
      <v-row>
        <v-col cols="12">
          <IBreadcrumb :items="breadcrumbs"/>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-toolbar dense elevation="0">
              <v-toolbar-title>THÔNG TIN</v-toolbar-title>
            </v-toolbar>
            <v-divider/>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                      v-model="org.parentId"
                      dense
                      outlined
                      label="Cơ quan cấp trên"
                      placeholder="-- Chọn"
                      item-text="name"
                      item-value="id"
                      :return-object="false"
                      :items="organizations"
                      clearable
                  />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <VTextValidation
                      v-model="org.tenDonVi"
                      dense
                      outlined
                      label="Tên đơn vị"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12">
                  <VTextValidation
                      v-model="org.email"
                      dense
                      outlined
                      label="Email"
                      :rules="{ email: true }"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <VTextValidation
                      v-model="org.dienThoai"
                      type="tel"
                      dense
                      outlined
                      label="Số điện thoại"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                      v-model="org.trangThai"
                      dense
                      outlined
                      label="Trạng thái"
                      item-text="name"
                      item-value="id"
                      :items="[ { id: 0, name: 'Chưa kích hoạt'}, { id: 1, name: 'Hoạt động'}, { id: 2, name: 'Tạm khóa'} ]"
                      :return-object="false"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                      v-model="org.phanLoai"
                      dense
                      outlined
                      label="Phân loại"
                      item-text="name"
                      item-value="id"
                      :items="[ { id: 0, name: 'Phòng ban'}, { id: 1, name: 'Xã, Phường'}, { id: 2, name: 'Khóm, Ấp'} ]"
                      :return-object="false"
                  />
                </v-col>
              </v-row>
            </v-card-text>
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
import {donViHanhChinhModel} from '@/models/donViHanhChinhModel'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Chỉnh sửa - Đơn vị hành chính',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
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
          text: 'ĐƠN VỊ HÀNH CHÍNH',
          disabled: false,
          href: '/Auth/DonViHanhChinh'
        },
        {
          text: 'Cập nhật Thông tin',
          disabled: false,
          href: ''
        }
      ],
      loading: false,
      isLoading: false,
      org: donViHanhChinhModel.baseJson(),
      organizations: [],
      search: null

    }
  },
  watch: {
    orgManage(val) {
      this.org.manages = val.map(item => item.id)
    }
  },
  created() {
    this.fnGetOrg()
    this.fnGetDetail()
  },
  methods: {
    async fnGetOrg() {
      await this.$axios.get('auth/don-vi/select').then((res) => {
        this.organizations = (res.data.data).map(item => ({id: item.id, name: item.tenDonVi}))
      }).catch()
    },
    async fnGetDetail() {
      await this.$axios.get('auth/don-vi/id/' + this.$route.params.id).then((res) => {
        this.org = donViHanhChinhModel.fromJson(res.data.data)
      }).catch()
    },
    async fnSubmit() {
      this.loading = true
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      this.$axios.post('auth/don-vi/id/' + this.$route.params.id, donViHanhChinhModel.toJson(this.org)).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnReset()
      }).catch().finally(() => {
        this.loading = false
      })
    },
    async fnReset() {
      await this.fnGetDetail()
    }
  }
}
</script>
