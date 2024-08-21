<template>
  <LayoutDefault>
    <validation-observer ref="observer">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <template slot="progress">
              <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
              ></v-progress-linear>
            </template>
            <v-img
                :src="require('@/assets/5.jpg')"
                height="150"
                width="480"
                alt class="img-fluid"
            >
              <div style="padding-top: 80px !important;">
                <v-badge
                    bottom
                    color="success"
                    overlap
                    offset-x="12"
                    offset-y="12"
                    class="ms-4"
                    dot
                >
                  <v-avatar size="50px">
                    <v-img :src="image"></v-img>
                  </v-avatar>
                </v-badge>
                <div
                    class="d-inline-flex flex-column justify-center ms-3"
                    style="vertical-align:middle; color: white"
                >
                <span style="font-size: 15px; font-weight: bold">
                  {{ model.fullName }}
                </span>
                  <small style="font-size: x-small">@ {{ model.userName }}</small>
                </div>
              </div>
            </v-img>
            <v-card-text class="pa-0">
              <v-row dense>
                <v-col cols="12">
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content style="font-weight: bold">Tên tài khoản:
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ model.userName }}
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content style="font-weight: bold">Họ và tên:
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ model.fullName }}
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content style="font-weight: bold">Email:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <span v-if="model.email">{{ model.email }}</span>
                        <span v-else>-</span>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content style="font-weight: bold">Số điện thoại:
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        <span v-if="model.phone">{{ model.phone }}</span>
                        <span v-else>-</span>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content style="font-weight: bold">Đơn vị:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <span v-if="model.organization">{{ model.organization.name }}</span>
                        <span v-else>-</span>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content style="font-weight: bold">Quyền:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <template v-if="model.roles && model.roles.length > 0">
                          <v-chip outlined class="mr-2"
                                  style="max-width: 80px; text-align: center" small
                                  v-for="role in model.roles" :key="role">
                            {{ role }}
                          </v-chip>
                        </template>
                        <span v-else>-</span>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="8">
          <v-card>
            <v-tabs v-model="tabModel" color="green">
              <v-tab href="#tab1">Cập nhật thông tin</v-tab>
            </v-tabs>
            <v-divider/>
            <v-card-text>
              <v-tabs-items v-model="tabModel">
                <v-tab-item :value="`tab1`" class="pa-2">
                  <v-row dense>
                    <v-col cols="12">
                      <VTextValidation
                          v-model="model.fullName"
                          dense
                          outlined
                          label="Họ và tên"
                          :rules="{ required: true }"
                      />
                    </v-col>

                    <v-col cols="12">
                      <VTextValidation
                          v-model="model.password"
                          dense
                          outlined
                          label="Mật khẩu"
                          :rules="{ min: 6 }"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword ? 'text' : 'password'"
                          @click:append="showPassword = !showPassword"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <VTextValidation
                          v-model="model.email"
                          dense
                          outlined
                          label="Email"
                          style="max-width: 90%"
                          :rules="{ email: true }"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <VTextValidation
                          v-model="model.phone"
                          dense
                          outlined
                          label="Số điện thoại"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-file-input
                          label="Avatar"
                          prepend-inner-icon="mdi-upload"
                          prepend-icon=""
                          accept=".png,.jpg,.jpeg"
                          outlined
                          dense
                          small-chips
                          counter
                          hide-spin-buttons
                          @change="upload($event)"
                          @click:clear="clearFile()"
                      />
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="warning"
                  small
                  @click="fnReset"
              >
                Làm lại
              </v-btn>
              <v-btn
                  color="error"
                  small
                  @click="fnSubmit"
              >
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

import {ValidationObserver} from 'vee-validate'
import {userModel} from "@/models/userModel"
import VTextValidation from "@/components/Validations/VTextValidation"
import LayoutDefault from "@/layouts/default";


export default {
  name: "ProfileUser",
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Thông tin cá nhân',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
  components: {LayoutDefault, VTextValidation, ValidationObserver},
  data() {
    return {
      model: userModel.baseJson(),
      showPassword: false,
      tabModel: 'tab1',
      permissions: [],
      submitted: false,
      fileName: null
    }
  },
  computed: {
    image() {
      const image = this.$store.state.authStore.auth?.user?.image
      return image ? process.env.VUE_APP_BASE_URL + `storage/${image}` : require('@/assets/images/sadec.png')
    }
  },
  mounted() {
    this.fnGetProfile()
  },
  methods: {
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
            this.loading = false
          })
    },
    clearFile() {
      this.fileName = null
    },
    async fnGetProfile() {
      await this.$axios.get('auth/users/profile').then((res) => {
        this.model = userModel.fromProfileJson(res.data.data)
      }).catch(() => {
        this.$store.dispatch('snackbarStore/showSnackBar', {
          message: 'Thông tin yêu cầu không hợp lệ',
          isError: true
        })
      })
    },
    async fnSubmit() {
      this.submitted = true
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.submitted = false
        return false
      }
      this.model.image = this.fileName
      await this.$axios.post('auth/users/profile', userModel.toJson(this.model))
          .then((res) => {
            this.$store.commit('authStore/update', res.data.data)
            this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
            this.fnReset()
          })
          .catch((e) => {
            const errors = e.response?.data.errors
            if (errors) {
              this.$refs.observer.setErrors(errors)
            }
          })
          .finally(() => {
            this.submitted = false
          })
    },
    async fnReset() {
      await this.fnGetProfile()
    }
  }
}
</script>

