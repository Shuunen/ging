<template>
  <v-icon @click="actions.moveStep('before')" class="app-separator app-switch" v-if="edit && index !== 0">mdi-swap-horizontal</v-icon>
  <div class="app-spacer-left w-6" v-else-if="edit && index === 0" />
  <div :class="{ edit }" :id="`step-${id}`" :style="{ width: stepWidth }" @click="selectCurrentStep" @keypress.space="selectCurrentStep"
    class="app-step" ref="step" role="button" tabindex="0">
    <v-text-field :autofocus="edit" :class="{ active, italic: edit, edit }" :id="`step-title-${id}`" :readonly="!edit" :tabindex="edit ? 1 : -1"
      :variant="edit ? 'outlined' : 'plain'" @change="updateTitle" class="app-no-details app-title mx-auto w-full" density="compact"
      v-model="updatedTitle" />
    <v-text-field :class="{ active, italic: edit, edit }" :readonly="!edit" :style="{ width: `${updatedDuration.length + 5}ch` }"
      :tabindex="edit ? 1 : -1" :variant="edit ? 'outlined' : 'plain'" @change="updateDuration" class="app-no-details duration mx-auto select-none"
      density="compact" prepend-icon="mdi-clock-outline" v-model="updatedDuration" />

    <v-text-field :tabindex="edit ? 1 : -1" @change="updateStart" class="app-no-details mx-auto" density="compact" type="datetime-local" v-if="edit"
      v-model="updatedStart" variant="outlined" />
    <v-text-field :tabindex="edit ? 1 : -1" @change="updateEnd" class="app-no-details mx-auto" density="compact" type="datetime-local" v-if="edit"
      v-model="updatedEnd" variant="outlined" />
    <div class="app-date-end whitespace-nowrap text-white opacity-60" v-else>
      <div class="flex flex-row items-center justify-center gap-2" v-if="showDate">
        <v-icon size="x-small">mdi-calendar-month</v-icon>
        <!-- eslint-disable-next-line vue/no-v-html, sonar/no-vue-bypass-sanitization -->
        <span v-html="endDateDay" />
      </div>
      <div class="flex flex-row items-center justify-center gap-2" v-if="showTime">
        <v-icon class="brightness-125" size="x-small" v-if="parseInt(endDateHour) <= 12">mdi-white-balance-sunny</v-icon>
        <v-icon class="brightness-50" size="x-small" v-if="parseInt(endDateHour) > 12">mdi-white-balance-sunny</v-icon>
        <!-- eslint-disable-next-line vue/no-v-html, sonar/no-vue-bypass-sanitization -->
        <span v-html="endDateHour" />
      </div>
    </div>
  </div>
  <v-icon @click="actions.moveStep('after')" class="app-separator app-switch" v-if="showRightSwap">mdi-swap-horizontal</v-icon>
  <v-icon class="app-separator" v-else-if="showRightChevron">mdi-chevron-right</v-icon>
  <div class="app-spacer-right w-6" v-else-if="isLast" />
</template>

<script>
import { dateToIsoString, formatDate } from 'shuutils'
import { defineComponent } from 'vue'
import { actions, activeProject, activeStep, store } from '../store'
import { logger } from '../utils/logger.utils'
import { durationBetweenDates } from '../utils/step.utils'

/**
 * @typedef {object} HtmlInputEvent
 * @property {HTMLInputElement|null} target The target element of the event
 */

