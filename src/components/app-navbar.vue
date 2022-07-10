<template>
  <v-app-bar app>
    <v-container>
      <v-row class="items-center pt-0.5">
        <div class="flex flex-row gap-2 pt-1">
          <h1 class="text-h4 sm:hidden font-weight-thin ml-2">G</h1>
          <h1 class="text-h4 sm:block font-weight-thin hidden ml-2">GING</h1>
          <v-icon v-if="!activeProject" class="text-h4" color="secondary" icon="mdi-chevron-triple-right" />
        </div>
        <div class="ml-auto"></div>
        <div class="sm:flex hidden gap-4">
          <add-project />
          <toggle-edit />
        </div>
        <div class="sm:hidden">
          <app-actions />
        </div>
        <div class="ml-4">
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
    ...mapState(useStore, ['editMode', 'activeProject']),
  },
})
</script>
