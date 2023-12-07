<script setup lang="ts">
import { actions, store } from '../store'
</script>

<template>
  <v-btn color="secondary" :prepend-icon="store.editMode ? '' : 'mdi-circle-edit-outline'" variant="tonal" @click="actions.toggleEditMode">
    {{ store.editMode ? 'Read' : 'Edit' }}
  </v-btn>
  <app-hotkey :excluded-elements="[]" :keys="['ctrl', 'e']" @hotkey="actions.toggleEditMode" />
  <app-hotkey :excluded-elements="[]" :keys="['f2']" @hotkey="actions.toggleEditMode" />
</template>

