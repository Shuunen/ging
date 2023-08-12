<script setup lang="ts">
import { actions, activeStep, store } from '@/store'
import { ref } from 'vue'

const title = ref(activeStep.value?.title ?? '')

function onClose () {
  store.deleteStepModalOpened = false
}

function onDeleteClose () {
  console.log('delete step and close modal')
  actions.deleteActiveStep()
  onClose()
}
</script>

<template>
  <v-dialog v-model="store.deleteStepModalOpened" width="auto">
    <v-card>
      <v-card-text>
        <p class="mb-4">You are about to delete the step "{{ title }}", are you sure ?</p>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="onClose">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="onDeleteClose">Confirm delete</v-btn>
          <app-hotkey :keys="['enter']" @hotkey="onDeleteClose" />
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

