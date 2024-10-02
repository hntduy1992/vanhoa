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
                :items="iData"
                :loading="loading"
            >
              <template #body="{ items }">
                <tbody>
                <template v-for="(item, idx) in items">
                  <template v-if="item.danhDauCau < 2">
                    <CauHoi :key="item + idx" :question="item"/>
                  </template>
                  <template v-if="item.danhDauCau >= 2">
                    <CauTraLoi :key="item + idx" :question="item"/>
                  </template>
                </template>
                </tbody>
                <tfoot>
                <tr v-if="items.length == 0">
                  <td colspan="8" class="text-center">
                    <p class="ma-0">
                      Không tìm thấy dữ liệu
                    </p>
                  </td>
                </tr>
                <tr>
                  <td/>
                  <td class="text-right font-weight-bold">
                    Tổng cộng
                  </td>
                  <td class="text-center">
                    <span class="font-weight-bold red--text">{{ total1 }}</span>
                  </td>
                  <td class="text-center">
                                        <span class="font-weight-bold red--text">{{
                                            parseFloat(total).toFixed(2)
                                          }}</span>
                  </td>
                  <td/>
                  <td/>
                </tr>
                </tfoot>
              </template>
            </v-data-table>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-row dense no-gutters>
              <v-col cols="12" sm="12"><span class="red--text">*</span> File xác nhận điểm tự đánh giá của
                thủ trưởng đơn vị (có đóng dấu ký tên)
              </v-col>
              <v-col cols="12" sm="12">
                <div class="d-flex align-center">
                  <v-file-input
                      dense
                      hide-details
                      prepend-icon=""
                      prepend-inner-icon="mdi-upload"
                      placeholder="File xác nhận điểm tự đánh giá"
                      height="20"
                      style="min-height: auto; max-width: 300px"
                      clearable
                      @change="upload"
                      class="me-2"
                      :disabled="(fileBienBan!=null)"
                  />
                  <v-btn
                      icon
                      color="red"
                      @click="clearFile"
                      v-if="fileBienBan"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-tooltip v-if="fileBienBan" :text="fileBienBan.fileName">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          color="blue-grey"
                          class="ma-2 white--text"
                          elevation="0"
                          small
                          link
                          target="_blank"
                          v-bind="attrs"
                          v-on="on"
                          :href="download()"
                      >
                        <v-icon
                            dark
                            left
                        >
                          mdi-cloud-download
                        </v-icon>
                        <span class="ml-2">
                  Biên bản
                </span>
                      </v-btn>

                    </template>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
            <v-spacer/>
            <v-btn
                color="error"
                :loading="isSubmitting"
                :disabled="disableSubmit && trangThaiHienTai>3 && !fileBienBan"
                @click.stop="fnSubmit"
            >
              Gửi điểm
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog
            v-model="dialog"
            width="500"
        >
          <v-card>
            <v-card-title class="text-h5 red white--text">
              HỆ THỐNG
            </v-card-title>

            <v-card-text class="pa-0">
              <div class="pa-3 font-weight-bold">Bạn chưa đính kèm file xác nhận điểm tự đánh giá.</div>
            </v-card-text>

            <v-divider/>

            <v-card-actions>
              <v-spacer/>
              <v-btn
                  color="primary"
                  text
                  @click="dialog = false"
              >
                Đồng ý
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>

