<template>
  <tr>
    <td class="font-weight-bold text-center">
      {{ question.stt }}
    </td>
    <td>
      {{ question.tenCauHoi }}
    </td>
    <td class="text-center font-italic">
      {{ question.diemLonNhat }}
    </td>
    <td>
      <template v-if="question.loaiCauHoi === 1 || question.danhDauCau === 3 && question.loaiCauHoi === 1">
        <v-text-field
            v-if="question.kieuNhapLieu === 'Text'"
            v-model="formInput"
            dense
            hide-details
            outlined
            label="Nhập điểm"
            :disabled="disableTuDanhGia"
            @change="fnChangePoint"
        />
        <v-select
            v-else-if="question.kieuNhapLieu === 'Select'"
            v-model="formInput"
            dense
            hide-details
            placeholder="Chọn"
            style="width: 70px; min-width: 0; margin: 0 auto"
            item-text="name"
            item-value="id"
            :return-object="false"
            :items="points"
            :disabled="disableTuDanhGia"
            @change="fnChangePoint"
        />
        <v-checkbox
            v-else-if="question.kieuNhapLieu === 'Checkbox'"
            v-model="formInput"
            dense
            hide-details
            color="red"
            class="align-center justify-center pa-0"
            style="margin: 0 auto; width: 24px;"
            :value="question.diemLonNhat"
            :true-value="question.diemLonNhat"
            :input-value="question.diemLonNhat"
            :disabled="disableTuDanhGia"
            @change="fnChangePoint"
        />
        <v-radio-group
            v-else
            v-model="formInput"
            dense
            hide-details
            class="pa-0"
            style="margin: 0 auto; width: 24px;"
            :disabled="disableTuDanhGia"
            @change="fnChangePoint"
        >
          <v-radio
              color="red"
              :value="question.diemLonNhat"
          />
        </v-radio-group>
      </template>
    </td>
    <template v-if="question.danhDauCau === 3 && question.loaiCauHoi === 1">
      <td>
        <v-file-input
            dense
            hide-details
            prepend-icon=""
            prepend-inner-icon="mdi-upload"
            placeholder="Chọn file"
            height="20"
            style="min-height: auto"
            clearable
            :disabled="disableTuDanhGia"
            @change="upload"
            @click:clear="clearFile"
        />
        <div class="mt-0">
          <v-progress-linear
              v-if="loading"
              indeterminate
              color="indigo"
          />
        </div>
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
          <v-btn
              v-if="disableTuDanhGia"
              icon
              color="red"
              @click="clearFile()"
          >
            <v-icon>mdi-delete-circle-outline</v-icon>
          </v-btn>
        </div>
      </td>
      <td class="text-center">
        <v-textarea
            v-model="ghiChuDanhGia"
            label="Nội dung"
            dense
            outlined
            hide-details
            class="mt-2"
            :disabled="disableTuDanhGia"
        />
      </td>
    </template>
    <template v-if="question.loaiCauHoi === 2">
      <td/>
      <td class="text-center font-weight-bold">
        ĐTXHH
      </td>
    </template>
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
      loading: false,
      formInput: null,
      minQuestion: {},
      ghiChuDanhGia: null,
      fileName: null,
      iReact: true
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi', 'eventChange']),
    ...mapState('khaoSatStore', ['disableTuDanhGia']),
    points() {
      const rPoints = []
      let counter = JSON.parse(JSON.stringify(this.question.diemNhoNhat));
      while (Number(counter.toFixed(2)) <= this.question.diemLonNhat) {
        rPoints.push({
          id: Number(counter.toFixed(2)),
          name: counter.toFixed(2)
        })
        counter += this.question.buocNhay
      }
      /*for (let i = JSON.parse(JSON.stringify(this.question.diemNhoNhat)); i <= this.question.diemLonNhat; i += this.question.buocNhay) {
        rPoints.push({
          id: Number(i.toFixed(2)),
          name: i.toFixed(2)
        })
      }*/
      return rPoints
    },
    parent() {
      return this.cauHoi.find(model => model.maCauHoi === this.question.parentId) || {}
    }
  },
  watch: {
    eventChange() {
      if (Object.keys(this.eventChange).length !== 0 && this.eventChange.maCauHoi === this.question.parentId) {
        if (this.eventChange.maCauTraLoi !== this.question.id) {
          this.formInput = ''
        }
      }
    },
    bangDiem() {
      if (!this.iReact) {
        return null
      }
      if (this.question.loaiCauHoi === 1 && this.question.danhDauCau === 2) {
        const item = this.bangDiem.find(model => model.maCauHoi === this.question.parentId)
        this.fnSetValueForm(item)
      }
      if (this.question.loaiCauHoi === 1 && this.question.danhDauCau === 3) {
        const item = this.bangDiem.find(model => model.maCauHoi === this.question.id)
        this.fnSetValueForm(item)
        this.fileName = item?.fileDanhGia
        this.ghiChuDanhGia = item?.ghiChuDanhGia
      }
    },
    ghiChuDanhGia() {
      this.capNhatBangDiem()
    }
  },
  methods: {
    download() {
      return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileName
    },
    fnChangePoint(val) {
      val = val ? Number(val) : 0
      const dataStore = JSON.parse(JSON.stringify(this.bangDiem))
      let item = {}
      if (this.question.danhDauCau === 3) {
        item = dataStore.find(item => item.maCauHoi === this.question.id)
      } else {
        item = dataStore.find(item => item.maCauHoi === this.question.parentId)
      }
      if (this.parent.loaiDieuKien === 'OR') {
        item.diem = val
        item.noiDungTraLoi = [{
          id: this.question.id,
          diem: val
        }]
      } else {
        const idx = item?.noiDungTraLoi.findIndex(m => m.id === this.question.id)
        if (idx === -1) {
          item.noiDungTraLoi.push({
            id: this.question.id,
            diem: val
          })
        } else {
          item.noiDungTraLoi[idx].diem = val
        }
        let diem = 0
        item.noiDungTraLoi.forEach((item) => {
          diem += item.diem
        })
        item.diem = diem
      }
      const idx = this.bangDiem.findIndex(a => a.maCauHoi === item.maCauHoi)
      this.$store.dispatch('khaoSatStore/capNhatBangDiem', {
        index: idx,
        value: item
      })
      if (this.parent?.loaiDieuKien === 'OR') {
        this.$store.commit('khaoSatStore/eventChange', {
          maCauHoi: item.maCauHoi,
          maCauTraLoi: item.noiDungTraLoi[0]?.id
        })
      }
    },
    // eslint-disable-next-line require-await

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
              this.fileName = res.data.fileUrl
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
      this.$store.commit('khaoSatStore/capNhatBangDiem', {
        index: idx,
        value: dataStore[idx]
      })
    },
    fnSetValueForm(item) {
      this.iReact = false
      const a = item?.noiDungTraLoi.find(i => i.id === this.question.id)
      if (a) {
        this.formInput = a.diem
        this.$store.dispatch('khaoSatStore/capNhatDiemCapTren', item)
      }
    }
  }
}
</script>

<style scoped>

</style>
