<script setup lang="ts">
import { actions, activeStep, store } from '../store'
import { logger } from '../utils/logger.utils'

function onClose () {
  store.deleteStepModalOpened = false
}

function onDeleteClose () {
  logger.debug('delete step and close modal')
  actions.deleteActiveStep()
  onClose()
}
</script>

<template>
  <v-dialog v-model="store.deleteStepModalOpened" width="auto">
    <v-card>
      <v-card-text>
        <p class="mb-4">You are about to delete the step "{{ activeStep?.title }}", are you sure ?</p>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="onClose">Cancel</v-btn>
          <v-btn @click="onDeleteClose" color="primary" variant="elevated">Confirm delete</v-btn>
          <app-hotkey :keys="['enter']" @hotkey="onDeleteClose" />
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
