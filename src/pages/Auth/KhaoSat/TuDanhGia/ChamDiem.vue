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
                    <CauHoi :key="item + idx" :question="item" :nam-ap-dung="namApDung.value"
                            @updateFileDanhGia="(e)=>updateFileDanhGia(item.id,e)"/>
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
            <v-btn @click="fnExportToWord" color="blue" dark small>
              <v-icon>mdi-file-export</v-icon>
              Xuất file
            </v-btn>
            <v-spacer/>
            <v-btn
                color="error"
                :loading="isSubmitting"
                :disabled="disableSubmit"
                @click.stop="fnSubmit"
            >
              Lưu lại
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>

import {mapState} from 'vuex'
import CauHoi from '@/components/Tables/TuDanhGia/CauHoi'
import CauTraLoi from '@/components/Tables/TuDanhGia/CauTraLoi'
import {khaoSatBangDiemModel} from '@/models/khaoSatBangDiemModel'
import {khaoSatCauHoiModel} from '@/models/khaoSatCauHoiModel'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Tự đánh giá',
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
      category: {},
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
    ...mapState('khaoSatStore', ['bangDiem', 'cauHoi']),
  },
  watch: {
    namApDung(){
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
        this.namApDung = this.namApDungs[0]
      })
    },
    fnExportToWord() {
      this.fnSubmit()
      this.$axios.post('auth/file-manager/export-to-word', {
        bangDiem: this.bangDiem,
        cauHoi: this.cauHoi,
        danhMuc: this.categoryId
      }).then((res) => {
        window.location.href = process.env.VUE_APP_BASE_URL + 'storage/TuDanhGia/' + res.data.file
      })
    },
    fnGetDanhMuc() {
      this.$axios.get('auth/khao-sat/tu-danh-gia/danh-muc', {params: {namApDung: this.namApDung.value}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
        this.categoryId = this.categories[0]?.id
        this.fnGetAvailable()
      }).catch()
    },
    fnGetCauHoi() {
      this.$axios.get('auth/khao-sat/tu-danh-gia/cau-hoi', {
        params: {
          maDanhMuc: this.categoryId,
          namApDung: this.namApDung.value
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
      }).catch()
    },
    fnGetAvailable() {
      this.$axios.post('auth/khao-sat/tu-danh-gia/kiem-tra-hop-le', {maDanhMuc: this.categoryId})
          .then((res) => {
            this.disableSubmit = !res.data.data
            this.$store.commit('khaoSatStore/kiemTraTuDanhGia', this.disableSubmit)
          }).catch()
    },
    updateFileDanhGia(id, file) {
      this.$axios.post('auth/khao-sat/tu-danh-gia/update-file-danh-gia', {
        id: id,
        fileDanhGia: JSON.stringify(file)
      }).then(() => {
        this.fnSubmit()
      })
    },
    fnSubmit() {
      this.isSubmitting = true
      this.$axios.post('auth/khao-sat/tu-danh-gia/luu-diem', this.$store.getters['khaoSatStore/bangDiem'])
          .then((res) => {
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
          }).catch(e => {
        this.$store.dispatch('SnackbarStore/showSnackBar', e.response.statusText)
      }).finally(() => {
        this.isSubmitting = false
      })
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
