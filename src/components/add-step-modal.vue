<script setup lang="ts">
import { Step } from '@/models/step.model'
import { actions, store } from '@/store'
import { requiredRules } from '@/utils/form.utils'
import { logger } from '@/utils/logger.utils'
import { stringToStepData } from '@/utils/step.utils'
import { ref } from 'vue'

const title = ref('')

function onClose () {
  store.addStepModalOpened = false
}

function onSubmit (event: Event) {
  event.preventDefault()
  const str = /\d/u.test(title.value) ? title.value : `${title.value} 1 hour`
  const step = new Step(stringToStepData(str))
  logger.debug('submit, adding step', step)
  actions.addStep(step)
  title.value = ''
  onClose()
}
</script>

<template>
  <v-snackbar v-if="store.projects.length === 0" v-model="store.addStepModalOpened" color="primary">
    You first need to create a project to add a step to it.
  </v-snackbar>
  <v-dialog v-else v-model="store.addStepModalOpened" width="auto">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="mb-4 text-3xl">New step</div>
          <v-form ref="form" @submit="onSubmit">
            <!-- eslint-disable vuejs-accessibility/no-autofocus -->
            <v-text-field v-model="title" :autofocus="store.addStepModalOpened"
              hint="Like &ldquo;Get some milk, 1 hour&rdquo; or &ldquo;Go to Japan, 3 weeks&rdquo;" label="Step title, time" required
              :rules="requiredRules" />
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="onClose">Cancel</v-btn>
          <v-btn color="primary" :disabled="title.length === 0" variant="elevated" @click="onSubmit">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>


