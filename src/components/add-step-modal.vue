<script setup>
import { ref } from 'vue'
import { Step } from '../models/step.model'
import { actions, store } from '../store'
import { requiredRules } from '../utils/form.utils'
import { logger } from '../utils/logger.utils'
import { stringToStepData } from '../utils/step.utils'

const title = ref('')

function onClose () {
  store.addStepModalOpened = false
}

/**
 * @param {Event} event the submit event
 */
function onSubmit (event) {
  event.preventDefault()
  const stepString = /\d/u.test(title.value) ? title.value : `${title.value} 1 hour`
  const step = new Step(stringToStepData(stepString))
  logger.debug('submit, adding step', step)
  actions.addStep(step)
  title.value = ''
  onClose()
}
</script>

<template>
  <v-snackbar color="primary" v-if="store.projects.length === 0" v-model="store.addStepModalOpened">
    You first need to create a project to add a step to it.
  </v-snackbar>
  <v-dialog v-else v-model="store.addStepModalOpened" width="auto">
    <v-card>
      <v-container>
        <v-col class="min-w-80">
          <div class="mb-4 text-3xl">New step</div>
          <v-form @submit="onSubmit" ref="form">
            <!-- eslint-disable vuejs-accessibility/no-autofocus -->
            <v-text-field :autofocus="store.addStepModalOpened" :rules="requiredRules"
              hint="Like &ldquo;Get some milk, 1 hour&rdquo; or &ldquo;Go to Japan, 3 weeks&rdquo;" label="Step title, time" required
              v-model="title" />
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="onClose" variant="plain">Cancel</v-btn>
          <v-btn :disabled="title.length === 0" @click="onSubmit" color="primary" variant="elevated">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>
