<template>
  <v-btn :loading="isLoading" @click="login" class="mx-3" color="secondary" v-if="!isAuthenticated" variant="tonal">Login</v-btn>
  <v-btn color="secondary" id="menu-activator" v-show="isAuthenticated">
    <p class="mr-4 hidden sm:block" v-if="user?.nickname">{{ user.nickname }}</p>
    <img :src="user.picture" alt="John" class="w-8 rounded-full" v-if="user?.picture" />
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

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { watch } from 'vue'
import { actions, store } from '../store'
import { logger } from '../utils/logger.utils'

const { getAccessTokenSilently, idTokenClaims, isAuthenticated, isLoading, loginWithRedirect, logout: auth0Logout, user } = useAuth0()

async function getToken() {
  await getAccessTokenSilently()
  const token = idTokenClaims.value?.custom_github_token as string | undefined
  if (token) void actions.setGistToken(token)
}

function login() {
  void loginWithRedirect()
}

async function logout() {
  store.isLoading = true
  actions.clearGistStorage()
  await auth0Logout({ logoutParams: { returnTo: globalThis.location.origin } })
  store.isLoading = false
}

watch(isAuthenticated, async value => {
  logger.debug('isAuthenticated ?', value)
  if (!value) {
    void actions.setGistToken('')
    return
  }
  try {
    await getToken()
  } catch {
    await logout()
  }
})
</script>
