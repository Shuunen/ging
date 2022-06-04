<template>
  <v-app>
    <v-navigation-drawer app>
      <h1 class="text-h2">GING</h1>
    </v-navigation-drawer>
    <app-navbar />

    <v-main>
      <v-container fluid class="flex flex-col justify-center h-full">
        <p v-if="projects.length === 0" class="text-h6 mt-2 mb-4 text-center">
          No projects yet but you can add one with the above button.
          <v-icon>mdi-arrow-top-right-thin-circle-outline</v-icon>
        </p>
        <app-project v-for="(project, index) in projects" :key="'project-' + index" v-bind="project" />
      </v-container>
    </v-main>

    <v-footer app>
      <span class="text-body-1 mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import AppNavbar from './components/app-navbar.vue'
import { useStore } from './store'

export default defineComponent({
  components: { AppNavbar },
  computed: {
    ...mapState(useStore, ['projects', 'edit']),
  },
  methods: {
    ...mapActions(useStore, ['toggleEdit']),
  },
})
</script>
