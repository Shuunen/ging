<template>
  <v-container fluid class="projects flex flex-col justify-center h-full gap-2">
    <p v-if="projects.length === 0" class="text-h6 mt-2 mb-4 text-center">
      No projects yet but you can add one with the above button.
      <v-icon>mdi-arrow-top-right-thin-circle-outline</v-icon>
    </p>

    <app-project v-for="(project, index) in projects" :key="'project-' + index" v-bind="project" :active="index === activeProjectIndex"
                 @add-step="showAddStep = true" />

    <app-hotkey :keys="['arrowdown']" :enabled="hotkeysActive" @hotkey="selectNextProject" />
    <app-hotkey :keys="['arrowup']" :enabled="hotkeysActive" @hotkey="selectPrevProject" />
    <app-hotkey :keys="['arrowleft']" :enabled="hotkeysActive" @hotkey="selectPrevStep" />
    <app-hotkey :keys="['arrowright']" :enabled="hotkeysActive" @hotkey="selectNextStep" />
    <app-hotkey :keys="['ctrl', 'arrowleft']" :enabled="hotkeysActive" @hotkey="moveStep('before')" />
    <app-hotkey :keys="['ctrl', 'arrowright']" :enabled="hotkeysActive" @hotkey="moveStep('after')" />

    <delete-project :active="showDeleteProject" @close="showDeleteProject = false" />
    <app-hotkey :keys="['alt', 'd']" :enabled="hotkeysActive" @hotkey="showDeleteProjectModal" />

    <add-step :active="showAddStep" @close="showAddStep = false" />
    <app-hotkey :keys="['ctrl', 'a']" :enabled="hotkeysActive" @hotkey="showAddStep = true" />

    <delete-step :active="showDeleteStep" @close="showDeleteStep = false" />
    <app-hotkey :keys="['ctrl', 'd']" :enabled="hotkeysActive" @hotkey="showDeleteStepModal" />
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
    ...mapState(useStore, ['projects', 'activeProject', 'activeProjectIndex', 'activeStep']),
    hotkeysActive () {
      return !(this.showAddStep || this.showDeleteProject || this.showDeleteStep)
    },
  },
  methods: {
    ...mapActions(useStore, ['moveStep', 'selectNextProject', 'selectPrevProject', 'selectNextStep', 'selectPrevStep']),
    showDeleteStepModal () {
      if (this.activeStep) this.showDeleteStep = true
    },
    showDeleteProjectModal () {
      if (this.activeProject) this.showDeleteProject = true
    },
  },
})
</script>

<style>
.projects {
  background-image: url('../assets/bg.svg');
  @apply bg-cover;
}
</style>
