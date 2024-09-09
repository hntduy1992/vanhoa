<template>
  <LayoutDefault>
    <validation-observer ref="observer">
      <v-row>
        <v-col cols="12">
          <IBreadcrumb :items="breadcrumbs" />
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-toolbar dense elevation="0">
              <v-toolbar-title>THÔNG TIN</v-toolbar-title>
            </v-toolbar>
            <v-divider />
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6" md="6">
                  <VTextValidation
                      v-model="user.userName"
                      dense
                      outlined
                      label="Tên tài khoản"
                      :rules="{ required: true, regex: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/ }"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <VTextValidation
                      v-model="user.password"
                      dense
                      outlined
                      label="Mật khẩu"
                      :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="{ min: 6 }"
                      :type="showPwd ? 'text' : 'password'"
                      @click:append="showPwd = !showPwd"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <VTextValidation
                      v-model="user.fullName"
                      dense
                      outlined
                      label="Họ và tên"
                      :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <VTextValidation
                      v-model="user.email"
                      dense
                      outlined
                      label="Email"
                      :rules="{ email: true }"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <VTextValidation
                      v-model="user.phone"
                      type="tel"
                      dense
                      outlined
                      label="Số điện thoại"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-autocomplete
                      v-model="user.organizationId"
                      dense
                      outlined
                      label="Cơ quan"
                      item-text="name"
                      item-value="id"
                      :return-object="false"
                      :items="organizations"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <VSelectValidation
                      v-model="user.roles"
                      dense
                      outlined
                      multiple
                      label="Phân quyền"
                      item-text="name"
                      item-value="id"
                      item-color="red"
                      :return-object="false"
                      :items="roles"
                      :rules="{ required: true }"
                  >
                    <template #selection="{ item, index }">
                      <v-chip v-if="index === 0" color="success" small>
                        <span>{{ item.name }}</span>
                      </v-chip>
                      <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                      >
                      (+{{ user.roles.length - 1 }} khác)
                    </span>
                    </template>
                  </VSelectValidation>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                      v-model="user.status"
                      dense
                      outlined
                      label="Trạng thái"
                      item-text="name"
                      item-value="id"
                      :items="[ { id: 0, name: 'Chưa kích hoạt'}, { id: 1, name: 'Hoạt động'}, { id: 2, name: 'Tạm khóa'} ]"
                      :return-object="false"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions class="justify-end">
              <v-btn elevation="0" shaped color="warning" @click="fnReset">
                <v-icon>mdi-reload</v-icon>
                Làm lại
              </v-btn>
              <v-btn elevation="0" shaped color="error" @click="fnSubmit">
                <v-icon>mdi-content-save</v-icon>
                Lưu lại
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </validation-observer>
  </LayoutDefault>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import VTextValidation from '@/components/Validations/VTextValidation'
import { userModel } from '@/models/userModel'
import VSelectValidation from '@/components/Validations/VSelectValidation'
import IBreadcrumb from "@/components/IBreadcrumb";
import LayoutDefault from "@/layouts/default";

export default {
  components: {
    LayoutDefault,
    VSelectValidation,
    VTextValidation,
    ValidationObserver,
    IBreadcrumb
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', disabled: false, href: 'Dashboard' }, { text: 'Quản lý tài khoản', disabled: false, href: '/auth/users' },
        { text: 'Thêm mới', disabled: false, href: '' }
      ],
      loading: false,
      isLoading: false,
      showPwd: false,
      user: userModel.baseJson(),
      organizations: [],
      roles: []
    }
  },
  created() {
    this.fnGetOrg()
    this.fnGetRoles()
    this.fnGetDetail()
  },
  methods: {
    async fnGetOrg() {
      await this.$axios.get('auth/don-vi/select').then((res) => {
        this.organizations = (res.data.data).map(item => ({
          id: item.id,
          name: item.tenDonVi
        }))
      }).catch()
    },
    async fnGetRoles() {
      await this.axios.get('auth/roles/all').then((res) => {
        this.roles = (res.data.data).map(item => ({ id: item.id, name: item.name }))
      }).catch()
    },
    async fnGetDetail() {
      await this.axios.get('auth/users/edit/' + this.$route.params.id).then((res) => {
        this.user = userModel.fromJson(res.data.data)
      })
    },
    async fnSubmit() {
      this.loading = true
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      this.axios.post('auth/users/edit/' + this.$route.params.id, userModel.toJson(this.user)).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        this.fnReset()
        this.$router.push({'name':'Users'})
      }).catch().finally(() => {
        this.loading = false
      })
    },
    async fnReset() {
      await this.fnGetDetail()
    }
  }
}
</script>
