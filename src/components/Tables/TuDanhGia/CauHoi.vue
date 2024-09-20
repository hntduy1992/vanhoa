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
            :disabled="disableTuDanhGia"
        />
        <div class="mt-0">
          <v-progress-linear
              v-if="loading"
              indeterminate
              color="indigo"
          />
        </div>
        <div v-if="fileName != null" class="text-center">
          <v-tooltip v-for="(file,index) of fileName" :key="index" top color="primary">
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
                  :href="download(file.fileUrl)"
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
            <!--            <span>{{ fileName.split('/').pop() }}</span>-->
          </v-tooltip>
          <v-btn
              v-if="!disableTuDanhGia"
              icon
              color="red"
              @click="clearFile()"
          >
            <v-icon>mdi-delete-circle-outline</v-icon>
          </v-btn>
        </div>
      </template>
    </td>
    <td
        class="text-center"
        :rowspan="question.danhDauCau == 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false"
    >
      <div v-if="question.danhDauCau == 1">
        <v-textarea
            v-model="ghiChuDanhGia"
            label="Nội dung"
            dense
            outlined
            hide-details
            class="mt-2"
            :disabled="disableTuDanhGia"
        />
      </div>
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
    },
    namApDung: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      score: 0,
      fileName: null,
      ghiChuDanhGia: null
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi']),
    ...mapState('khaoSatStore', ['disableTuDanhGia']),
    diemTuDanhGia() {
      return this.cauHoi.find(a => a.maCauHoi === this.question.id)?.diem ?? 0
    }
  },
  watch: {
    bangDiem() {
      if (this.question.danhDauCau === 1) {
        const item = this.bangDiem.find(model => model.maCauHoi === this.question.id)
        this.fileName = item.fileDanhGia
        this.ghiChuDanhGia = item.ghiChuDanhGia
      }
    },
    ghiChuDanhGia() {
      this.capNhatBangDiem()
    }
  },
  methods: {
    download(fileUrl) {
      return process.env.VUE_APP_BASE_URL + 'storage/' + fileUrl
    },

    async upload(files) {
      this.loading = true
      if (!files) {
        this.loading = false
        return null
      }
      const formData = new FormData()
      formData.append('maDanhMuc', this.question.maDanhMuc)
      formData.append('maCauHoi', this.question.id)
      formData.append('namApDung', this.namApDung)
      formData.append('file', files)
      await this.$axios.post('auth/file-manager/singleUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
          .then((res) => {
            if (res.data.success) {
              this.fileName.push({'fileUrl': res.data.fileUrl, 'fileName': res.data.fileName})
              console.log(this.fileName)
            }
          }).catch()
          .finally(() => {
            this.capNhatBangDiem()
            this.loading = false
          })
    },
    clearFile() {
      this.fileName = null
      this.capNhatBangDiem()
    },
    capNhatBangDiem() {
      this.dialog = false
      const dataStore = JSON.parse(JSON.stringify(this.bangDiem))
      const idx = dataStore.findIndex(item => item.maCauHoi === this.question.id)
      dataStore[idx].ghiChuDanhGia = this.ghiChuDanhGia
      dataStore[idx].fileDanhGia = this.fileName
      this.$store.commit('khaoSatStore/capNhatBangDiem', {index: idx, value: dataStore[idx]})
    }
  }
}
</script>

<style scoped>

</style>
