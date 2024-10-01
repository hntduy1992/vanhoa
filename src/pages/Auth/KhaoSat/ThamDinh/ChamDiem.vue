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
                    :disabled="true"
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
                    :disabled="true"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <h3 class="text-uppercase text-center">{{ donViDanhGia }}</h3>
        <v-card min-width="860">
          <v-card-text>
            <table
                id="thamdinh"
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
                <th style="width: 15vw">Ghi chú thẩm định</th>
                <th v-if="$route.query.thamDinhLai == 1">Ý kiến đơn vị</th>
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
                  <span class="font-weight-bold red--text">{{ parseFloat(total2).toFixed(2) }}</span>
                </td>
              </tr>
              </tfoot>
            </table>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
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
import CauHoi from '@/components/Tables/ThamDinh/CauHoi'
import CauTraLoi from '@/components/Tables/ThamDinh/CauTraLoi'
import {khaoSatBangDiemModel} from '@/models/khaoSatBangDiemModel'
import {khaoSatCauHoiModel} from '@/models/khaoSatCauHoiModel'
import LayoutDefault from "@/layouts/default"
import IBreadcrumb from "@/components/IBreadcrumb"

export default {
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Thẩm định',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
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
          text: 'THẨM ĐỊNH',
          disabled: false,
          href: '/Auth/KhaoSat/ThamDinh'
        },
        {
          text: 'CHẤM ĐIỂM',
          disabled: false,
          href: '/Auth/KhaoSat/ThamDinh/ChamDiem'
        }
      ],
      donViDanhGia: null,
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
      total2: 0
    }
  },
  computed: {
    ...mapState('khaoSatStore', ['bangDiem', 'permissions']),
    ...mapState('authStore', ['auth']),
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
        if (item.maDonViThamDinh === this.auth.user.organizationId)
          total2 += item.diemThamDinh
      })
      this.total = total
      this.total2 = total2
    }
  },
  mounted() {
    this.categoryId = this.$route.query.categoryId
    this.fnGetDanhMuc()
    this.fnGetAvailable()
    this.$axios.get(`auth/don-vi/id/${this.$route.params.orgId}`).then(res=>{
      this.donViDanhGia = res.data.data.tenDonVi
    })
  },
  methods: {
    fnGetDanhMuc() {
      this.$axios.get('auth/khao-sat/tham-dinh/danh-muc', {params: {namApDung: this.year}}).then((res) => {
        this.categories = (res.data?.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
      }).catch()
          .finally(() => {
            this.tempCatId = parseInt(this.$route.query.categoryId.toString()) == 0 ? this.categories[0].id : parseInt(this.$route.query.categoryId.toString())
          })

    },
    fnGetCauHoi() {
      this.$axios.get('auth/khao-sat/tham-dinh/cau-hoi', {
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
    fnGetAvailable() {
      this.$axios.post('auth/khao-sat/tham-dinh/kiem-tra-hop-le', {
        maDanhMuc: this.categoryId,
        maDonVi: this.$route.params.orgId
      })
          .then((res) => {
            this.disableSubmit = !res.data.data
            this.$store.commit('khaoSatStore/kiemTraThamDinh', this.disableSubmit)
          }).catch()
    },
    fnSubmit() {
      this.isSubmitting = true
      const result = []
      this.permissions.forEach((maCauHoi) => {
        const res = this.$store.getters['khaoSatStore/bangDiem'].find(i => i.maCauHoi === maCauHoi)
        if (res) {
          result.push(res)
        }
      })
      this.$axios.post('auth/khao-sat/tham-dinh/luu-diem', result)
          .then((res) => {
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data);
            this.$router.push({name: 'ThamDinh'})

          }).catch().finally(() => {
        this.isSubmitting = false
      })
    }
  }
}
</script>
<style lang="scss">
table#thamdinh {
  border-collapse: collapse;
  width: 100%;
  min-width: 860px !important;

  th {
    border: 1px solid #ddd;
    padding: 12px;
    color: #000;
    font-weight: bold;
    text-align: center;
  }

  th, td {
    padding: 0.25rem;
    border: 1px solid #ccc;
  }

  tr:hover {
    background-color: #ddd;
  }
}
</style>
