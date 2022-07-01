<template>
  <v-app>
    <app-navbar />
    <v-main>
      <app-projects />
    </v-main>
    <v-footer app>
      <div class="flex flex-col items-center justify-center mx-auto">
        <app-debug />
        <span class="text-body-1 mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </v-footer>
  </v-app>
</template>
