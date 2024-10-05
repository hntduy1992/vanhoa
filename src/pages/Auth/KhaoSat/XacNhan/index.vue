<template>
  <LayoutDefault>
    <v-row>
      <v-col cols="12">
        <IBreadcrumb :items="breadcrumbs"/>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-subtitle>LỌC BỘ TIÊU CHÍ ĐÁNH GIÁ</v-card-subtitle>
          <v-divider/>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="3">
                <v-select
                    v-model="year"
                    dense
                    label="Năm đánh giá"
                    item-text="name"
                    item-value="id"
                    :items="years"
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
              <template #[`item.dinhkem`]="{ value }">
                <v-tooltip top color="primary" v-if="value != null && value !=''">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-if="value != null && value !=''"
                        color="blue-grey"
                        class="ma-2 white--text"
                        elevation="0"
                        small
                        link
                        target="_blank"
                        v-on="on"
                        v-bind="attrs"
                        :href="download(value)"
                    >
                      <v-icon
                          dark
                          left
                      >
                        mdi-cloud-download
                      </v-icon>
                      <span class="ml-2">Tải về</span>
                    </v-btn>
                  </template>
                  <span>{{ value.filename}}</span>
                </v-tooltip>

              </template>
              <template #[`item.diemdanhgia`]="{ value }">
                <span class="font-weight-bold">{{ parseFloat(value).toFixed(2) }}</span>
              </template>
              <template #[`item.diemthamdinh`]="{ value }">
                <span class="font-weight-bold">{{ parseFloat(value).toFixed(2) }}</span>
              </template>
              <template #[`item.diemtonghop`]="{ value }">
                <span class="font-weight-bold">{{ parseFloat(value).toFixed(2) }}</span>
              </template>
              <template #[`item.trangThaiHienTai`]="{ value, item }">
                <v-chip
                    v-if="value === 1"
                    close-icon="mdi-close-outline"
                    color="green"
                    outlined
                >
                  Tự chấm điểm
                </v-chip>
                <v-chip
                    v-if="value === 2"
                    close-icon="mdi-close-outline"
                    color="purple"
                    outlined
                >
                  Đã gởi điểm, chờ thẩm định
                </v-chip>
                <v-btn
                    v-if="value === 3 && item.dathamdinh === 0"
                    small
                    outlined
                    color="error"
                    @click="openDialog(item)"
                >
                  Đang thẩm định
                </v-btn>
                <v-btn
                    v-if="value === 3 && item.dathamdinh === 1"
                    small
                    outlined
                    color="green"
                    :to="`XacNhan/${item.id}/GuiDiem?categoryId=${categoryId}`"
                >
                  Chờ xác nhận
                </v-btn>
                <v-btn v-else-if="value === 4" small outlined color="primary"
                       :to="`XacNhan/${item.id}/GuiDiem?categoryId=${categoryId}`">
                  Đã xác nhận & chờ ý kiến
                </v-btn>
                <v-btn v-else-if="value === 5" small outlined color="#048940"
                       :to="`XacNhan/${item.id}/XemYKien?categoryId=${categoryId}`">
                  Xác nhận ý kiến & tổng hợp
                </v-btn>
                <v-btn v-else-if="value === 6" small outlined color="#581845"
                       :to="`XacNhan/${item.id}/GuiDiem?categoryId=${categoryId}`">
                  Đang thẩm định lại
                </v-btn>
                <v-btn v-else-if="value === 7" small outlined color="#048940"
                       :to="`XacNhan/${item.id}/XemYKien?categoryId=${categoryId}`">
                  Xác nhận & tổng hợp
                </v-btn>
                <v-btn v-else-if="value === 8" small outlined color="#f70690"
                       :to="`XacNhan/${item.id}/XemYKien?categoryId=${categoryId}`">
                  Hoàn thành tổng hợp
                </v-btn>
              </template>
              <template #[`item.thamdinh`]="{ item }">
                <v-btn
                    v-if="item.trangThaiHienTai >= 3 && item.trangThaiHienTai < 7 && item.trangThaiHienTai != 4"
                    small
                    text
                    color="#bf213c"
                    @click="openDialog(item)"
                >
                  Trả thẩm định
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-btn @click="fnExportToWord" color="blue" dark small>
              <v-icon>mdi-file-export</v-icon>
              Xuất file tổng hợp
            </v-btn>
            <v-spacer/>
          </v-card-actions>
        </v-card>
        <v-dialog
            v-model="dialog"
            persistent
            width="650"
        >
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Danh sách đơn vị thẩm định
            </v-card-title>
            <v-card-text>

              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                      Đơn vị thẩm định
                    </th>
                    <th class="text-left">
                      Trạng thái
                    </th>
                    <th class="text-left">

                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="item in desserts"
                      :key="item.tenDonVi"
                  >
                    <td><strong>{{ item.tenDonVi }}</strong></td>
                    <td>
                      <span v-if="item.trangThai === 1">Đã thẩm định</span>
                      <span v-else class="error--text font-weight-bold">Chưa thẩm định</span>
                    </td>
                    <td>
                      <v-btn v-if="item.trangThai === 1" color="red" class="white--text"
                             elevation="2" small rounded @click="fnConfirmReturn(item)">
                        Trả thẩm định
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  text
                  @click="closeDialog()"
              >
                Đóng
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
            v-model="confirmModel"
            persistent
            max-width="315"
        >
          <v-card>
            <v-card-title class="text-h5">
              HỆ THỐNG
            </v-card-title>
            <v-card-text>Bạn chắc chắn muốn trả điểm thẩm định?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green darken-1"
                  text
                  @click="fnConfirmClose"
              >
                Không
              </v-btn>
              <v-btn
                  color="green darken-1"
                  text
                  @click="fnConfirmAccept"
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

