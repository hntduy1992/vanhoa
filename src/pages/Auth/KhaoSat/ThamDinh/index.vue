<template>
  <LayoutDefault>
    <v-row>
      <v-col cols="12">
        <IBreadcrumb :items="breadcrumbs" />
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-subtitle>LỌC BỘ TIÊU CHÍ ĐÁNH GIÁ</v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="3">
                <v-select
                    v-model="namApDung"
                    dense
                    label="Năm đánh giá"
                    item-text="text"
                    item-value="value"
                    :items="namApDungs"
                />
              </v-col>
              <v-col cols="12" sm="9">
                <v-autocomplete
                    v-model="categoryId"
                    dense
                    label="Bộ tiêu chí"
                    item-text="name"
                    item-value="id"
                    :items="categories"
                />

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <div class="d-flex justify-center mb-2">

              <v-chip
                  class="ma-2"
                  color="red"
                  text-color="white"
              >
                <v-avatar
                    left
                    class="red darken-4"
                >
                  {{ data.filter(x => x.trangThaiHienTai < 2).length }}
                </v-avatar>
                Chưa gởi đánh giá
              </v-chip>
              <v-chip
                  class="ma-2"
                  color="warning"
                  text-color="white"
              >
                <v-avatar
                    left
                    class="warning darken-4"
                >
                  {{ data.filter(x => x.trangThaiHienTai === 2 || x.trangThaiHienTai === 6).length }}
                </v-avatar>
                Thẩm định
              </v-chip>
              <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
              >
                <v-avatar
                    left
                    class="primary darken-4"
                >
                  {{ data.filter(x => x.trangThaiHienTai === 3 || x.trangThaiHienTai === 7).length }}
                </v-avatar>
                Đã thẩm định & Chờ duyệt
              </v-chip>
              <v-chip
                  class="ma-2"
                  color="success"
                  text-color="white"
              >
                <v-avatar
                    left
                    class="success darken-4"
                >
                  {{ data.filter(x => x.trangThaiHienTai >= 4 && x.trangThaiHienTai < 7).length }}
                </v-avatar>
                Đã duyệt
              </v-chip>
              <v-chip
                  class="ma-2"
                  color="info"
                  text-color="white"
              >
                <v-avatar
                    left
                    class="info darken-4"
                >
                  {{ data.filter(x => x.trangThaiHienTai === 8).length }}
                </v-avatar>
                Hoàn thành
              </v-chip>

            </div>
            <v-data-table
                id="survey"
                dense
                item-key="name"
                mobile-breakpoint="0"
                disable-pagination
                disable-sort
                disable-filtering
                hide-default-footer
                :headers="headers"
                :items="data"
                :loading="loading"
            >
              <template #[`item.tenDonVi`]="{ value }">
                <span class="font-weight-600" style="margin-left: 15px">{{ value }}</span>
              </template>
              <template #[`item.diemdanhgia`]="{ value }">
                <span class="font-weight-bold">{{ parseFloat(value).toFixed(2) }}</span>
              </template>
              <template #[`item.diemthamdinh`]="{ value }">
                <span class="font-weight-bold">{{ parseFloat(value).toFixed(2) }}</span>
              </template>
              <template #[`item.trangThaiHienTai`]="{ value, item }">
                <v-btn v-if="!value || value < 2" small outlined color="red">
                  Chưa gửi đánh giá
                </v-btn>
                <v-btn
                    v-else-if="value === 2 || value === 6"
                    small
                    outlined
                    color="warning"
                    :to="`ThamDinh/${item.id}/ChamDiem?categoryId=${categoryId}${value == 6 ? '&thamDinhLai=1':''}`"
                >
                  Thẩm định
                </v-btn>
                <v-btn v-else-if="value === 3 || value === 7" small outlined color="primary"
                       :to="`ThamDinh/${item.id}/GuiDiem?categoryId=${categoryId}`">
                  Đã thẩm định & Chờ duyệt
                </v-btn>
                <v-btn v-else-if="value >= 4 && value < 7" small outlined color="success" :to="`ThamDinh/${item.id}/GuiDiem?categoryId=${categoryId}`">
                  Đã duyệt
                </v-btn>
                <v-btn v-else-if="value === 8" small outlined color="info" :to="`ThamDinh/${item.id}/GuiDiem?categoryId=${categoryId}`">
                  Hoàn thành
                </v-btn>
              </template>
              <template #[`item.action`]="{ item }">
                <v-btn v-if="(item.trangThaiHienTai === 2 || item.trangThaiHienTai === 6) && item.dathamdinh" small color="primary" :to="`ThamDinh/${item.id}/GuiDiem?categoryId=${categoryId}${item.trangThaiHienTai === 6 ? '&thamDinhLai=1':''}`">
                  Gửi thẩm định
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>

