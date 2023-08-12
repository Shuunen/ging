<script setup lang="ts">
import { actions, activeProject, store } from '@/store'
import { computed } from 'vue'

const title = computed(() => activeProject.value?.title ?? '')

function onClose () {
  store.deleteProjectModalOpened = false
}

function deleteClose () {
  console.log('delete project and close modal')
  actions.deleteActiveProject()
  onClose()
}
</script>

<template>
  <v-dialog v-model="store.deleteProjectModalOpened" width="auto">
    <v-card>
      <v-card-text>
        <p class="mb-4">You are about to delete the project "{{ title }}", are you sure ?</p>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="onClose">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="deleteClose">Confirm delete</v-btn>
          <app-hotkey :keys="['enter']" @hotkey="deleteClose" />
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
