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
    <td class="text-center" :rowspan="question.danhDauCau == 1 && question.childrenCount > 0 ? question.childrenCount + 1 : false">
      <template v-if="question.danhDauCau == 1">
        <label class="v-btn  blue-grey pa-1 text--white"
               :for="'uploadFile_' + question.id">
          Minh chứng
          <v-icon
              right
              dark
          >
            mdi-cloud-upload
          </v-icon>
        </label>
        <v-file-input
            :id="'uploadFile_' + question.id"
            dense
            hide-details
            prepend-icon=""
            prepend-inner-icon="mdi-upload"
            placeholder="Chọn file"
            height="20"
            style="min-height: auto"
            clearable
            @change="upload"
            :disabled="disableYKien"
            hide-input
        />
        <div class="mt-0">
          <v-progress-linear
              v-if="loading"
              indeterminate
              color="indigo"
          />
        </div>

        <div v-if="fileName != null && fileName.length>0" class="text-center">
          <v-tooltip top color="primary" v-for="(file,index) of fileName" :key="file.fileName + '_' + index">
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
                  :href="download(file)"
              >

                <span class="ml-2">{{file.fileName}}</span>
                <v-icon
                    dark
                    right
                >
                  mdi-cloud-download
                </v-icon>
                <v-icon
                    class="red--text"
                    right
                    @click="clearFile(file)"
                >
                  mdi-delete-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Tải về</span>
          </v-tooltip>
          <div v-if="question.danhDauCau == 1 && ghiChuDanhGia != null">
            <v-textarea
                v-model="ghiChuDanhGia"
                label="Nội dung"
                dense
                outlined
                hide-details
                style="height: 100%; width: 100%"
                no-resize
                class="mt-2"
                :readonly="true"
            />
          </div>
        </div>
      </template>
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
        <div v-if="!question.hasChild">
          <v-textarea
              v-if="ghiChuThamDinh"
              v-model="ghiChuThamDinh"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              style="height: 100%; width: 100%"
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
              v-if="(!disableYKien || disableYKien && ghiChuYKien != null)"
              v-model="ghiChuYKien"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              style="height: 100%; width: 100%"
              no-resize
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
  emits:['updateFileDanhGia'],
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
        this.fileName = JSON.parse(item.fileDanhGia)
        this.ghiChuDanhGia = item.ghiChuDanhGia
        this.ghiChuThamDinh = item.ghiChuThamDinh
      }
      console.log(this.fileName, typeof (this.fileName))
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
    clearFile(file) {
      this.$axios.delete('auth/file-manager/singleRemove', {
        params: {
          fileUrl: file.fileUrl
        }
      })
          .then((res) => {
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
            const idx = this.fileName.indexOf(file)
            if (idx > -1) {
              this.fileName.splice(idx, 1)
            }
            this.capNhatBangDiem()
            this.$emit('updateFileDanhGia')
          })
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
<style>
label.v-btn{
  color: white;
 font-size: small;
}
</style>