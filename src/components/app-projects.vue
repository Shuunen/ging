<template>
  <v-container fluid class="app-projects flex h-full flex-col justify-center gap-2">
    <p v-if="projects.length === 0" class="mx-auto flex flex-col items-center gap-4 text-2xl">
      There is no projects to display.
      <add-project />
    </p>

    <app-project v-for="(project, index) in projects" :key="`project-${  index}`" v-bind="project" :active="index === activeProjectIndex" @add-step="showAddStep = true" />

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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    showAddStep: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    showDeleteProject: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

<style scoped>
.app-projects {
  background-image: url('../assets/bg.svg');
  @apply bg-cover;
}
</style>
