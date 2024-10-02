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
          <v-list v-if="fileName != null" class="text-center">
            <v-list-item v-for="(file,index) of fileName" :key="index">
              <v-tooltip  top color="primary">
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
                    <span class="ml-2">{{ file.fileName }}</span>
                    <v-icon
                        dark
                        right
                    >
                      mdi-cloud-download
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-list-item>
          </v-list>
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
      fileName: [],
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
        this.fileName = JSON.parse(item.fileDanhGia) || []
        this.ghiChuDanhGia = item.ghiChuDanhGia
      }
    }
  },
  methods: {
    download(fileUrl) {
      return process.env.VUE_APP_BASE_URL + 'storage/' + fileUrl
    }
  }
}
</script>

<style scoped>
.v-list{
  background: transparent;
}
.v-list-item{
  display: block;
}
.v-list-item a{
  margin: 0 !important;
}
</style>
