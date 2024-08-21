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
            dontHavePermission: false,
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
                this.fileName = item.fileDanhGia
                this.ghiChuDanhGia = item.ghiChuDanhGia
                this.ghiChuThamDinh = item.ghiChuThamDinh
            }
        }
    },
    methods: {
        download() {
            return process.env.VUE_APP_BASE_URL + 'storage/' + this.fileName
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
    }
}
</script>
