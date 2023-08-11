<script setup lang="ts">
import { activeProject, store } from '@/store'
</script>

<template>
  <v-app-bar app>
    <v-container>
      <v-row class="items-center pt-0.5">
        <div class="flex flex-row gap-2 pt-1">
          <h1 class="ml-6 text-4xl font-thin sm:hidden">G</h1>
          <h1 class="ml-2 hidden text-4xl font-thin sm:block">GING</h1>
          <v-icon v-if="!activeProject" class="text-4xl" color="secondary" icon="mdi-chevron-triple-right" />
          <v-progress-circular v-show="store.isLoading" class="mt-0.5" color="primary" indeterminate></v-progress-circular>
        </div>
        <div class="ml-auto"></div>
        <div v-if="store.projects.length > 0" class="hidden gap-4 sm:flex">
          <add-project-button />
          <toggle-edit-button />
        </div>
        <div class="sm:hidden">
          <app-actions />
        </div>
        <div class="ml-1 mr-6 md:mr-0">
          <app-login-button />
          <app-about-button />
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
