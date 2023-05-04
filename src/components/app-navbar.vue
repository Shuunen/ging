<template>
  <v-app-bar app>
    <v-container>
      <v-row class="items-center pt-0.5">
        <div class="flex flex-row gap-2 pt-1">
          <h1 class="ml-2 text-4xl font-thin sm:hidden">G</h1>
          <h1 class="ml-2 hidden text-4xl font-thin sm:block">GING</h1>
          <v-icon v-if="!activeProject" class="text-4xl" color="secondary" icon="mdi-chevron-triple-right" />
          <v-progress-circular v-show="isLoading" class="mt-0.5" indeterminate color="primary"></v-progress-circular>
        </div>
        <div class="ml-auto"></div>
        <div v-if="projects.length > 0" class="hidden gap-4 sm:flex">
          <add-project />
          <toggle-edit />
        </div>
        <div class="sm:hidden">
          <app-actions />
        </div>
        <div class="ml-1">
          <app-login />
          <app-about />
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    ...mapState(useStore, ['editMode', 'activeProject', 'projects', 'isLoading']),
  },
})
</script>
