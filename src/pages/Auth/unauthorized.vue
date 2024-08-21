<template>
  <LayoutDefault>
    <v-row>
      <v-col cols="12">
        <IBreadcrumb :items="breadcrumbs"/>
      </v-col>
      <v-col cols="12">
        <v-alert
            dense
            outlined
            type="error"
        >
          Bạn không được cấp quyền truy cập. Vui lòng liên hệ quản trị để biết thêm thông tin.
        </v-alert>
      </v-col>
    </v-row>
  </LayoutDefault>
</template>

<script>
import LayoutDefault from "@/layouts/default";
import IBreadcrumb from "@/components/IBreadcrumb";

export default {
  name: 'unAuthorized',
  inject: ['siteNameTemplate'],
  metaInfo() {
    return {
      title: 'Không có quyền truy cập',
      titleTemplate: this.siteNameTemplate,
      htmlAttrs: {
        lang: 'vi',
        amp: true
      }
    }
  },
  components: {LayoutDefault, IBreadcrumb},
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'Dashboard'
        },
        {
          text: 'Unauthorized',
          disabled: false,
          href: '/Auth/Unauthorized'
        }
      ],
    }
  }

}
</script>

<style scoped>

</style>
