<template>
  <tr>
    <template v-if="question.danhDauCau === 2">
      <td class="text-center">
        {{ question.stt }}
      </td>
      <td>
        {{ question.tenCauHoi }}
      </td>
      <td class="text-center">
        {{ question.diemLonNhat.toFixed(2) }}
      </td>
      <td class="text-center">
        <template v-if="question.loaiCauHoi === 1">
          {{formInput}}
        </template>
      </td>
      <td class="text-center">
        {{formThamDinh}}
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
        {{formInput}}
      </td>
      <td class="text-center">
        {{formThamDinh}}
      </td>
      <td class="text-center">
        <template v-if="(question.danhDauCau === 3 && (!dontHavePermission || question.donViThamDinh === this.auth.user.organizationId))">
          <div v-if="!question.hasChild">
            <v-textarea
                v-model="ghiChuThamDinh"
                :label="`Nội dung`"
                dense
                outlined
                hide-details
                class="mt-2"
                rows="2"
                :readonly="true"
            />
          </div>
        </template>
      </td>
      <td v-if="($route.query.thamDinhLai == 1 && (!dontHavePermission || question.donViThamDinh === this.auth.user.organizationId))" class="text-center">
        <template v-if="question.danhDauCau === 3">
          <div v-if="!question.hasChild">
            <v-textarea
                v-if="ghiChuYKien != null"
                v-model="ghiChuYKien"
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
      iReact: true,
      iReact2: true,
      dontHavePermission: true,
      ghiChuYKien: null
    }
  },
  computed: {
    ...mapGetters('khaoSatStore', ['bangDiem', 'cauHoi', 'eventChange']),
    ...mapGetters('authStore', ['auth']),
    ...mapState('khaoSatStore', ['disableThamDinh', 'permissions']),
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
      return rPoints
    },
    parent() {
      return this.cauHoi.find(model => model.maCauHoi === this.question.parentId) || {}
    }
  },
  watch: {
    cauHoi() {
      if (!this.iReact2) {
        return null
      }
      this.iReact2 = false
      if (this.question.danhDauCau === 3) {
        if (this.question.donViThamDinh === this.auth.user.organizationId) {
          const permissions = JSON.parse(JSON.stringify(this.permissions))
          permissions.push(this.question.id)
          this.$store.commit('khaoSatStore/permissions', permissions)
        }
        // this.dontHavePermission = this.disableThamDinh
        if (!this.disableThamDinh && this.question.donViThamDinh === this.auth.user.organizationId) {
          this.dontHavePermission = false
        }
      } else if (!this.disableThamDinh && (this.permissions.includes(this.question.parentId) || this.permissions.includes(this.question.id))) {
        this.dontHavePermission = false
      }

      /*
        if (this.question.danhDauCau === 3) {
            if (this.question.donViThamDinh === this.auth.user.organizationId) {
                this.dontHavePermission = false
                const permissions = JSON.parse(JSON.stringify(this.permissions))
                permissions.push(this.question.id)
                this.$store.commit('khaoSatStore/permissions', permissions)
            }
        } else if (this.permissions.includes(this.question.parentId) || this.permissions.includes(this.question.id)) {
            this.dontHavePermission = false
        }*/
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
    }
  },
  created() {
    if (this.$route.query.thamDinhLai == 1) {
      this.ghiChuYKien = this.question?.ykien?.noiDung
    }
  }
}
</script>
