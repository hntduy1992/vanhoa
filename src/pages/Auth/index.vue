<template>
  <LayoutAuth>
    <v-row justify="center" align="center">
      <v-col md="8" lg="6" xl="5">
        <v-card max-width="456" class="mx-auto">
          <v-row dense align="center" style="background: #5E35B1; height: 114px" no-gutters>
            <v-col cols="10">
              <div class="white--text pa-4 font-tahoma">
                <h2 class="text-center">PHẦN MỀM ĐÁNH GIÁ CÁC DANH HIỆU VĂN HÓA</h2>
              </div>
            </v-col>
            <v-col cols="2">
              <v-img src="@/assets/images/sadec.png"/>
            </v-col>
          </v-row>
          <v-card-text class="pa-6 pt-0">

            <v-form @submit.prevent="fnLogin">
              <validation-observer ref="observer">
                <div class="py-3" >
                  <h2 class="text-center">Vui lòng đăng nhập</h2>
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
                    color="#5E35B1"
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
      }).catch(() => {
        this.$store.dispatch('SnackbarStore/showSnackBar', {success:false,message:'Đăng nhập thất bại'})
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
