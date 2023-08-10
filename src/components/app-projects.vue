<template>
  <v-container class="app-projects flex h-full flex-col justify-center gap-2" fluid>
    <p v-if="store.projects.length === 0" class="mx-auto flex flex-col items-center gap-4 text-2xl">
      There is no projects to display.
      <add-project-button />
    </p>

    <app-project v-for="(project, index) in store.projects" :key="`project-${index}`" v-bind="project" :active="index === store.activeProjectIndex"
      @add-step="showAddStep = true" />

    <app-hotkey :enabled="hotkeysActive" :keys="['arrowdown']" @hotkey="actions.selectNextProject" />
    <app-hotkey :enabled="hotkeysActive" :keys="['arrowup']" @hotkey="actions.selectPrevProject" />
    <app-hotkey :enabled="hotkeysActive" :keys="['arrowleft']" @hotkey="actions.selectPrevStep" />
    <app-hotkey :enabled="hotkeysActive" :keys="['arrowright']" @hotkey="actions.selectNextStep" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'arrowleft']" @hotkey="actions.moveStep('before')" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'arrowright']" @hotkey="actions.moveStep('after')" />

    <delete-project-modal :active="showDeleteProject" @close="showDeleteProject = false" />
    <app-hotkey :enabled="hotkeysActive" :keys="['alt', 'd']" @hotkey="showDeleteProjectModal" />

    <add-step-modal :active="showAddStep" @close="showAddStep = false" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'a']" @hotkey="showAddStep = true" />

    <delete-step-modal :active="showDeleteStep" @close="showDeleteStep = false" />
    <app-hotkey :enabled="hotkeysActive" :keys="['ctrl', 'd']" @hotkey="showDeleteStepModal" />
  </v-container>
</template>

<script lang="ts">
import { actions, activeProject, activeStep, store } from '@/store'
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    showAddStep: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    showDeleteProject: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    showDeleteStep: false,
    actions,
    store,
  }),
  computed: {
    hotkeysActive () {
      return !(this.showAddStep || this.showDeleteProject || this.showDeleteStep)
    },
  },
  methods: {
    showDeleteStepModal () {
      if (activeStep.value) this.showDeleteStep = true
    },
    showDeleteProjectModal () {
      if (activeProject.value) this.showDeleteProject = true
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
