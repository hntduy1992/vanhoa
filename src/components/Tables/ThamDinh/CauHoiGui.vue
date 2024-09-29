<template>
    <tr>
        <td class="font-weight-bold text-center">
            {{ question.stt }}
        </td>
        <td>
            {{ question.tenCauHoi }}
        </td>
        <td class="text-center">
      <span
          :class="{ 'font-weight-bold': true, 'red--text': question.level === 0}"
      >{{ parseFloat(question.diemLonNhat).toFixed(2) }}</span>
        </td>
        <td class="text-center">
      <span
          :class="{ 'font-weight-bold': question.level == 0, 'red--text': question.level === 0}"
      >{{ parseFloat(diemTuDanhGia).toFixed(2) }}</span>
        </td>
        <td :rowspan="question.danhDauCau === 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
            class="w-cell-100">
            <template v-if="question.danhDauCau === 1">
              <template v-if="fileName">
                <v-btn
                    v-for="(file,index) of fileName" :key="index"
                    color="blue-grey"
                    class="ma-2 white--text"
                    elevation="0"
                    small
                    link
                    target="_blank"
                    :href="download(file.fileUrl)"
                >
                  <v-icon
                      dark
                      left
                  >
                    mdi-cloud-download
                  </v-icon>
                  <span>{{ file.fileName }}</span>
                </v-btn>
              </template>
              <template v-if="question.danhDauCau === 1 && ghiChuDanhGia != null">
                <v-textarea
                    v-model="ghiChuDanhGia"
                    label="Nội dung"
                    dense
                    outlined
                    hide-details
                    class="mt-2"
                    :readonly="true"
                    style="height: 100%"
                    no-resize
                />
              </template>
            </template>
        </td>
        <td class="text-center">
      <span
          :class="{ 'font-weight-bold': question.level === 0, 'red--text': question.level === 0}"
      >{{ parseFloat(diemThamDinh).toFixed(2) }}</span>
        </td>
        <td
            :rowspan="question.danhDauCau === 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
            class="text-center"
        >
            <template v-if="question.danhDauCau === 1  && (!dontHavePermission || question.donViThamDinh === this.auth.user.organizationId)">
                <div v-if="!question.hasChild">
                    <v-textarea
                        v-model="ghiChuDanhGia"
                        label="Nội dung"
                        dense
                        outlined
                        hide-details
                        class="mt-2"
                        :readonly="true"
                        style="height: 100%"
                        no-resize
                    />
                </div>
            </template>
        </td>
        <td
            v-if="$route.query.thamDinhLai == 1"
            :rowspan="question.danhDauCau === 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
            class="text-center"
        >
            <template v-if="question.danhDauCau === 1 && !dontHavePermission">
                <div v-if="!question.hasChild" style="width: 150px">
                  <v-textarea
                      v-if="ghiChuYKien != null"
                      v-model="ghiChuYKien"
                      label="Nội dung"
                      dense
                      outlined
                      hide-details
                      class="mt-2"
                      :readonly="true"
                      style="height: 100%"
                      no-resize
                  />
                    <span v-else>Thống nhất</span>
                </div>
            </template>
        </td>
    </tr>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
    props: {
        question: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            dialog: false,
            dialog2: false,
            loading: false,
            score: 0,
            fileName: [],
            ghiChuDanhGia: null,
            ghiChuThamDinh: null,
            dontHavePermission: true,
            iReact: true,
            ghiChuYKien: null
        }
    },
    computed: {
        ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi']),
        ...mapState('khaoSatStore', ['disableThamDinh', 'permissions']),
        ...mapState('authStore', ['auth']),
        diemTuDanhGia() {
            return this.cauHoi.find(a => a.maCauHoi === this.question.id)?.diem
        },
        diemThamDinh() {
            return this.cauHoi.find(a => a.maCauHoi === this.question.id)?.diemThamDinh
        }
    },
    watch: {
        bangDiem() {
            if (this.question.danhDauCau === 1) {
                const item = this.bangDiem.find(model => model.maCauHoi === this.question.id)
              this.fileName = JSON.parse(item.fileDanhGia) || []
                this.ghiChuDanhGia = item.ghiChuDanhGia
                this.ghiChuThamDinh = item.ghiChuThamDinh
            }
        },
        cauHoi() {
            if (!this.iReact) {
                return null
            }
            this.iReact = false

            if (this.question.donViThamDinh === this.auth.user.organizationId) {
              const permissions = JSON.parse(JSON.stringify(this.permissions))
              permissions.push(this.question.id)
              this.$store.commit('khaoSatStore/permissions', permissions)
            }

            if (!this.disableThamDinh && this.question.donViThamDinh === this.auth.user.organizationId) {
              this.dontHavePermission = false
            } else {
              this.dontHavePermission = true
            }

          /* if (this.question.donViThamDinh === this.auth.user.organizationId) {
               this.dontHavePermission = false
               const permissions = JSON.parse(JSON.stringify(this.permissions))
               permissions.push(this.question.id)
               this.$store.commit('khaoSatStore/permissions', permissions)
           } else {
               this.dontHavePermission = true
           }*/
        }
    },
    methods: {
        download() {
            return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileName
        }
    },
    created() {
        if (this.$route.query.thamDinhLai == 1) {
            this.ghiChuYKien = this.question?.ykien?.noiDung

        }
    }
}
</script>