export default {
  name: 'XacNhan-index',
  components: {LayoutDefault, IBreadcrumb},
  data() {
    return {
      breadcrumbs: [
        {
          text: 'DASHBOARD',
          disabled: false,
          href: 'Auth/Dashboard'
        },
        {
          text: 'Xác Nhận',
          disabled: false,
          href: '/Auth/KhaoSat/XacNhan'
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
      year: new Date().getFullYear(),
      categoryId: 0,
      categories: [],
      isSubmitting: false,
      disableSubmit: false,
      total: 0,
      headers: [
        {
          text: 'Đơn vị tự đánh giá',
          value: 'tenDonVi',
          width: 230
        },
        {
          text: 'File xác nhận',
          value: 'dinhkem',
          width: 90,
          align: 'center'
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
          text: 'Tổng kết điểm',
          value: 'diemtonghop',
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
          text: 'Đơn vị thẩm định',
          value: 'thamdinh',
          width: 75,
          align: 'center'
        },
        /*{
            text: 'File tổng kết',
            value: 'fileTongHop',
            width: 90,
            align: 'center'
        }*/
      ],
      dialog: false,
      desserts: [],
      confirmModel: false,
      orgId: {}
    }
  },
  computed: {
    years() {
      const year = []
      const current = (new Date().getFullYear()) + 2
      for (let i = 2022; i < current; i++) {
        year.push({
          id: i,
          name: `Năm ${i}`
        })
      }
      return year.reverse()
    }
  },
  watch: {
    year() {
      this.categoryId = 0
      this.data = []
      this.fnGetDanhMuc()
    },
    categoryId() {
      this.data = []
      this.fnDonViDanhGia()
    }
  },
  created() {
    this.fnGetDanhMuc()
    if (this.categoryId === 0) {
      this.disableSubmit = false
    }
  },
  methods: {
    async fnExportToWord() {
      await this.$axios.post('auth/file-manager/export-to-word/tong-hop', {
        danhMuc: this.categoryId,
        namApDung: this.year
      }).then((res) => {
        window.location.href = process.env.VUE_APP_BASE_URL + 'storage/files/TongHop/' + res.data.file
      })
    },
    async fnGetDanhMuc() {
      await this.$axios.get('auth/khao-sat/xac-nhan/danh-muc', {params: {namApDung: this.year}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
        this.categoryId = this.categories[0]?.id
      }).catch()
    },
    async fnGetDanhSachDonViThamDinh(donVi) {
      await this.$axios.get('auth/khao-sat/xac-nhan/don-vi-tham-dinh', {
        params: {
          namApDung: this.year,
          categoryId: this.categoryId,
          donVi: donVi.id
        }
      }).then((res) => {
        this.desserts = (res.data?.data).map(item => ({
          id: item.id,
          maDonViDanhGia: donVi.id,
          tenDonVi: item.tenDonVi,
          trangThai: item.trangThai
        }))
        //this.categoryId = this.categories[0]?.id
      }).catch()
    },
    async fnDonViDanhGia() {
      this.loading = true
      await this.$axios.get('auth/khao-sat/xac-nhan/don-vi', {
        params: {
          year: this.year,
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

    },
    download(file) {
      return process.env.VUE_APP_BASE_URL + 'storage/' + file.fileUrl
    },
    openDialog(donVi) {
      this.dialog = true;
      this.fnGetDanhSachDonViThamDinh(donVi)
    },
    closeDialog() {
      this.dialog = false;
      this.desserts = [];
    },
    fnConfirmReturn(item) {
      this.orgId = item;
      this.confirmModel = true;
    },
    async fnConfirmAccept() {
      const item = {
        namApDung: this.year,
        maDanhMuc: this.categoryId,
        maDonViThamDinh: this.orgId.id,
        maDonViDanhGia: this.orgId.maDonViDanhGia
      }
      await this.$axios.post('auth/khao-sat/xac-nhan/tra-diem-tham-dinh', item).catch()
      await this.fnGetDanhSachDonViThamDinh(this.orgId.maDonViDanhGia)
      this.fnConfirmClose();
    },
    fnConfirmClose() {
      this.confirmModel = false;
      this.orgId = {};
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
