<template>
  <v-container fluid class="projects flex flex-col justify-center h-full">
    <p v-if="projects.length === 0" class="text-h6 mt-2 mb-4 text-center">
      No projects yet but you can add one with the above button.
      <v-icon>mdi-arrow-top-right-thin-circle-outline</v-icon>
    </p>

    <app-project v-for="(project, index) in projects" :key="'project-' + index" v-bind="project" :active="index === activeProjectIndex" @add-step="showAddStep = true" />

    <app-hotkey :keys="['arrowdown']" @hotkey="selectNextProject" />
    <app-hotkey :keys="['arrowup']" @hotkey="selectPrevProject" />
    <app-hotkey :keys="['arrowleft']" @hotkey="selectPrevStep" />
    <app-hotkey :keys="['arrowright']" @hotkey="selectNextStep" />

    <delete-project :active="showDeleteProject" @close="showDeleteProject = false" />
    <app-hotkey :keys="['alt', 'd']" @hotkey="showDeleteProject = true" />

    <add-step :active="showAddStep" @close="showAddStep = false" />
    <app-hotkey :keys="['ctrl', 'a']" @hotkey="showAddStep = true" />

    <delete-step :active="showDeleteStep" @close="showDeleteStep = false" />
    <app-hotkey :keys="['ctrl', 'd']" @hotkey="showDeleteStep = true" />
  </v-container>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useStore } from '../store'

export default defineComponent({
  data: () => ({
    showAddStep: false,
    showDeleteProject: false,
    showDeleteStep: false,
  }),
  computed: {
    ...mapState(useStore, ['projects', 'activeProjectIndex']),
  },
  methods: {
    ...mapActions(useStore, ['selectNextProject', 'selectPrevProject', 'selectNextStep', 'selectPrevStep']),
  },
})
</script>
