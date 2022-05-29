<template>
  <v-app>
    <v-navigation-drawer app>
      <h1 class="text-h2">GING</h1>
    </v-navigation-drawer>
    <v-app-bar app>
      <h1 class="text-h4">GING</h1>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <p class="mt-2 mb-4">There are {{ projects.length }} projects in store : {{ projects.map((p: Project) => p.title).join(', ') }}</p>
        <add-project />
      </v-container>
    </v-main>

    <v-footer app>
      <span class="text-body-1 mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import AddProject from '@/components/add-project.vue'
import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useStore } from './store'

export default defineComponent({
  components: {
    AddProject,
  },
  computed: {
    ...mapState(useStore, ['projects']),
  },
})
</script>
