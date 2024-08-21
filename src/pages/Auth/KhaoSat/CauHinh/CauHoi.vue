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
                id="surveys"
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
              <template #body="{ items }">
                <tbody>
                <template v-for="(item, index) in items">
                  <tr :key="item.tenCauHoi + index">
                    <td :class="{ 'font-weight-bold': item.danhDauCau === 0, 'pl-2': true }">
                      {{ item.stt }}
                    </td>
                    <td>
                      {{ item.tenCauHoi }}
                    </td>
                    <td class="text-center">
                      <strong v-if="item.danhDauCau != 2">{{ item.diemLonNhat }}</strong>
                    </td>
                    <td>
                      <template v-if="item.danhDauCau === 1 || item.danhDauCau === 3">
                        <v-autocomplete
                            v-model="item.donvithamdinh.maDonVi"
                            dense
                            label="Đơn vị"
                            hide-details
                            style="width: 310px"
                            item-value="id"
                            item-text="name"
                            clearable
                            :items="organizations"
                            :return-object="false"
                            @change="fnChange(item.id, item.donvithamdinh.maDonVi)"
                        />
                      </template>
                    </td>
                    <td class="text-center">
                      <template v-if="item.loaiCauHoi === 2">
                        <span class="font-weight-bold">ĐTXHH</span>
                      </template>
                    </td>
                  </tr>
                </template>
                <template v-if="items.length == 0">
                  <tr>
                    <td class="text-center" colspan="4">
                      <span>Không có dữ liệu</span>
                    </td>
                  </tr>
                </template>
                </tbody>
              </template>
            </v-data-table>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
                width="100"
                color="error"
                :loading="isSubmitting"
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

import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";
export default {
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
          text: 'PHÂN CÔNG THẨM ĐỊNH TIÊU CHÍ',
          disabled: false,
          href: '/Auth/KhaoSat/CauHinh/CauHoi'
        }
      ],
      category: {},
      data: [],
      loading: false,
      isSubmitting: false,
      headers: [
        {
          text: 'STT',
          value: 'stt',
          width: 20
        },
        {
          text: 'Tiêu chí',
          value: 'name',
          width: 560
        },
        {
          text: 'Điểm tối đa',
          value: 'maxScore',
          align: 'center',
          width: 146
        },
        {
          text: 'Đơn vị thẩm định',
          value: 'organization',
          align: 'center',
          width: 210
        },
        {
          text: 'Ghi chú',
          value: 'action',
          align: 'center',
          width: 100
        }
      ],
      organizations: [],
      categories: [],
      year: new Date().getFullYear(),
      categoryId: 0,
      assigned: []
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
      this.category = {}
      this.data = []
      this.fnGetCategories()
    },
    categoryId() {
      this.category = {}
      this.data = []
      this.fnGetQuestions()
    }
  },
  created() {
    this.fnGetOrg()
    this.fnGetCategories()
  },
  methods: {
    async fnGetOrg() {
      await this.$axios.get('auth/don-vi/select').then((res) => {
        this.organizations = (res.data.data).map(item => ({
          id: item.id,
          name: item.tenDonVi
        }))
      }).catch()
    },
    async fnGetCategories() {
      await this.$axios.get('auth/khao-sat/danh-muc/select', {
        params: {
          year: this.year
        }
      }).then((res) => {
        this.categories = (res.data.data).map(item => ({
          id: item.id,
          name: item.tenDanhMuc
        }))
        this.categoryId = this.categories[0]?.id ?? 0
      }).catch()
        .finally(() => {
          this.loading = false
        })
    },
    async fnGetQuestions() {
      this.loading = true
      await this.$axios.get('auth/khao-sat/cau-hoi/don-vi-tham-dinh', {
        params: {
          year: this.year,
          categoryId: this.categoryId
        }
      })
        .then((res) => {
          this.data = (res.data.data).map((item) => {
            if (item.donvithamdinh) {
              this.assigned.push(item.donvithamdinh)
            }
            return {
              id: item.id,
              stt: item.stt,
              tenCauHoi: item.tenCauHoi,
              diemLonNhat: item.diemLonNhat,
              danhDauCau: item.danhDauCau,
              loaiCauHoi: item.loaiCauHoi,
              donvithamdinh: item.donvithamdinh ?? {}
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    fnChange(maCauHoi, maDonVi) {
      const item = this.assigned.find(item => item.maCauHoi === maCauHoi)
      if (item) {
        item.maDonVi = maDonVi
      } else {
        this.assigned.push({
          maDanhMuc: this.categoryId,
          maCauHoi,
          maDonVi
        })
      }
    },
    async fnSubmit() {
      this.isSubmitting = true
      await this.$axios.post('auth/khao-sat/cau-hoi/don-vi-tham-dinh/' + this.categoryId, this.assigned).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
      }).catch().finally(() => {
        this.isSubmitting = false
      })
    }
  }
}
</script>
<style lang="scss">
.v-data-table#surveys table {
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
