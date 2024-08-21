<template>
  <tr>
    <template v-if="question.danhDauCau === 2">
      <td class="text-center">
        {{ question.stt }}
      </td>
      <td>
        {{ question.tenCauHoi }}
      </td>
      <td class="text-center font-italic">
        {{ question.diemLonNhat }}
      </td>
      <td class="text-center">
        <template v-if="question.loaiCauHoi === 1">
          <v-text-field
              v-if="question.kieuNhapLieu === 'Text'"
              v-model="formInput"
              dense
              hide-details
              outlined
              label="Nhập điểm"
              :disabled="true"
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
              :disabled="true"
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
              :disabled="true"
          />
          <v-radio-group
              v-else
              v-model="formInput"
              dense
              hide-details
              class="pa-0"
              style="margin: 0 auto; width: 24px;"
              :disabled="true"
          >
            <v-radio
                color="red"
                :value="question.diemLonNhat"
            />
          </v-radio-group>
        </template>
      </td>
      <td>
        <template>
          <v-text-field
              v-if="question.kieuNhapLieu === 'Text'"
              v-model="formThamDinh"
              dense
              hide-details
              outlined
              label="Nhập điểm"
              :disabled="true"
          />
          <v-select
              v-else-if="question.kieuNhapLieu === 'Select'"
              v-model="formThamDinh"
              dense
              hide-details
              placeholder="Chọn"
              style="width: 70px; min-width: 0; margin: 0 auto"
              item-text="name"
              item-value="id"
              :return-object="false"
              :items="points"
              :disabled="true"
          />
          <v-checkbox
              v-else-if="question.kieuNhapLieu === 'Checkbox'"
              v-model="formThamDinh"
              dense
              hide-details
              color="red"
              class="align-center justify-center pa-0"
              style="margin: 0 auto; width: 24px;"
              :value="question.diemLonNhat"
              :true-value="question.diemLonNhat"
              :input-value="question.diemLonNhat"
              :disabled="true"
          />
          <v-radio-group
              v-else
              v-model="formThamDinh"
              dense
              hide-details
              class="pa-0"
              style="margin: 0 auto; width: 24px;"
              :disabled="true"
          >
            <v-radio
                color="red"
                :value="question.diemLonNhat"
            />
          </v-radio-group>
        </template>
      </td>
    </template>
    <template v-else>
      <td class="text-center">
        {{ question.stt }}
      </td>
      <td>
        {{ question.tenCauHoi }}
      </td>
      <td/>
      <td class="text-center">
        <template v-if="question.loaiCauHoi === 1 && question.danhDauCau === 3">
          <v-text-field
              v-if="question.kieuNhapLieu === 'Text'"
              v-model="formInput"
              dense
              hide-details
              outlined
              label="Nhập điểm"
              :disabled="true"
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
              :disabled="true"
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
              :disabled="true"
          />
          <v-radio-group
              v-else
              v-model="formInput"
              dense
              hide-details
              class="pa-0"
              style="margin: 0 auto; width: 24px;"
              :disabled="true"
          >
            <v-radio
                color="red"
                :value="question.diemLonNhat"
            />
          </v-radio-group>
        </template>
        <template v-else>
          <span class="font-weight-bold">ĐTXHH</span>
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
              :disabled="disableYKien"
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
                v-if="disableYKien"
                icon
                color="red"
                @click="clearFile()"
            >
              <v-icon>mdi-delete-circle-outline</v-icon>
            </v-btn>
          </div>
        </td>
        <td class="text-center">
          <div v-if="question.danhDauCau === 1 && ghiChuDanhGia != null" style="width: 150px">
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
      </template>
      <td>
        <template>
          <v-text-field
              v-if="question.kieuNhapLieu === 'Text'"
              v-model="formThamDinh"
              dense
              hide-details
              outlined
              label="Nhập điểm"
              :disabled="true"
          />
          <v-select
              v-else-if="question.kieuNhapLieu === 'Select'"
              v-model="formThamDinh"
              dense
              hide-details
              placeholder="Chọn"
              style="width: 70px; min-width: 0; margin: 0 auto"
              item-text="name"
              item-value="id"
              :return-object="false"
              :items="points"
              :disabled="true"
          />
          <v-checkbox
              v-else-if="question.kieuNhapLieu === 'Checkbox'"
              v-model="formThamDinh"
              dense
              hide-details
              color="red"
              class="align-center justify-center pa-0"
              style="margin: 0 auto; width: 24px;"
              :value="question.diemLonNhat"
              :true-value="question.diemLonNhat"
              :input-value="question.diemLonNhat"
              :disabled="true"
          />
          <v-radio-group
              v-else
              v-model="formThamDinh"
              dense
              hide-details
              class="pa-0"
              style="margin: 0 auto; width: 24px;"
              :disabled="true"
          >
            <v-radio
                color="red"
                :value="question.diemLonNhat"
            />
          </v-radio-group>
        </template>
      </td>
      <td class="text-center">
        <template v-if="question.danhDauCau === 3">
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
      <td class="text-center">
        <template v-if="question.danhDauCau === 3">
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
      dialog2: false,
      loading: false,
      formInput: null,
      formThamDinh: null,
      minQuestion: {},
      ghiChuThamDinh: null,
      ghiChuDanhGia: null,
      ghiChuYKien: null,
      fileName: null,
      iReact: true,
      iReact2: true
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi', 'eventChange']),
    ...mapState('khaoSatStore', ['disableYKien', 'bangYKien', 'capNhatFileDanhGia']),
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
      /*for (let i = JSON.parse(JSON.stringify(this.question.diemNhoNhat)); i < this.question.diemLonNhat; i += this.question.buocNhay) {
          rPoints.push({
              id: Number(i.toFixed(2)),
              name: i.toFixed(2)
          })
      }*/
      return rPoints
    },
    parent() {
      return this.cauHoi.find(model => model.maCauHoi === this.question.parentId) || {}
    },
    dontHavePermission() {
      return this.disableThamDinh
    }
  },
  watch: {
    ghiChuYKien(val) {
      if (val)
        this.$store.commit('khaoSatStore/bangYKien', {id: this.question.id, content: val})
    },
    eventChange() {
      if (Object.keys(this.eventChange).length !== 0 && this.eventChange.maCauHoi === this.question.parentId) {
        if (this.eventChange.maCauTraLoi !== this.question.id) {
          this.formThamDinh = ''
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
      if ((this.question.loaiCauHoi === 1 || this.question.loaiCauHoi === 2) && this.question.danhDauCau === 3) {
        const item = this.bangDiem.find(model => model.maCauHoi === this.question.id)
        this.fnSetValueForm(item)
        this.fileName = item.fileDanhGia
        this.ghiChuDanhGia = item.ghiChuDanhGia
      }
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
      this.$store.commit('khaoSatStore/capNhatBangDiem', {index: idx, value: dataStore[idx]})
    },
    fnSetValueForm(item) {
      this.iReact = false
      const tuDanhGia = item?.noiDungTraLoi.find(i => i.id === this.question.id)
      if (tuDanhGia) {
        this.formInput = tuDanhGia.diem
      }
      const thamDinh = item?.noiDungThamDinh.find(i => i.id === this.question.id)
      if (thamDinh) {
        this.formThamDinh = thamDinh.diem
      }
      this.$store.dispatch('khaoSatStore/capNhatDiemCapTren', item)
    },
  },
  created() {
    this.ghiChuYKien = this.question?.ykien?.noiDung
  }
}
</script>
