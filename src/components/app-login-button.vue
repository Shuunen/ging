<template>
  <v-btn :loading="isLoading" @click="login" class="mx-3" color="secondary" v-if="!isAuthenticated" variant="tonal">Login</v-btn>
  <v-btn color="secondary" id="menu-activator" v-show="isAuthenticated">
    <p class="mr-4 hidden sm:block" v-if="user?.nickname">{{ user.nickname }}</p>
    <img :src="user.picture" alt="John" class="w-8 rounded-full" v-if="user?.picture">
  </v-btn>

  <v-menu activator="#menu-activator">
    <v-list>
      <v-list-item @click="logout">
        <v-list-item-title>
          <v-icon>mdi-exit-to-app</v-icon>
          Logout
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { defineComponent } from 'vue'
import { actions, store } from '../store'
import { logger } from '../utils/logger.utils'

export default defineComponent({
  data () {
    return {
      isAuthenticated: this.$auth0.isAuthenticated,
      isLoading: this.$auth0.isLoading,
      user: this.$auth0.user, // looks like : { "nickname": "Shuunen", "name": "Romain Racamier", "picture": "https://avatars.githubusercontent.com/u/439158?v=4", "updated_at": "2022-08-30T18:20:28.874Z", "email": "romain.racamier@gmail.com", "sub": "github|123456" }
    }
  },
  methods: {
    async getToken () {
      await this.$auth0.getAccessTokenSilently()
      const claims = this.$auth0.idTokenClaims.value
      const token = claims?.custom_github_token
      if (token) void actions.setGistToken(token)
    },
    login () {
      void this.$auth0.loginWithRedirect()
    },
    async logout () {
      store.isLoading = true
      actions.clearGistStorage()
      await this.$auth0.logout({ logoutParams: { returnTo: globalThis.location.origin } })
      store.isLoading = false
    },
  },
  watch: {
    async isAuthenticated (isAuthenticated) {
      logger.debug('isAuthenticated ?', isAuthenticated)
      if (!isAuthenticated) {
        void actions.setGistToken('')
        return
      }
      try {
        await this.getToken()
      } catch {
        await this.logout()
      }
    },
  },
})
</script>
