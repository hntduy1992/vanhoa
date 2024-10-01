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
                <th>Điểm lớn nhất</th>
                <th>Tự đánh giá</th>
                <th>Ghi chú tự đánh giá</th>
                <th>Thẩm định</th>
                <th style="width: 15%">Ghi chú thẩm định</th>
                <th style="width: 15%">Ý kiến đơn vị</th>
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
                <td colspan="9" class="text-center">
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
                    <span class="font-weight-bold red--text">
                      {{
                        parseFloat(total2).toFixed(2)
                      }}
                    </span>
                </td>
                <td/>
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
                color="info"
                :loading="isSubmitting"
                :disabled="!disableSubmit"
                @click="fnChangeState"
            >
              Thẩm định lại
            </v-btn>
            <v-btn
                color="error"
                :loading="isSubmitting"
                :disabled="disableSubmit"
                @click.stop="fnSubmit"
            >
              Xác nhận và kết thúc
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>

import {mapState} from 'vuex'
import CauHoi from '@/components/Tables/XacNhan/CauHoiYKien'
import CauTraLoi from '@/components/Tables/XacNhan/CauTraLoiYKien'
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
          href: '/Auth/Dashboard'
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
      namApDung: 0,
      namApDungs: [],
      categoryId: 0,
      categories: [],
      isSubmitting: false,
      disableSubmit: true,
      total: 0,
      total1: 0,
      total2: 0,
      donViDanhGia: null
    }
  },
  computed: {
    ...mapState('khaoSatStore', ['bangDiem', 'cauHoi']),
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
      let total2 = 0
      val.forEach((item) => {
        total += item.diem
        total2 += item.diemThamDinh
      })
      this.total = total
      this.total2 = total2
    }
  },
  created() {
    this.fnGetNamApDung()
    this.$axios.get(`auth/don-vi/id/${this.$route.params.orgId}`).then(res => {
      this.donViDanhGia = res.data.data.tenDonVi
      this.breadcrumbs.push({
        text: this.donViDanhGia,
        disabled: false,
        href: '/Auth/KhaoSat/XacNhan/'+this.$route.params.orgId
      })
    })

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
    async fnExportToWord() {
      await this.$axios.post('auth/file-manager/export-to-word/bien-ban', {
        bangDiem: this.bangDiem,
        cauHoi: this.cauHoi,
        danhMuc: this.categoryId,
        donVi: this.$route.params.orgId
      }).then((res) => {
        window.location.href = process.env.VUE_APP_BASE_URL + 'storage/BienBan/' + res.data.file
      })
    },
    async fnGetDanhMuc() {
      await this.$axios.get('auth/khao-sat/xac-nhan/danh-muc', {params: {namApDung: this.namApDung.value,maDonVi: this.$route.params.orgId}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
        this.categoryId = this.categories[0]?.id
        this.fnGetAvailable()
      }).catch((err) => {
        // this.$store.dispatch('SnackbarStore/showSnackBar', err)
        console.log(err)
      })
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
      await this.$axios.post('auth/khao-sat/xac-nhan/kiem-tra-tong-hop', {
        maDanhMuc: this.categoryId,
        maDonVi: this.$route.params.orgId
      })
          .then((res) => {
            this.disableSubmit = !res.data.data
            this.$store.commit('khaoSatStore/kiemTraThamDinh', this.disableSubmit)
          }).catch()
    },
    fnChangeState(){
      this.isSubmitting = true
      this.$axios.post('auth/khao-sat/xac-nhan/khoi-phuc-trang-thai', {
        maDonVi: this.$route.params.orgId,
        namApDung: this.namApDung.value,
        maDanhMuc: this.categoryId,
      })
          .then((res) => {
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
          }).catch().finally(() => {
        this.isSubmitting = false
        this.fnGetAvailable()
      })
    },
    fnSubmit() {
      this.isSubmitting = true
      this.$axios.post('auth/khao-sat/xac-nhan/gui-diem-tong-hop', {
        maDonVi: this.$route.params.orgId,
        namApDung: this.namApDung.value,
        maDanhMuc: this.categoryId,
        diem: this.total2
      })
          .then((res) => {
            this.disableSubmit = !res.data.data
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
            // this.$axios.post('uth/file-manager/export-to-word/bien-ban',)
            this.fnExportToWord()
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

}
</style>
