<template>
  <v-btn v-if="!isAuthenticated" class="mx-3" color="secondary" :loading="isLoading" variant="tonal" @click="login">Login</v-btn>
  <v-btn v-show="isAuthenticated" id="menu-activator" color="secondary">
    <p v-if="user?.nickname" class="mr-4 hidden sm:block">{{ user.nickname }}</p>
    <img v-if="user?.picture" alt="John" class="w-8 rounded-full" :src="user.picture" />
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

<script lang="ts">
import { defineComponent } from 'vue'
import { actions, store } from '../store'
import { logger } from '../utils/logger.utils'

// eslint-disable-next-line import/no-anonymous-default-export, vue/require-expose, vue/require-name-property
export default defineComponent({
  // eslint-disable-next-line vue/component-api-style
  data () {
    return {
      user: this.$auth0.user, // looks like : { "nickname": "Shuunen", "name": "Romain Racamier", "picture": "https://avatars.githubusercontent.com/u/439158?v=4", "updated_at": "2022-08-30T18:20:28.874Z", "email": "romain.racamier@gmail.com", "sub": "github|123456" }
      isLoading: this.$auth0.isLoading,
      isAuthenticated: this.$auth0.isAuthenticated,
    }
  },
  // eslint-disable-next-line vue/component-api-style
  watch: {
    async isAuthenticated (isAuthenticated: boolean) {
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
  // eslint-disable-next-line vue/component-api-style
  methods: {
    login () {
      void this.$auth0.loginWithRedirect()
    },
    async getToken () {
      await this.$auth0.getAccessTokenSilently()
      const claims = this.$auth0.idTokenClaims.value
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const token = claims?.custom_github_token
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-argument
      if (token) void actions.setGistToken(token)
    },
    async logout () {
      store.isLoading = true
      actions.clearGistStorage()
      await this.$auth0.logout({ logoutParams: { returnTo: window.location.origin } })
      store.isLoading = false
    },
  },
})
</script>