import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  name: 'ThamDinh',
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Danh sách cần thẩm định',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
  components: {LayoutDefault, IBreadcrumb},
  data() {
    return {
      breadcrumbs: [
        {
          text: 'DASHBOARD',
          disabled: false,
          href: 'Dashboard'
        },
        {
          text: 'THẨM ĐỊNH',
          disabled: false,
          href: '/Auth/KhaoSat/ThamDinh'
        },
        {
          text: 'Danh Sách Đơn Vị',
          disabled: false,
          href: ''
        }
      ],
      category: {},
      data: [],
      loading: false,
      questions: [],
      namApDung: 0,
      namApDungs: [],
      categoryId: 0,
      categories: [],
      isSubmitting: false,
      disableSubmit: false,
      total: 0,
      headers: [
        {
          text: 'Đơn vị tự đánh giá',
          value: 'tenDonVi',
          width: 275
        },
        {
          text: 'Điểm tự đánh giá',
          value: 'diemdanhgia',
          width: 55,
          align: 'center'
        },
        {
          text: 'Điểm thẩm định',
          value: 'diemthamdinh',
          width: 75,
          align: 'center'
        },
        {
          text: 'Trạng thái',
          value: 'trangThaiHienTai',
          width: 75,
          align: 'center'
        },
        {
          text: '',
          value: 'action',
          width: 75,
          align: 'center'
        }
      ]
    }
  },
  watch: {
    namApDung() {
      this.data = []
      this.fnGetDanhMuc()
    },
    categoryId() {
      this.data = []
      this.fnDonViDanhGia()
    }
  },
  created() {
    this.fnGetNamApDung()
  },
  methods: {
    fnGetNamApDung() {
      this.$axios.get('auth/khao-sat/danh-muc/select-nam-ap-dung').then((res) => {
        this.namApDungs = res.data.data.map((i) => ({
          value: i,
          text: i
        }))
        this.namApDung = this.namApDungs[0]
      })
    },
    fnGetDanhMuc() {
      this.$axios.get('auth/khao-sat/tham-dinh/danh-muc', {params: {namApDung: this.namApDung.value}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
        this.categoryId = this.categories[0]?.id
      }).catch()
    },
    fnDonViDanhGia() {
      this.loading = true
      this.$axios.get('auth/khao-sat/tham-dinh/don-vi', {
        params: {
          namApDung: this.namApDung.value,
          categoryId: this.categoryId
        }
      })
          .then((res) => {
            this.data = res.data.data
          })
          .finally(() => {
            this.loading = false
          })
    },
    async fnSubmit() {
    }
  }
}
</script>
<style lang="scss">
.v-data-table#survey table {
  border-collapse: collapse !important;

  th {
    border-right: thin solid rgba(0, 0, 0, 0.12) !important;
    font-weight: bold;
    color: black;
    font-size: 14px !important;
  }

  tr {
    border: thin solid rgba(0, 0, 0, 0.12);

    td {
      border: unset !important;
      padding: 5px;
    }

    td {
      border-right: thin solid rgba(0, 0, 0, 0.12) !important;
      padding: 5px;
    }
  }
}
</style>