import {mapState} from 'vuex'
import CauHoi from '@/components/Tables/TuDanhGia/CauHoiGui'
import CauTraLoi from '@/components/Tables/TuDanhGia/CauTraLoiGui'
import {khaoSatBangDiemModel} from '@/models/khaoSatBangDiemModel'
import {khaoSatCauHoiModel} from '@/models/khaoSatCauHoiModel'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Gửi điểm',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
  components: {LayoutDefault, IBreadcrumb, CauTraLoi, CauHoi},
  data() {
    return {
      breadcrumbs: [
        {
          text: 'DASHBOARD',
          disabled: false,
          href: 'Dashboard'
        },
        {
          text: 'TỰ ĐÁNH GIÁ',
          disabled: false,
          href: '/Auth/KhaoSat/TuDanhGia/ChamDiem'
        }
      ],
      dialog: false,
      // category: {},
      iData: [],
      loading: false,
      questions: [],
      namApDung: 0,
      namApDungs: [],
      categoryId: 0,
      categories: [],
      isSubmitting: false,
      disableSubmit: true,
      total: 0,
      total1: 0,
      fileBienBan: null,
      trangThaiHienTai: null,
      headers: [
        {
          text: 'STT',
          value: 'stt',
          width: 20,
          align: 'center'
        },
        {
          text: 'Tiêu chí',
          value: 'name',
        },
        {
          text: 'Điểm tối đa',
          value: 'maxScore',
          width: '10%',
          align: 'center'
        },
        {
          text: 'Tự đánh giá',
          value: 'year',
          width: '10%',
          align: 'center'
        },
        {
          text: 'Đính kèm',
          value: 'year',
          width: '20%',
          align: 'center'
        },
        {
          text: 'Ghi chú',
          value: 'year',
          width: '20%',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapState('khaoSatStore', ['bangDiem']),

  },
  watch: {
    namApDung() {
      this.data = []
      this.fnGetDanhMuc()
    },
    categoryId() {
      this.data = []
      this.fnGetCauHoi()
    },
    bangDiem(val) {
      let total = 0
      val.forEach((item) => {
        total += item.diem
      })
      this.total = total
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
        this.namApDung = this.namApDungs[0].value
      })
    },
    fnGetDanhMuc() {
      this.$axios.get('auth/khao-sat/tu-danh-gia/danh-muc', {params: {namApDung: this.namApDung}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
        this.categoryId = this.categories[0]?.id
      }).catch().finally(() => {
        this.fnGetAvailable()
      })
    },
    fnGetCauHoi() {
      this.loading = true
      this.$axios.get('auth/khao-sat/tu-danh-gia/cau-hoi', {
        params: {
          maDanhMuc: this.categoryId,
          namApDung: this.namApDung
        }
      }).then((res) => {
        this.iData = (res.data.data).map(d => khaoSatCauHoiModel.fromJson(d))
        const bangDiem = []
        const cauHoi = []
        this.total1 = 0
        this.iData.forEach((item) => {
          const maxPoint = item.parentId === 0 ? item.diemLonNhat : 0
          this.total1 = this.total1 + maxPoint
          if (item.danhDauCau === 1 || item.danhDauCau === 3) {
            if (!item.bangdiem) {
              item.bangdiem = khaoSatBangDiemModel.baseJson()
              item.bangdiem.maCauHoi = item.id
              item.bangdiem.maDanhMuc = this.categoryId
              item.bangdiem.parentId = item.parentId
            }
            bangDiem.push(khaoSatBangDiemModel.fromJson(item.bangdiem))
          }
          cauHoi.push({
            maCauHoi: item.id,
            parentId: item.parentId,
            loaiCauHoi: item.loaiCauHoi,
            loaiDieuKien: item.loaiDieuKien,
            diem: 0,
            diemThamDinh: 0
          })
        })
        setTimeout(() => {
          this.$store.commit('khaoSatStore/bangDiem', bangDiem)
          this.$store.commit('khaoSatStore/cauHoi', cauHoi)
        }, 1)
      }).catch().finally(() => {
        this.loading = false
      })
    },
    fnGetAvailable() {
      this.$axios.post('auth/khao-sat/tu-danh-gia/kiem-tra-hop-le', {
        maDanhMuc: this.categoryId
      }).then((res) => {
        this.disableSubmit = !res.data.data
        this.trangThaiHienTai = res.data.trangThai
        this.$store.commit('khaoSatStore/kiemTraTuDanhGia', this.disableSubmit)
        this.fileBienBan = JSON.parse(res.data.fileBienBan)
      }).catch()
    },
    fnSubmit() {
      if (this.fileBienBan != null) {
        this.isSubmitting = true
        this.$axios.post('auth/khao-sat/tu-danh-gia/gui-diem', {
          maDanhMuc: this.categoryId,
          fileName: JSON.stringify(this.fileBienBan)
        })
            .then((res) => {
              this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
            }).catch().finally(() => {
          this.isSubmitting = false
          this.fnGetAvailable()
        })
      } else {
        this.dialog = true
      }
    },
    download() {
      return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileTongHop.fileUrl
    },
    upload(files) {
      this.loading = true
      if (!files) {
        this.loading = false
        return null
      }
      const formData = new FormData()
      formData.append('file', files)
      formData.append('namApDung', this.namApDung)
      this.$axios.post('auth/file-manager/singleUploadTongHop', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
          .then((res) => {
            if (res.data.success) {
              this.fileTongHop = {fileUrl: res.data.fileUrl, fileName: res.data.fileName}
              this.fnSubmit()
            }
          }).catch()
          .finally(() => {
            this.loading = false
          })
    },
    clearFile() {
      this.fileTongHop = null
    }
  }
}
</script>
<style lang="scss">
.v-data-table#survey table {
  border-collapse: collapse;
  width: 100%;
  min-width: 860px !important;

  th {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    color: #000;
    font-weight: bold;
  }

  th, td {
    padding: 0.25rem;
    text-align: left;
    border: 1px solid #ccc;
  }

  /*tr:nth-child(even) {
      background-color: #f2f2f2;
  }*/

  tr:hover {
    background-color: #ddd;
  }
}
</style>
