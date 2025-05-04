<script setup>
// @ts-expect-error missing types
import colors from 'tailwindcss/colors'
import { computed, ref } from 'vue'
import { Project } from '../models/project.model'
import { actions, store } from '../store'
import { colorToGradient } from '../utils/colors.utils'
import { requiredRules } from '../utils/form.utils'
import { logger } from '../utils/logger.utils'

// eslint-disable-next-line unicorn/prefer-array-find
const tailwindColors = Object.keys(colors).filter(color => !['amber', 'black', 'current', 'gray', 'inherit', 'neutral', 'rose', 'slate', 'stone', 'transparent', 'white'].includes(color) && !/[A-Z]/u.test(color))
const title = ref('')
const color = ref(tailwindColors[0] ?? '')
// eslint-disable-next-line no-useless-assignment
const isValid = computed(() => (title.value.length > 0))

function onClose() {
  store.addProjectModalOpened = false
}

function onSubmit() {
  logger.debug('submit project')
  actions.addProject(new Project({ color: color.value, title: title.value }))
  title.value = ''
  color.value = ''
  onClose()
}

/**
 * @param {string} colorToUse the color to use
 */
function setColor(colorToUse) {
  logger.debug('set color', colorToUse)
  color.value = colorToUse
}
</script>

<template>
  <v-btn @click="store.addProjectModalOpened = true" color="secondary" prepend-icon="mdi-plus" variant="tonal">Add project</v-btn>
  <v-dialog v-model="store.addProjectModalOpened" width="auto">
    <v-card>
      <v-container :class="[colorToGradient('slate', 900, color, 900)]" class="from-40%">
        <v-col class="min-w-80">
          <div class="mb-4 text-4xl">New project</div>
          <v-form @submit.prevent="onSubmit">
            <!-- eslint-disable-next-line vuejs-accessibility/no-autofocus -->
            <v-text-field :autofocus="store.addProjectModalOpened" :rules="requiredRules" label="Title" required v-model="title" />
            <div class="app-colors mb-2 mt-4 grid grid-cols-4 gap-2 md:grid-cols-8">
              <div :class="[colorToGradient(tailwindColor), tailwindColor === color ? 'border-indigo-400' : 'border-slate-800']" :key="tailwindColor"
                @click="setColor(tailwindColor)" @keypress="setColor(tailwindColor)"
                class="app-color h-10 w-16 cursor-pointer rounded-md border-2 transition-all hover:scale-125" role="button" tabindex="0"
                v-for="tailwindColor in tailwindColors" />
            </div>
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="onClose" variant="plain">Cancel</v-btn>
          <v-btn :disabled="!isValid" @click="onSubmit" color="primary" type="submit" variant="elevated">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <app-hotkey :keys="['alt', 'a']" @hotkey="store.addProjectModalOpened = true" />
</template>
