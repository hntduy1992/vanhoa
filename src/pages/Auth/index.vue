<template>
  <LayoutAuth>
    <v-row justify="center" align="center">
      <v-col md="8" lg="6" xl="5">
        <v-card max-width="456" class="mx-auto">
          <v-row dense align="center" style="background: #4076b4; height: 114px" no-gutters>
            <v-col cols="7">
              <div class="white--text pa-4 font-tahoma">
                <h4>PHẦN MỀM ĐÁNH GIÁ CÁC DANH HIỆU VĂN HÓA</h4>
                <p>Đăng nhập vào hệ thống.</p>
              </div>
            </v-col>
            <v-col cols="5" align-self="end">
              <v-img height="114" contain src="@/assets/images/work.png"/>
            </v-col>
          </v-row>
          <v-card-text class="pa-6 pt-0">
            <v-form @submit.prevent="fnLogin">
              <validation-observer ref="observer">
                <div class="mb-6" style="margin-top: -28px">
                  <v-avatar size="65">
                    <v-img src="@/assets/images/sadec.png"/>
                  </v-avatar>
                </div>
                <div>
                  <VTextValidation
                      v-model="item.userName"
                      outlined
                      dense
                      label="Tên đăng nhập"
                      placeholder="Nhập tên đăng nhập"
                      prepend-inner-icon="mdi-account"
                      :rules="{ required: true }"
                  />
                </div>
                <div>
                  <VTextValidation
                      v-model="item.password"
                      outlined
                      dense
                      prepend-inner-icon="mdi-lock"
                      label="Mật khẩu"
                      placeholder="Nhập mật khẩu"
                      :type="showPwd ? 'text' : 'password'"
                      :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="{ required: true }"
                      @click:append="showPwd = !showPwd"
                  />
                </div>
                <div>
                  <v-checkbox
                      v-model="item.remember"
                      label="Ghi nhớ mật khẩu"
                      color="red"
                      value="1"
                      hide-details
                      class="mt-0 mb-3"
                  />
                </div>
                <v-btn
                    block
                    color="blue"
                    dark
                    elevation="0"
                    :loading="loading"
                    type="submit"
                >
                  Đăng nhập
                </v-btn>
              </validation-observer>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </LayoutAuth>
</template>

<script>
import VTextValidation from '@/components/Validations/VTextValidation'
import {authModel} from '@/models/authModel'
import LayoutAuth from "@/layouts/auth";
import {ValidationObserver} from 'vee-validate'

export default {
  name: 'auth-index',
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Đăng Nhập',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
  components: {LayoutAuth, VTextValidation, ValidationObserver},
  data() {
    return {
      showPwd: false,
      loading: false,
      item: authModel.baseJson()
    }
  },
  created() {
  },
  methods: {
    async fnLogin() {
      this.loading = true
      await this.axios.post('auth/login', authModel.toJson(this.item)).then((res) => {
        this.$store.dispatch('SnackbarStore/showSnackBar', res.data)
        if (res.data.success) {
          this.$store.dispatch('authStore/auth', res.data.data)
          window.location.href = '/Auth/Dashboard'
        }
      }).catch((e) => {
        // eslint-disable-next-line no-console
        console.log('e = ', e)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
label, .font-tahoma {
  font-family: "Tahoma", serif !important;
}

.login {
  .v-input__control {
    .v-input__slot {
      margin: 0 !important;
      min-height: auto !important;
      display: flex !important;
      align-items: center !important;
      /*.v-input__prepend-inner {
        margin-top: 4px !important;
        .v-icon {
          color: silver;
        }
      }
      fieldset {
        border: thin solid #ced4da;
      }*/
    }

    .v-text-field__details {
      margin-bottom: 0;
    }
  }
}
</style>