export default defineComponent({
  computed: {
    edit() {
      return store.editMode && this.active
    },
    endDateDay() {
      return formatDate(this.end, 'dd / MM').replace(/\s/gu, '&ThinSpace;')
    },
    endDateHour() {
      return formatDate(this.end, 'HH h mm').replace('h 00', 'h').replace(/\s/gu, '&ThinSpace;')
    },
    showRightChevron() {
      // old method : !editMode || !projectActive || index !== activeStepIndex - 1
      if (this.isLast) return false
      return !store.editMode || !this.projectActive || (this.index !== store.activeStepIndex - 1)
    },
    showRightSwap() {
      return this.edit && !this.isLast && (this.index !== store.activeStepIndex - 1)
    },
    stepWidth() {
      // eslint-disable-next-line no-magic-numbers
      return `${Math.min(Math.max(Math.max(this.updatedTitle.length, this.updatedDuration.length) + 8, this.edit ? 22 : 14), 40)}ch`
    },
  },
  data: () => ({
    actions,
    updatedDuration: '',
    updatedEnd: '',
    updatedStart: '',
    updatedTitle: '',
  }),
  methods: {
    /**
     * @param {Date | string} date The date to format
     * @returns {string} The formatted date
     */
    dateIso(date) {
      const updatedDate = date instanceof Date ? date : new Date(date)
      // eslint-disable-next-line no-magic-numbers
      return dateToIsoString(updatedDate, true).slice(0, 16)
    },
    /**
     * @param {Event} [event] The click event
     */
    selectCurrentStep(event) {
      if (event !== undefined) event.stopPropagation()
      if (!activeProject.value || (activeProject.value.id !== this.projectId)) actions.selectProject(this.projectId)
      if (!activeStep.value || (activeStep.value.id !== this.id)) actions.selectStep(this.id)
    },
    /**
     * @param {HtmlInputEvent} event The input event
     */
    updateDuration(event) {
      const { target } = event
      if (!target) { logger.error('no duration target'); return }
      logger.debug('update step duration with', target.value)
      this.selectCurrentStep()
      actions.patchCurrentStepDuration(target.value)
    },
    updateEnd() {
      const start = new Date(this.updatedStart)
      const end = new Date(this.updatedEnd)
      const duration = durationBetweenDates(start, end)
      logger.debug('update end via new duration :', duration)
      this.selectCurrentStep()
      actions.patchCurrentStepDuration(duration)
    },
    updateStart() {
      const start = new Date(this.updatedStart)
      logger.debug(`update step start from "${this.updatedStart}" to "${start.toLocaleDateString()}"`)
      this.selectCurrentStep()
      actions.patchCurrentStepStart(start)
    },
    /**
     * @param {HtmlInputEvent} event The input event
     */
    updateTitle(event) {
      const { target } = event
      if (!target) { logger.error('no title target'); return }
      logger.debug('update step title to', target.value)
      this.selectCurrentStep()
      actions.patchCurrentStepTitle(target.value)
    },
  },
  mounted() {
    this.updatedTitle = this.title
    this.updatedDuration = this.duration
    this.updatedStart = this.dateIso(this.start)
    this.updatedEnd = this.dateIso(this.end)
  },
  props: {
    active: {
      type: Boolean,
    },
    days: {
      default: undefined,
      type: Number,
    },
    duration: {
      default: '',
      type: String,
    },
    end: {
      default: new Date(),
      type: Date,
    },
    hours: {
      default: undefined,
      type: Number,
    },
    id: {
      default: 0,
      type: Number,
    },
    index: {
      default: 0,
      type: Number,
    },
    isLast: {
      type: Boolean,
    },
    minutes: {
      default: undefined,
      type: Number,
    },
    months: {
      default: undefined,
      type: Number,
    },
    projectActive: {
      type: Boolean,
    },
    projectId: {
      default: 0,
      type: Number,
    },
    showDate: {
      default: true,
      type: Boolean,
    },
    showTime: {
      default: true,
      type: Boolean,
    },
    start: {
      default: new Date(),
      type: Date,
    },
    title: {
      default: '',
      type: String,
    },
    weeks: {
      default: undefined,
      type: Number,
    },
  },
  watch: {
    duration(value) {
      this.updatedDuration = value
    },
    end(value) {
      this.updatedEnd = this.dateIso(value)
    },
    start(value) {
      this.updatedStart = this.dateIso(value)
    },
    title(value) {
      this.updatedTitle = value
    },
  },
})
</script>

<style>
@reference "tailwindcss";

.app-step {
  @apply flex flex-col gap-3 px-2 shrink-0 text-center select-none;
}

.app-step.edit {
  @apply sepia;
}

.v-input.app-no-details .v-input__prepend {
  @apply m-0 pt-0.5 pr-2;
}

.v-input.app-no-details .v-field__input, .v-input.app-no-details .v-field__field {
  @apply min-h-0;
  padding: 0;
}

.v-input.app-no-details .v-input__details {
  @apply hidden;
}

.app-title,.v-input.app-title .v-field__input {
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

.v-input.app-title .v-field__input,.v-input.duration .v-field__input {
  padding: 0;
}

.app-step .app-title.active:not(.edit),.app-step .v-input.app-title.active:not(.edit) .v-field__input {
  @apply underline underline-offset-2;
}

.app-separator {
  @apply md:rotate-0 m-4 opacity-50 rotate-90 transition;
}

.app-separator.v-icon--clickable {
  @apply border rounded-full p-4;
}

.app-separator.app-switch:hover {
  @apply rotate-180 opacity-100 scale-110;
}
</style>
