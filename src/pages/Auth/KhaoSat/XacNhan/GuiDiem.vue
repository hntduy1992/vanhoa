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
                    disabled
                />
              </v-col>
              <v-col cols="12" sm="9">
                <v-autocomplete
                    v-model="tempCatId"
                    dense
                    label="Bộ tiêu chí"
                    item-text="name"
                    item-value="id"
                    :items="categories"
                    disabled
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <h3 class="text-uppercase text-center">{{ donViDanhGia }}</h3>
        <v-card>
          <v-card-text>
            <table
                id="xacnhan"
                class="table"
            >
              <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu chí</th>
                <th style="width: 75px">Điểm lớn nhất</th>
                <th style="width: 75px">Tự đánh giá</th>
                <th>Ghi chú tự đánh giá</th>
                <th style="width: 75px">Thẩm định</th>
                <th style="width: 15vw">Ghi chú thẩm định</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="(item, idx) in iData">
                <template v-if="item.danhDauCau < 2">
                  <CauHoi :key="item + idx" :question="item"/>
                </template>
                <template v-if="item.danhDauCau >= 2">
                  <CauTraLoi :key="item + idx" :question="item"/>
                </template>
              </template>
              </tbody>
              <tfoot>
              <tr v-if="iData.length === 0">
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
                  <span class="font-weight-bold">{{ total1 }}</span>
                </td>
                <td class="text-center">
                  <span class="font-weight-bold">{{ parseFloat(total).toFixed(2) }}</span>
                </td>
                <td/>
                <td/>
                <td colspan="2" class="text-center">
                                        <span class="font-weight-bold red--text">{{
                                            parseFloat(total2).toFixed(2)
                                          }}</span>
                </td>
              </tr>
              </tfoot>
            </table>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-btn @click="fnExportToWord" color="blue" dark small>
              <v-icon>mdi-file-export</v-icon>
              Xuất file
            </v-btn>
            <v-spacer/>
            <v-btn
                v-if="tinhTrangHienTai == 4"
                color="primary"
                :loading="isSubmitting"
                :disabled="!disableSubmit || tinhTrangHienTai===8"
                @click.stop="fnKetThuc"
            >
              Kết thúc
            </v-btn>

            <v-btn
                color="error"
                :loading="isSubmitting"
                :disabled="disableSubmit"
                @click.stop="fnSubmit"
            >
              Xác nhận và chờ ý kiến
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>

import {mapState} from 'vuex'
import CauHoi from '@/components/Tables/XacNhan/CauHoi'
import CauTraLoi from '@/components/Tables/XacNhan/CauTraLoi'
import {khaoSatBangDiemModel} from '@/models/khaoSatBangDiemModel'
import {khaoSatCauHoiModel} from '@/models/khaoSatCauHoiModel'
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  components: {
    LayoutDefault,
    IBreadcrumb,
    CauTraLoi,
    CauHoi
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
          text: 'Xác Nhận',
          disabled: false,
          href: '/Auth/KhaoSat/XacNhan'
        }
      ],
      category: {},
      iData: [],
      loading: false,
      questions: [],
      year: new Date().getFullYear(),
      categoryId: 0,
      tempCatId: 0,
      categories: [],
      isSubmitting: false,
      disableSubmit: true,
      total: 0,
      total1: 0,
      total2: 0,
      tinhTrangHienTai: 0,
      donViDanhGia:''
    }
  },
  computed: {
    ...mapState('khaoSatStore', ['bangDiem', 'cauHoi']),
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
      this.categories = []
      this.data = []
      this.fnGetDanhMuc()
    },
    categoryId() {
      this.data = []
      this.fnGetCauHoi()
    },
    bangDiem(val) {
      let total = 0
      let total2 = 0
      val.forEach((item) => {
        total += item.diem
        total2 += item.diemThamDinh
        this.tinhTrangHienTai = item.trangThai
      })
      this.total = total
      this.total2 = total2
    }
  },
  async created() {
    this.categoryId = this.$route.query.categoryId
    await this.fnGetDanhMuc()
    await this.fnGetAvailable()
    this.$axios.get(`auth/don-vi/id/${this.$route.params.orgId}`).then(res => {
      this.donViDanhGia = res.data.data.tenDonVi
      this.breadcrumbs.push({
        text: this.donViDanhGia,
        disabled: false,
        href: '/Auth/KhaoSat/XacNhan/' + this.$route.params.orgId
      })
    })
  },
  methods: {
    async fnExportToWord() {
      await this.$axios.post('auth/file-manager/export-to-word/xac-nhan', {
        bangDiem: this.bangDiem,
        cauHoi: this.cauHoi,
        danhMuc: this.categoryId,
        maDonVi: this.$route.params.orgId
      }).then((res) => {
        window.location.href = process.env.VUE_APP_BASE_URL + 'storage/XacNhan/' + res.data.file
      })
    },
    async fnGetDanhMuc() {
      await this.$axios.get('auth/khao-sat/xac-nhan/danh-muc', {params: {namApDung: this.year}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))

        setTimeout(() => {
          this.categoryId = this.$route.query.categoryId
        }, 1000)

      }).catch()
          .finally(() => {
            this.tempCatId = parseInt(this.$route.query.categoryId.toString()) == 0 ? this.categories[0].id : parseInt(this.$route.query.categoryId.toString())
          })
      await this.fnGetAvailable()
    },
    fnGetCauHoi() {
      this.$axios.get('auth/khao-sat/xac-nhan/cau-hoi', {
        params: {
          maDanhMuc: this.categoryId,
          maDonVi: this.$route.params.orgId
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
    async fnGetAvailable() {
      await this.$axios.post('auth/khao-sat/xac-nhan/kiem-tra-hop-le', {
        maDanhMuc: this.categoryId,
        maDonVi: this.$route.params.orgId
      })
          .then((res) => {
            this.tinhTrangHienTai = res.data.data
            this.disableSubmit = this.tinhTrangHienTai === 4
            this.$store.commit('khaoSatStore/kiemTraThamDinh', this.disableSubmit)
          }).catch()
    },

    fnSubmit() {
      this.isSubmitting = true

      this.$axios.post('auth/khao-sat/xac-nhan/gui-diem', {
        maDonVi: this.$route.params.orgId,
        namApDung: this.year,
        maDanhMuc: this.categoryId,
        bangDiem: this.bangDiem
      })
          .then((res) => {
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
          }).catch().finally(() => {
        this.isSubmitting = false
        this.fnGetAvailable()
      })
    },

    fnKetThuc() {
      this.isSubmitting = true
      this.$axios.post('auth/khao-sat/xac-nhan/gui-diem-tong-hop', {
        maDonVi: this.$route.params.orgId,
        namApDung: this.year,
        maDanhMuc: this.categoryId,
        diem: this.total2
      })
          .then((res) => {
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
          }).catch().finally(() => {
        this.isSubmitting = false
        this.fnGetAvailable()
      })
    }
  }
}
</script>
<style lang="scss">
table#xacnhan {
  border-collapse: collapse;
  width: 100%;
  min-width: 860px !important;

  th {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
    color: #000;
    font-weight: bold;
  }

  th, td {
    padding: 0.25rem;
    border: 1px solid #ccc;

    textarea {
      font-size: 12px;
    }
  }

  /*tr:nth-child(even) {
      background-color: #f2f2f2;
  }
*/
  tr:hover {
    background-color: #ddd;
  }
}
</style>
