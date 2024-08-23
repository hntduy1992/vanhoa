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
                <v-col cols="12" sm="12" md="12">
                  <VAutoCompleteValidation
                      v-model="categoryId"
                      dense
                      outlined
                      label="Bộ tiêu chí"
                      item-value="id"
                      item-text="name"
                      :return-object="false"
                      :rules="{ required: true }"
                      :items="categories"
                      clearable
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <VAutoCompleteValidation
                      v-model="item.parentId"
                      dense
                      outlined
                      label="Tiêu chí cha"
                      item-value="id"
                      item-text="name"
                      :items="questions"
                      :return-object="false"
                      :loading="isLoading"
                      clearable
                  >
                    <template #item="{ item }">
                    <span :style="{ 'text-indent': item.level * 10 + 'px', 'font-size': '12px' }">{{
                        item.stt
                      }} {{ item.name }}</span>
                    </template>
                  </VAutoCompleteValidation>
                </v-col>
                <v-col cols="12" sm="2" md="1">
                  <VTextValidation
                      v-model="item.stt"
                      dense
                      outlined
                      label="Mục"
                  />
                </v-col>
                <v-col cols="12" sm="10" md="11">
                  <VTextValidation
                      v-model="item.tenCauHoi"
                      dense
                      outlined
                      label="Tiêu chí"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                      v-model="item.danhDauCau"
                      dense
                      outlined
                      label="Đánh dấu câu"
                      item-text="name"
                      item-value="code"
                      :items="[{ code: 0, name: 'Câu hỏi cấp trên' }, { code: 1, name: 'Câu hỏi' }, { code: 2, name: 'Câu trả lời' }]"
                  />
                </v-col>
                <v-col cols="12" sm="3" md="4">
                  <v-select
                      v-model="item.loaiDieuKien"
                      dense
                      outlined
                      label="Điều kiện"
                      item-text="name"
                      item-value="code"
                      :items="[{ code: 'AND', name: 'AND (và)' }, { code: 'OR', name: 'OR (hoặc)' }]"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                      v-model="item.kieuNhapLieu"
                      dense
                      outlined
                      label="Kiểu nhập điểm"
                      item-text="name"
                      item-value="code"
                      :disabled="item.danhDauCau != 2"
                      :items="[{ code: 'Text', name: 'Nhập điểm (Input)' }, { code: 'Select', name: 'Chọn điểm (Select)' }, { code: 'Checkbox', name: 'Chọn điểm (Checkbox)' }, { code: 'Radio', name: 'Chọn điểm (Radio)' }]"
                  />
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <VTextValidation
                      v-model="item.diemNhoNhat"
                      dense
                      outlined
                      label="Điểm nhỏ nhất"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <VTextValidation
                      v-model="item.buocNhay"
                      dense
                      outlined
                      label="Bước nhảy"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <VTextValidation
                      v-model="item.diemLonNhat"
                      dense
                      outlined
                      label="Điểm lớn nhất"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="6" hidden>
                  <v-select
                      v-model="item.loaiCauHoi"
                      dense
                      outlined
                      label="Loại tiêu chí"
                      item-text="name"
                      item-value="code"
                      :items="[{ code: 1, name: 'Đánh giá' }, { code: 2, name: 'Điều tra xã hội học' }]"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="3">
                  <v-select
                      v-model="item.trangThai"
                      dense
                      outlined
                      label="Trạng thái"
                      item-text="name"
                      item-value="id"
                      :items="[{ id: 1, name: 'Mở'}, { id: 2, name: 'Đóng'} ]"
                      :return-object="false"
                      hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider/>
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
import { khaoSatCauHoiModel } from '@/models/khaoSatCauHoiModel'
import VAutoCompleteValidation from '@/components/Validations/VAutoCompleteValidation'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  components: {
    LayoutDefault,
    VAutoCompleteValidation,
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
          text: 'TIÊU CHÍ ĐÁNH GIÁ',
          disabled: false,
          href: '/Auth/KhaoSat/CauHoi'
        },
        {
          text: 'Thêm Mới',
          disabled: false,
          href: ''
        }
      ],
      loading: false,
      isLoading: false,
      item: khaoSatCauHoiModel.baseJson(),
      categoryId: null,
      categories: [],
      questions: []
    }
  },
  watch: {
    categoryId(val) {
      this.item.maDanhMuc = val
      this.fnGetQuestions()
    }
  },
  created() {
    this.fnGetCategories()
  },
  methods: {
    async fnGetCategories() {
      await this.$axios.get('auth/khao-sat/danh-muc/select').then((res) => {
        this.categories = (res.data.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
      }).catch()
    },
    async fnGetQuestions() {
      this.isLoading = true
      await this.$axios.get('auth/khao-sat/cau-hoi/tree', {
        params: {
          categoryId: this.categoryId
        }
      }).then((res) => {
        this.questions = (res.data.data).map(item => ({
          id: item.id,
          stt: item.stt,
          level: item.level,
          name: item.tenCauHoi
        }))
      }).finally(() => {
        this.isLoading = false
      })
    },
    async fnSubmit() {
      this.loading = true
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      this.$axios.post('auth/khao-sat/cau-hoi/them-moi', khaoSatCauHoiModel.toJson(this.item)).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnReset()
      }).catch().finally(() => {
        this.loading = false
      })
    },
    async fnReset() {
      await this.$refs.observer.reset()
      this.categoryId = 0
      this.item = khaoSatCauHoiModel.baseJson()
    }
  }
}
</script>
