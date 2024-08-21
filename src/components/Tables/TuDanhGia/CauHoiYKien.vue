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
    <td :rowspan="question.danhDauCau == 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false">
      <template v-if="question.danhDauCau == 1">
        <v-file-input
            dense
            hide-details
            prepend-icon=""
            prepend-inner-icon="mdi-upload"
            placeholder="Chọn file"
            height="20"
            style="min-height: auto"
            clearable
            @change="upload"
            @click:clear="clearFile"
            :disabled="disableYKien"
        />
        <div v-if="fileName != null" class="text-center">
          <v-tooltip top color="primary">
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
                <span class="ml-2">Tải về</span>
              </v-btn>
            </template>
            <span>{{ fileName.split('/').pop() }}</span>
          </v-tooltip>
        </div>
      </template>
    </td>
    <td
        class="text-center"
        :rowspan="question.danhDauCau == 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
    >
      <div v-if="question.danhDauCau == 1 && ghiChuDanhGia != null" style="width: 150px">
        <v-textarea
            v-model="ghiChuDanhGia"
            label="Nội dung"
            dense
            outlined
            hide-details
            rows="2"
            class="mt-2"
            :readonly="true"
        />
      </div>
    </td>
    <td class="text-center">
      <span
          :class="{ 'font-weight-bold': question.level == 0, 'red--text': question.level == 0}"
      >{{ parseFloat(diemThamDinh).toFixed(2) }}</span>
    </td>
    <td
        :rowspan="question.danhDauCau == 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
        class="text-center"
    >
      <template v-if="question.danhDauCau === 1">
        <div v-if="!question.hasChild" style="width: 150px">
          <v-textarea
              v-if="ghiChuThamDinh"
              v-model="ghiChuThamDinh"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              rows="2"
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
        <div v-if="!question.hasChild" style="width: 150px">
          <v-textarea
              v-if="(!disableYKien || disableYKien && ghiChuYKien != null)"
              v-model="ghiChuYKien"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              rows="2"
              :readonly="disableYKien"
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
      fileName: null,
      ghiChuDanhGia: null,
      ghiChuThamDinh: null,
      ghiChuYKien: null,
      dontHavePermission: false,
      iReact: true
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi']),
    ...mapState('khaoSatStore', ['disableYKien', 'bangYKien']),
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
        this.fileName = JSON.parse(JSON.stringify(item.fileDanhGia))
        this.ghiChuDanhGia = item.ghiChuDanhGia
        this.ghiChuThamDinh = item.ghiChuThamDinh
      }
    },
    ghiChuYKien(val) {
      if (val)
        this.$store.commit('khaoSatStore/bangYKien', {id: this.question.id, content: val})
    }
  },
  methods: {
    download() {
      return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileName
    },
    async upload(files) {
      this.loading = true
      if (!files) {
        this.loading = false
        return null
      }
      const formData = new FormData()
      formData.append('file', files)
      await this.$axios.post('auth/file-manager/singleUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
          .then((res) => {
            if (res.data.success) {
              this.$store.commit('khaoSatStore/capNhatFile', {
                id: this.question?.bangdiem?.id,
                fileDanhGia: res.data.fileUrl
              })
            }
          }).catch()
          .finally(() => {
            this.loading = false
          })
    },
    clearFile() {
      this.$store.commit('khaoSatStore/capNhatFile', {id: this.question?.bangdiem?.id, fileDanhGia: null})
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
