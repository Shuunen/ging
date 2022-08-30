<template>
  <v-btn v-if="!isAuthenticated" :loading="isLoading" variant="tonal" class="mr-4" color="secondary" @click="login">Login</v-btn>
  <v-btn v-show="isAuthenticated" id="menu-activator" color="secondary">
    <p v-if="user?.nickname" class="sm:block hidden mr-4">{{ user.nickname }}</p>
    <img v-if="user?.picture" class="w-8 rounded-full" :src="user.picture" alt="John" />
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

export default defineComponent({
  data () {
    return {
      user: this.$auth0.user, // like : { "nickname": "Shuunen", "name": "Romain Racamier", "picture": "https://avatars.githubusercontent.com/u/439158?v=4", "updated_at": "2022-08-30T18:20:28.874Z", "email": "romain.racamier@gmail.com", "sub": "github|123456" }
      isLoading: this.$auth0.isLoading,
      isAuthenticated: this.$auth0.isAuthenticated,
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    }
  },
  methods: {
    login () {
      this.$auth0.loginWithRedirect()
    },
    logout () {
      this.$auth0.logout({ returnTo: window.location.origin })
    },
  },
})
</script>
