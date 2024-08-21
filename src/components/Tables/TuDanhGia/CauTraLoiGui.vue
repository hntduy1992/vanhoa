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
            disabled
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
            disabled
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
            disabled
        />
        <v-radio-group
            v-else
            v-model="formInput"
            dense
            hide-details
            class="pa-0"
            style="margin: 0 auto; width: 24px;"
            disabled
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
      </td>
      <td class="text-center font-weight-bold">
        <div v-if="ghiChuDanhGia != null">
          <v-textarea
              v-model="ghiChuDanhGia"
              label="Nội dung"
              dense
              outlined
              hide-details
              class="mt-2"
              disabled
          />
        </div>
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
import {mapGetters} from 'vuex'

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
      fileName: null
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi', 'eventChange']),
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
    }
  },
  watch: {
    bangDiem() {
      if (this.question.loaiCauHoi === 1 && this.question.danhDauCau === 2) {
        const item = this.bangDiem.find(model => model.maCauHoi === this.question.parentId)
        this.ghiChuDanhGia = item?.ghiChuDanhGia
        this.fnSetValueForm(item)
      }
      if (this.question.loaiCauHoi === 1 && this.question.danhDauCau === 3) {
        const item = this.bangDiem.find(model => model.maCauHoi === this.question.id)
        this.fnSetValueForm(item)
        this.fileName = item?.fileDanhGia
        this.ghiChuDanhGia = item?.ghiChuDanhGia
      }
    }
  },
  methods: {
    download() {
      return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileName
    },
    fnSetValueForm(item) {
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
