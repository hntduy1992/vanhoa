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
      <div v-if="question.danhDauCau == 1 && ghiChuDanhGia != null">
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
      score: 0,
      fileName: null,
      ghiChuDanhGia: null
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi']),
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
    }
  },
  methods: {
    download() {
      return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileName
    }
  }
}
</script>

<style scoped>

</style>
