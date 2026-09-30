<template>
  <v-icon @click="actions.moveStep('before')" class="app-separator app-switch" v-if="edit && index !== 0">mdi-swap-horizontal</v-icon>
  <div class="app-spacer-left w-6" v-else-if="edit && index === 0" />
  <div :class="{ edit }" :id="`step-${id}`" :style="{ width: stepWidth }" @click="selectCurrentStep" @keypress.space="selectCurrentStep" class="app-step" ref="step" role="button" tabindex="0">
    <v-text-field
      :autofocus="edit"
      :class="{ active, italic: edit, edit }"
      :id="`step-title-${id}`"
      :readonly="!edit"
      :tabindex="edit ? 1 : -1"
      :variant="edit ? 'outlined' : 'plain'"
      @change="updateTitle"
      class="app-no-details app-title mx-auto w-full"
      density="compact"
      v-model="updatedTitle"
    />
    <v-text-field
      :class="{ active, italic: edit, edit }"
      :readonly="!edit"
      :style="{ width: `${updatedDuration.length + 5}ch` }"
      :tabindex="edit ? 1 : -1"
      :variant="edit ? 'outlined' : 'plain'"
      @change="updateDuration"
      class="app-no-details duration mx-auto select-none"
      density="compact"
      prepend-icon="mdi-clock-outline"
      v-model="updatedDuration"
    />

    <v-text-field :tabindex="edit ? 1 : -1" @change="updateStart" class="app-no-details mx-auto" density="compact" type="datetime-local" v-if="edit" v-model="updatedStart" variant="outlined" />
    <v-text-field :tabindex="edit ? 1 : -1" @change="updateEnd" class="app-no-details mx-auto" density="compact" type="datetime-local" v-if="edit" v-model="updatedEnd" variant="outlined" />
    <div class="app-date-end whitespace-nowrap text-white opacity-60" v-else>
      <div class="flex flex-row items-center justify-center gap-2" v-if="showDate">
        <v-icon size="x-small">mdi-calendar-month</v-icon>
        <span v-html="endDateDay" />
      </div>
      <div class="flex flex-row items-center justify-center gap-2" v-if="showTime">
        <v-icon class="brightness-125" size="x-small" v-if="parseInt(endDateHour) <= 12">mdi-white-balance-sunny</v-icon>
        <v-icon class="brightness-50" size="x-small" v-if="parseInt(endDateHour) > 12">mdi-white-balance-sunny</v-icon>
        <span v-html="endDateHour" />
      </div>
    </div>
  </div>
  <v-icon @click="actions.moveStep('after')" class="app-separator app-switch" v-if="showRightSwap">mdi-swap-horizontal</v-icon>
  <v-icon class="app-separator" v-else-if="showRightChevron">mdi-chevron-right</v-icon>
  <div class="app-spacer-right w-6" v-else-if="isLast" />
</template>

<script setup lang="ts">
import { dateToIsoString, formatDate } from 'shuutils'
import { computed, onMounted, ref, watch } from 'vue'
import { actions, activeProject, activeStep, store } from '../store'
import { logger } from '../utils/logger.utils'
import { durationBetweenDates } from '../utils/step.utils'

const {
  active,
  days = undefined,
  duration = '',
  end = new Date(),
  hours = undefined,
  id = 0,
  index = 0,
  isLast,
  minutes = undefined,
  months = undefined,
  projectActive,
  projectId = 0,
  showDate = true,
  showTime = true,
  start = new Date(),
  title = '',
  weeks = undefined,
} = defineProps<{
  active?: boolean
  days?: number
  duration?: string
  end?: Date
  hours?: number
  id?: number
  index?: number
  isLast?: boolean
  minutes?: number
  months?: number
  projectActive?: boolean
  projectId?: number
  showDate?: boolean
  showTime?: boolean
  start?: Date
  title?: string
  weeks?: number
}>()

const widthPadding = 8
const minWidth = 14
const minWidthEdit = 22
const maxWidth = 40
const isoMinutesLength = 16 // "2020-01-01T00:00"

const updatedDuration = ref('')
const updatedEnd = ref('')
const updatedStart = ref('')
const updatedTitle = ref('')

