<script setup lang="ts">
import { actions, isHotkeysActive, store } from '../store'
</script>

<template>
  <v-container class="app-projects flex h-full flex-col justify-center gap-2" fluid>
    <p v-if="store.projects.length === 0" class="mx-auto flex flex-col items-center gap-4 text-2xl">
      There is no projects to display.
      <add-project-button />
    </p>

    <app-project v-for="(project, index) in store.projects" :key="`project-${index}`" v-bind="project" :active="index === store.activeProjectIndex" />

    <app-hotkey :enabled="isHotkeysActive" :keys="['arrowdown']" @hotkey="actions.selectNextProject" />
    <app-hotkey :enabled="isHotkeysActive" :keys="['arrowup']" @hotkey="actions.selectPrevProject" />
    <app-hotkey :enabled="isHotkeysActive" :keys="['arrowleft']" @hotkey="actions.selectPrevStep" />
    <app-hotkey :enabled="isHotkeysActive" :keys="['arrowright']" @hotkey="actions.selectNextStep" />
    <app-hotkey :enabled="isHotkeysActive" :keys="['ctrl', 'arrowleft']" @hotkey="actions.moveStep('before')" />
    <app-hotkey :enabled="isHotkeysActive" :keys="['ctrl', 'arrowright']" @hotkey="actions.moveStep('after')" />

    <delete-project-modal />
    <app-hotkey :enabled="isHotkeysActive" :keys="['alt', 'd']" @hotkey="actions.openDeleteProjectModal" />

    <add-step-modal />
    <app-hotkey :enabled="isHotkeysActive" :keys="['ctrl', 'a']" @hotkey="actions.openAddStepModal" />

    <delete-step-modal />
    <app-hotkey :enabled="isHotkeysActive" :keys="['ctrl', 'd']" @hotkey="actions.openDeleteStepModal" />
  </v-container>
</template>

<style scoped>
.app-projects {
  background-image: url('../assets/bg.svg');
  @apply bg-cover;
}
</style>
