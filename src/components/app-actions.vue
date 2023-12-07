<script setup lang="ts">
import { actions, store } from '../store'
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn append-icon="mdi-dots-vertical" color="secondary" variant="outlined" v-bind="props">Actions</v-btn>
    </template>
    <v-list>
      <v-list-item @click="actions.toggleEditMode">
        <v-list-item-title>
          <v-icon>mdi-pencil</v-icon>
          {{ store.editMode ? 'Stop' : 'Start' }} edition
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="actions.openAddProjectModal">
        <v-list-item-title>
          <v-icon>mdi-plus</v-icon>
          Add project
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="actions.openDeleteProjectModal">
        <v-list-item-title>
          <v-icon>mdi-delete</v-icon>
          Delete project
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="actions.openAddStepModal">
        <v-list-item-title>
          <v-icon>mdi-plus</v-icon>
          Add step
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="actions.openDeleteStepModal">
        <v-list-item-title>
          <v-icon>mdi-delete</v-icon>
          Delete step
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="actions.toggleDebugMode">
        <v-list-item-title>
          <v-icon>mdi-meditation</v-icon>
          {{ store.debugMode ? 'Disable' : 'Enable' }} debug
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.v-list-item-title {
  @apply flex flex-row gap-3;
}
</style>
