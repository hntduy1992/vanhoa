<template>
  <LayoutAuth>
    <v-row justify="center" align="center">
      <v-col md="12" lg="12" xl="12">
        <v-alert
            prominent
            type="error"
        >
          <v-row align="center">
            <v-col class="grow">
              BẠN CHƯA ĐĂNG NHẬP HOẶC BẠN KHÔNG ĐƯỢC CẤP QUYỀN TRUY CẬP. VUI LÒNG LIÊN HỆ QUẢN TRỊ ĐỂ BIẾT CHI TIẾT.
            </v-col>
            <v-col class="shrink">
              <v-btn :to="{ name: 'login' }" >Đăng nhập</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>
  </LayoutAuth>
</template>

<script>
import LayoutAuth from "@/layouts/auth";
export default {
  name: "AccessDenied",
  components: {LayoutAuth}
}
</script>

<style scoped>

</style>
