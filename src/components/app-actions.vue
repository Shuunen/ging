<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn variant="outlined" color="secondary" append-icon="mdi-dots-vertical" v-bind="props">Actions</v-btn>
    </template>
    <v-list>
      <v-list-item @click="toggleEditMode">
        <v-list-item-title>
          <v-icon>mdi-pencil</v-icon>
          {{ editMode ? 'Stop' : 'Start' }} edition
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="openAddProjectModal">
        <v-list-item-title>
          <v-icon>mdi-plus</v-icon>
          Add project
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="openDeleteProjectModal">
        <v-list-item-title>
          <v-icon>mdi-delete</v-icon>
          Delete project
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="openAddStepModal">
        <v-list-item-title>
          <v-icon>mdi-plus</v-icon>
          Add step
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="openDeleteStepModal">
        <v-list-item-title>
          <v-icon>mdi-delete</v-icon>
          Delete step
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="toggleDebugMode">
        <v-list-item-title>
          <v-icon>mdi-meditation</v-icon>
          {{ debugMode ? 'Disable' : 'Enable' }} debug
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['add-project'],
  computed: {
    ...mapState(useStore, ['activeProjectIndex', 'activeStepIndex', 'editMode', 'debugMode']),
  },
  methods: {
    ...mapActions(useStore, ['toggleDebugMode', 'toggleEditMode', 'openAddProjectModal', 'openAddStepModal','openDeleteStepModal','openDeleteProjectModal']),
  },
})
</script>

<style>
.v-list-item-title {
  @apply flex flex-row gap-3;
}
</style>
