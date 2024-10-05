<template>
  <tr class="border-top">
    <td class="font-weight-bold text-center">
      {{ question.stt }}
    </td>
    <td style="font-weight: bold">
      {{ question.tenCauHoi }}
    </td>
    <td class="text-center">
      <span
          :class="{ 'font-weight-bold': true, 'red--text': question.level === 0}"
      >{{ parseFloat(question.diemLonNhat).toFixed(2) }}</span>
    </td>
    <td class="text-center">
      <span
          :class="{ 'font-weight-bold': question.level === 0, 'red--text': question.level === 0}"
      >{{ parseFloat(diemTuDanhGia).toFixed(2) }}</span>
    </td>
    <td :rowspan="question.danhDauCau === 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
        class="w-cell-100 text-center">
      <template v-if="question.danhDauCau === 1">
        <div v-if="fileName">
          <v-tooltip top color="primary" v-for="(file,index) of fileName" :key="file.fileName + '_'+ index">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="blue-grey"
                  class="mb-2 white--text"
                  elevation="0"
                  small
                  link
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                  :href="download(file)"
              >
                <v-icon
                    dark
                    left
                >
                  mdi-cloud-download
                </v-icon>
                <span class="ml-2">{{ file.fileName }}</span>
              </v-btn>
            </template>
            <span>Tải về</span>
          </v-tooltip>
        </div>
        <div v-if="question.danhDauCau == 1 && ghiChuDanhGia != null">
          <v-textarea
              v-model="ghiChuDanhGia"
              label="Nội dung"
              dense
              outlined
              hide-details
              style="height: 100%"
              no-resize
              class="mt-2"
              :readonly="true"
          />
        </div>
      </template>
    </td>
    <td class="text-center">
      <span
          :class="{ 'font-weight-bold': question.level == 0, 'red--text': question.level == 0}"
      >{{ parseFloat(diemThamDinh).toFixed(2) }}</span>
    </td>
    <td
        :rowspan="question.danhDauCau === 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
        class="text-center"
    >
      <template v-if="question.danhDauCau === 1">
        <div v-if="!question.hasChild" >
          <v-textarea
              v-if="ghiChuThamDinh"
              v-model="ghiChuThamDinh"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              style="height: 100%"
              no-resize
              :readonly="true"
          />
          <span v-else>Thống nhất</span>

        </div>
      </template>
    </td>
    <td
        :rowspan="question.danhDauCau === 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
        class="text-center"
    >
      <template v-if="question.danhDauCau === 1">
        <div v-if="!question.hasChild" >
          <v-textarea
              v-if="ghiChuYKien != null"
              v-model="ghiChuYKien"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              style="height: 100%"
              no-resize
              :readonly="true"
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
      dontHavePermission: false,
      ghiChuYKien: null,
      iReact: true
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
        this.fileName = JSON.parse(item.fileDanhGia)
        this.ghiChuDanhGia = item.ghiChuDanhGia
        this.ghiChuThamDinh = item.ghiChuThamDinh
      }
    }
  },
  methods: {
    download(file) {
      return process.env.VUE_APP_BASE_URL + 'storage/' + file.fileUrl
    },
    capNhatBangDiem() {
      this.dialog2 = false
      const dataStore = JSON.parse(JSON.stringify(this.bangDiem))
      const idx = dataStore.findIndex(item => item.maCauHoi === this.question.id)
      dataStore[idx].ghiChuThamDinh = this.ghiChuThamDinh
      this.$store.commit('khaoSatStore/capNhatBangDiem', {
        index: idx,
        value: dataStore[idx]
      })
    }
  },
  created() {
    this.ghiChuYKien = this.question?.ykien?.noiDung
  }
}
</script>
