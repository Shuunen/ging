<template>
  <v-container :class="[active ? 'app-active' : 'brightness-75 grayscale']" @click="actions.selectProject(id)" class="app-project flex flex-col items-start gap-4 transition duration-300 hover:grayscale-0">
    <div :class="{ 'gap-4': edit, active, edit }" class="app-project--header flex max-w-full cursor-pointer flex-row flex-wrap items-end">
      <v-text-field
        :autofocus="edit"
        :class="{ active, italic: edit, edit }"
        :id="`project-title-${id}`"
        :readonly="!edit"
        :style="{ width: titleWidth }"
        :tabindex="edit ? 1 : -1"
        :variant="edit ? 'outlined' : 'plain'"
        @change="updateTitle"
        class="app-no-details app-title app-title-xl max-w-full"
        density="compact"
        v-model="updatedTitle"
      />
      <v-btn @click="actions.toggleDateDisplay" color="secondary" prepend-icon="mdi-calendar-month" v-if="edit" variant="tonal"> {{ isDateDisplayed ? 'Hide' : 'Show' }} dates </v-btn>
      <v-btn @click="actions.toggleTimeDisplay" color="secondary" prepend-icon="mdi-white-balance-sunny" v-if="edit" variant="tonal"> {{ isTimeDisplayed ? 'Hide' : 'Show' }} hours </v-btn>
      <transition-slide :offset="['-100%', 0]" v-if="!edit">
        <v-icon class="pt-2 text-4xl" color="secondary" icon="mdi-chevron-triple-right" v-if="active" />
      </transition-slide>
    </div>
    <div
      :class="[colorToGradient(color), active ? 'shadow-2xl' : 'shadow-sm']"
      class="app-steps flex w-full max-w-full cursor-pointer flex-col items-center overflow-hidden overflow-x-auto rounded-lg py-4 sm:w-auto sm:flex-row sm:rounded-xl"
      v-if="steps.length > 0"
    >
      <app-step
        :key="`step-${index}`"
        v-for="(step, index) in processedSteps"
        v-bind="step"
        :active="active && index === store.activeStepIndex"
        :index
        :is-last="index === steps.length - 1"
        :project-active="active"
        :project-id="id"
        :show-date="isDateDisplayed"
        :show-time="isTimeDisplayed"
      />
    </div>
    <transition-fade>
      <v-btn @click="addStepHere" color="secondary" prepend-icon="mdi-plus" v-if="steps.length === 0" variant="outlined"> Add step </v-btn>
    </transition-fade>
  </v-container>
</template>

<script setup lang="ts">
import { nbSecondsInMinute, sleep } from 'shuutils'
import { computed, onMounted, ref, watch } from 'vue'
import type { Step } from '../models/step.model'
import { actions, store } from '../store'
import { colorToGradient } from '../utils/colors.utils'
import { logger } from '../utils/logger.utils'
import { processStepsDurations } from '../utils/step.utils'

const {
  active,
  id = 0,
  isDateDisplayed = true,
  isTimeDisplayed = true,
  steps = [],
  title = '',
  color = 'red',
} = defineProps<{
  active?: boolean
  color?: string
  id?: number
  isDateDisplayed?: boolean
  isTimeDisplayed?: boolean
  steps?: Step[]
  title?: string
}>()

const mobileBreakpoint = 500

const updatedTitle = ref('')

const edit = computed(() => store.editMode && active)
const processedSteps = computed(() => processStepsDurations(steps))
const titleWidth = computed(() => {
  if (store.editMode && window.innerWidth < mobileBreakpoint) return '100%'
  const widths = { base: 8, large: 21, none: 0, small: 17, space: 10 }
  let width = widths.base
  const chars = Array.from(updatedTitle.value)
  for (const char of chars)
    if (char === ' ') width += widths.space
    else if (/[A-Z]/u.test(char)) width += widths.large
    else width += widths.small

  return `${width}px`
})

function addStepHere() {
  logger.debug('add step here')
  actions.selectProject(id)
  actions.openAddStepModal()
}

function updateTitle() {
  logger.debug('update title to', updatedTitle.value)
  actions.patchCurrentProjectTitle(updatedTitle.value)
}

async function scrollToStepLater() {
  await sleep(nbSecondsInMinute)
  actions.scrollToStep()
}

onMounted(() => {
  updatedTitle.value = title
  if (active) void scrollToStepLater()
})

watch(
  () => title,
  value => {
    logger.debug('title changed', value)
    updatedTitle.value = value
  },
)
</script>

<style>
@reference "tailwindcss";

.app-steps > .separator:last-child {
  @apply hidden;
}

.app-steps > .step:first-of-type {
  @apply pl-6;
}

.app-steps > .step:last-of-type {
  @apply pr-6;
}

.app-title.app-title-xl,
.v-input.app-title.app-title-xl .v-field__input {
  @apply mr-1 text-left text-4xl font-thin;
}

.app-active .app-title.app-title-xl,
.app-active .v-input.app-title.app-title-xl .v-field__input {
  @apply font-light;
}

.app-title-xl input {
  @apply text-ellipsis;
}

.app-title-xl.active input {
  @apply text-left;
}

.app-project--header.edit:not(.active) {
  @apply w-full;
}
</style>
