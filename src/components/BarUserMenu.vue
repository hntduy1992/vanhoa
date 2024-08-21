<template>
  <v-menu
      offset-y
      left
      nudge-bottom="14"
      max-width="230"
      content-class="user-profile-menu-content"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex pt-0">
        <v-badge
            bottom
            color="success"
            overlap
            offset-x="12"
            offset-y="12"
            class="ms-4"
            dot
        >
          <v-avatar
              size="40px"
              v-bind="attrs"
              v-on="on"
          >
            <v-img :src="image"></v-img>
          </v-avatar>
        </v-badge>
        <div
            class="d-inline-flex flex-column justify-center ms-3 "
            style="vertical-align:middle"
        >
          <span class="mb-n1" style="font-size: 11px; color: white; font-weight: bold">
            {{ fullName }}
          </span>
          <small style="font-size: 9px">@ {{ userName }}</small>
        </div>
      </div>
    </template>
    <v-list dense class="pa-0">
      <v-img
          :src="require('@/assets/5.jpg')"
          height="140"
          width="230"
          alt class="img-fluid"
      >
        <div style="padding-top: 50px !important;">
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
                <span style="font-size: 11px; font-weight: bold">
                  {{ fullName }}
                </span>
            <small style="font-size: x-small">@ {{ userName }}</small>
          </div>
        </div>
      </v-img>

      <!-- Profile -->
      <v-list-item-group
          color="red"
      >
        <v-list-item link dense :to="{ name: 'Profile' }">
          <v-list-item-icon class="me-2">
            <v-icon size="18">
              mdi-account-outline
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px">Thông tin cá nhân</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- Logout -->
        <v-list-item link dense @click="fnLogout">
          <v-list-item-icon class="me-2">
            <v-icon size="18">
              mdi-logout-variant
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px">Đăng xuất</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  name: 'BarUserMenu',
  props: {
    item: {
      type: [Object, String],
      default: null
    }
  },
  computed: {
    fullName() {
      return this.$store.state.authStore.auth?.user?.fullName || "Guest"
    },
    userName() {
      return this.$store.state.authStore.auth?.user?.userName || "guest"
    },
    image() {
      const image = this.$store.state.authStore.auth?.user?.image
      return  image ? process.env.VUE_APP_BASE_URL + `storage/${image}` : require('@/assets/images/sadec.png')
    }
  },
  methods: {
    async fnLogout() {
      await this.$store.dispatch('authStore/logout')
          .then((res) => {
            this.$store.dispatch('snackbarStore/showSnackBar', {
              isError: res.data.isError,
              message: res.data.message,
              code: res.data.code
            })
          })
          .catch(() => {
            this.$store.dispatch('snackbarStore/showSnackBar', {
              message: 'Thông tin yêu cầu không hợp lệ',
              isError: true
            })
          }).finally(() => {
            this.$store.commit('authStore/LOGOUT', {})
            this.$router.push({name: 'Login'})
          })
    }
  }
}
</script>
