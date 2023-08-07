<template>
  <v-container class="app-projects flex h-full flex-col justify-center gap-2" fluid>
    <p v-if="projects.length === 0" class="mx-auto flex flex-col items-center gap-4 text-2xl">
      There is no projects to display.
      <add-project-button />
    </p>

    <app-project v-for="(project, index) in projects" :key="`project-${  index}`" v-bind="project" :active="index === activeProjectIndex" @add-step="showAddStep = true" />

    <app-hotkey :enabled="hotkeysActive" :keys="['arrowdown']" @hotkey="selectNextProject" />
    <app-hotkey :enabled="hotkeysActive" :keys="['arrowup']" @hotkey="selectPrevProject" />
    <app-hotkey :enabled="hotkeysActive" :keys="['arrowleft']" @hotkey="selectPrevStep" />
    <app-hotkey :enabled="hotkeysActive" :keys="['arrowright']" @hotkey="selectNextStep" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'arrowleft']" @hotkey="moveStep('before')" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'arrowright']" @hotkey="moveStep('after')" />

    <delete-project-modal :active="showDeleteProject" @close="showDeleteProject = false" />
    <app-hotkey :enabled="hotkeysActive" :keys="['alt', 'd']" @hotkey="showDeleteProjectModal" />

    <add-step-modal :active="showAddStep" @close="showAddStep = false" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'a']" @hotkey="showAddStep = true" />

    <delete-step-modal :active="showDeleteStep" @close="showDeleteStep = false" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'd']" @hotkey="showDeleteStepModal" />
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
