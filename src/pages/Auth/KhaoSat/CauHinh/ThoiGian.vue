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
              <IDataTable
                  :headers="headers"
                  :items="items"
                  :loading="loading"
                  :total="totalRow"
              >
                <template #[`item.batDau`]="{ item }">
                  <VDateValidation v-model="item.batDau" dense outlined hide-details></VDateValidation>
                </template>
                <template #[`item.ketThuc`]="{ item }">
                  <VDateValidation v-model="item.ketThuc" dense outlined hide-details></VDateValidation>
                </template>
                <v-input dense hide-details></v-input>
              </IDataTable>
            </v-card-text>
            <v-divider />
            <v-card-actions class="justify-end">
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
import { ValidationObserver } from 'vee-validate'
import VDateValidation from '@/components/Validations/VDateValidation'
import { khaoSatThoiGianModel } from '@/models/khaoSatThoiGianModel'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";
import IDataTable from "@/components/IDataTable";

export default {
  components: {
    LayoutDefault,
    VDateValidation,
    ValidationObserver,
    IBreadcrumb,
    IDataTable
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
          text: 'CẤU HÌNH THỜI GIAN',
          disabled: false,
          href: '/Auth/KhaoSat/CauHinh/ThoiGian'
        }
      ],
      loading: false,
      isLoading: false,
      headers: [
        { text: 'Thời gian', value: 'tenThoiGian', width: 260 },
        { text: 'Bắt đầu', value: 'batDau', width: 210 },
        { text: 'Kết thúc', value: 'ketThuc', width: 210 }
      ],
      items: [],
      totalRow: 10

    }
  },
  watch: {},
  created() {
    this.fnGetDetail()
  },
  methods: {
    async fnGetDetail() {
      await this.$axios.get('auth/khao-sat/cau-hinh/thoi-gian').then((res) => {
        this.items = (res.data.data).map(item => khaoSatThoiGianModel.fromJson(item))
        this.totalRow = this.items.length
      }).catch()
    },
    async fnSubmit() {
      this.loading = true
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      await this.$axios.post('auth/khao-sat/cau-hinh/thoi-gian', this.items).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
      }).catch().finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
