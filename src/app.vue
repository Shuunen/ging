<template>
  <v-app>
    <app-navbar />
    <v-main>
      <app-projects />
    </v-main>
    <v-footer app>
      <app-footer />
    </v-footer>
  </v-app>
</template>

<style scoped>
@reference "tailwindcss";
/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.v-footer {
  @apply p-0;
}
</style>
