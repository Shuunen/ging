<script setup lang="ts">
import { activeProject, store } from '../store'
</script>

<template>
  <v-app-bar app>
    <v-container>
      <v-row class="items-center pt-0.5">
        <div class="flex flex-row gap-2 pt-1">
          <h1 class="ml-6 text-4xl font-thin sm:hidden">G</h1>
          <h1 class="ml-2 hidden text-4xl font-thin sm:block">GING</h1>
          <v-icon class="text-4xl" color="secondary" icon="mdi-chevron-triple-right" v-if="!activeProject" />
          <v-progress-circular class="mt-0.5" color="primary" indeterminate v-show="store.isLoading" />
        </div>
        <div class="ml-auto" />
        <div class="hidden gap-4 sm:flex" v-if="store.projects.length > 0">
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
