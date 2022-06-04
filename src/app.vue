<template>
  <v-app>
    <app-navbar />
    <v-main>
      <app-projects />
    </v-main>
    <v-footer app>
      <span class="text-body-1 mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