const edit = computed(() => store.editMode && active)
const endDateDay = computed(() => formatDate(end, 'dd / MM').replaceAll(/\s/gu, '&ThinSpace;'))
const endDateHour = computed(() => formatDate(end, 'HH h mm').replace('h 00', 'h').replaceAll(/\s/gu, '&ThinSpace;'))
const showRightChevron = computed(() => {
  // old method : !editMode || !projectActive || index !== activeStepIndex - 1
  if (isLast) return false
  return !store.editMode || !projectActive || index !== store.activeStepIndex - 1
})
const showRightSwap = computed(() => edit.value && !isLast && index !== store.activeStepIndex - 1)
const stepWidth = computed(() => `${Math.min(Math.max(Math.max(updatedTitle.value.length, updatedDuration.value.length) + widthPadding, edit.value ? minWidthEdit : minWidth), maxWidth)}ch`)

/**
 * @param date The date to format
 * @returns The formatted date
 */
function dateIso(date: Date | string) {
  const updatedDate = date instanceof Date ? date : new Date(date)
  return dateToIsoString(updatedDate, true).slice(0, isoMinutesLength)
}

/**
 * @param event The click event
 */
function selectCurrentStep(event?: Event) {
  if (event !== undefined) event.stopPropagation()
  if (!activeProject.value || activeProject.value.id !== projectId) actions.selectProject(projectId)
  if (!activeStep.value || activeStep.value.id !== id) actions.selectStep(id)
}

/**
 * @param event The input event
 */
function updateDuration(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    logger.error('no duration target')
    return
  }
  logger.debug('update step duration with', target.value)
  selectCurrentStep()
  actions.patchCurrentStepDuration(target.value)
}

function updateEnd() {
  const newStart = new Date(updatedStart.value)
  const newEnd = new Date(updatedEnd.value)
  const newDuration = durationBetweenDates(newStart, newEnd)
  logger.debug('update end via new duration :', newDuration)
  selectCurrentStep()
  actions.patchCurrentStepDuration(newDuration)
}

function updateStart() {
  const newStart = new Date(updatedStart.value)
  logger.debug(`update step start from "${updatedStart.value}" to "${newStart.toLocaleDateString()}"`)
  selectCurrentStep()
  actions.patchCurrentStepStart(newStart)
}

/**
 * @param event The input event
 */
function updateTitle(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    logger.error('no title target')
    return
  }
  logger.debug('update step title to', target.value)
  selectCurrentStep()
  actions.patchCurrentStepTitle(target.value)
}

onMounted(() => {
  updatedTitle.value = title
  updatedDuration.value = duration
  updatedStart.value = dateIso(start)
  updatedEnd.value = dateIso(end)
})

watch(
  () => duration,
  value => {
    updatedDuration.value = value
  },
)
watch(
  () => end,
  value => {
    updatedEnd.value = dateIso(value)
  },
)
watch(
  () => start,
  value => {
    updatedStart.value = dateIso(value)
  },
)
watch(
  () => title,
  value => {
    updatedTitle.value = value
  },
)
</script>

<style>
@reference "tailwindcss";

.app-step {
  @apply flex shrink-0 flex-col gap-3 px-2 text-center select-none;
}

.app-step.edit {
  @apply sepia;
}

.v-input.app-no-details .v-input__prepend {
  @apply m-0 pt-0.5 pr-2;
}

.v-input.app-no-details .v-field__input,
.v-input.app-no-details .v-field__field {
  @apply min-h-0;
  padding: 0;
}

.v-input.app-no-details .v-input__details {
  @apply hidden;
}

.app-title,
.v-input.app-title .v-field__input {
  @apply text-center text-2xl;
}

.v-input.app-title .v-field__input input {
  @apply text-center;
}

.v-field__input input {
  @apply bg-transparent;
}

.v-input .v-field__overlay {
  @apply hidden;
}

.v-input.duration .v-field__input {
  @apply text-xl;
}

.v-input.app-title .v-field__input,
.v-input.duration .v-field__input {
  padding: 0;
}

.app-step .app-title.active:not(.edit),
.app-step .v-input.app-title.active:not(.edit) .v-field__input {
  @apply underline underline-offset-2;
}

.app-separator {
  @apply m-4 rotate-90 opacity-50 transition md:rotate-0;
}

.app-separator.v-icon--clickable {
  @apply rounded-full border p-4;
}

.app-separator.app-switch:hover {
  @apply scale-110 rotate-180 opacity-100;
}
</style>
