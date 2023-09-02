<template>
  <v-icon v-if="edit && index !== 0" class="app-separator app-switch" @click="actions.moveStep('before')">mdi-swap-horizontal</v-icon>
  <div v-else-if="edit && index === 0" class="app-spacer-left w-6"></div>
  <div :id="`step-${id}`" ref="step" class="app-step" :class="{ edit }" :style="{ width: stepWidth }" @click="selectCurrentStep">
    <v-text-field :id="`step-title-${id}`" v-model="updatedTitle" :autofocus="edit" class="app-no-details app-title mx-auto w-full"
      :class="{ active, italic: edit, edit }" density="compact" :readonly="!edit" :tabindex="edit ? 1 : -1" :variant="edit ? 'outlined' : 'plain'"
      @change="updateTitle" />
    <v-text-field v-model="updatedDuration" class="app-no-details duration mx-auto select-none" :class="{ active, italic: edit, edit }"
      density="compact" prepend-icon="mdi-clock-outline" :readonly="!edit" :style="{ width: `${updatedDuration.length + 5}ch` }"
      :tabindex="edit ? 1 : -1" :variant="edit ? 'outlined' : 'plain'" @change="updateDuration" />

    <v-text-field v-if="edit" v-model="updatedStart" class="app-no-details mx-auto" density="compact" :tabindex="edit ? 1 : -1" type="datetime-local"
      variant="outlined" @change="updateStart" />
    <v-text-field v-if="edit" v-model="updatedEnd" class="app-no-details mx-auto" density="compact" :tabindex="edit ? 1 : -1" type="datetime-local"
      variant="outlined" @change="updateEnd" />
    <div v-else class="app-date-end whitespace-nowrap text-white opacity-60">
      <div v-if="showDate" class="flex flex-row items-center justify-center gap-2">
        <v-icon size="x-small">mdi-calendar-month</v-icon>
        <!-- eslint-disable-next-line vue/no-v-html, sonar/no-vue-bypass-sanitization -->
        <span v-html="endDateDay"></span>
      </div>
      <div v-if="showTime" class="flex flex-row items-center justify-center gap-2">
        <v-icon v-if="parseInt(endDateHour) <= 12" class="brightness-125" size="x-small">mdi-white-balance-sunny</v-icon>
        <v-icon v-if="parseInt(endDateHour) > 12" class="brightness-50" size="x-small">mdi-white-balance-sunny</v-icon>
        <!-- eslint-disable-next-line vue/no-v-html, sonar/no-vue-bypass-sanitization -->
        <span v-html="endDateHour"></span>
      </div>
    </div>
  </div>
  <v-icon v-if="showRightSwap" class="app-separator app-switch" @click="actions.moveStep('after')">mdi-swap-horizontal</v-icon>
  <v-icon v-else-if="showRightChevron" class="app-separator">mdi-chevron-right</v-icon>
  <div v-else-if="isLast" class="app-spacer-right w-6"></div>
</template>

<script lang="ts">
import { actions, activeProject, activeStep, store } from '@/store'
import { logger } from '@/utils/logger.utils'
import { durationBetweenDates } from '@/utils/step.utils'
import { dateToIsoString, formatDate } from 'shuutils'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
    },
    id: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    projectId: {
      type: Number,
      default: 0,
    },
    projectActive: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    months: {
      type: Number,
      default: undefined,
    },
    weeks: {
      type: Number,
      default: undefined,
    },
    days: {
      type: Number,
      default: undefined,
    },
    hours: {
      type: Number,
      default: undefined,
    },
    minutes: {
      type: Number,
      default: undefined,
    },
    start: {
      type: Date,
      default: new Date(),
    },
    end: {
      type: Date,
      default: new Date(),
    },
    showDate: {
      type: Boolean,
      default: true, // eslint-disable-line vue/no-boolean-default
    },
    showTime: {
      type: Boolean,
      default: true, // eslint-disable-line vue/no-boolean-default
    },
    isLast: {
      type: Boolean,
    },
  },
  data: () => ({
    updatedTitle: '',
    updatedDuration: '',
    updatedStart: '',
    updatedEnd: '',
    actions,
  }),
  computed: {
    edit () {
      return store.editMode && this.active
    },
    stepWidth () {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return `${Math.min(Math.max(Math.max(this.updatedTitle.length, this.updatedDuration.length) + 8, this.edit ? 22 : 14), 40)}ch`
    },
    endDateDay () {
      return formatDate(this.end, 'dd / MM').replace(/\s/gu, '&ThinSpace;')
    },
    endDateHour () {
      return formatDate(this.end, 'HH h mm').replace('h 00', 'h').replace(/\s/gu, '&ThinSpace;')
    },
    showRightSwap () {
      return this.edit && !this.isLast && (this.index !== store.activeStepIndex - 1)
    },
    showRightChevron () {
      // old method : !editMode || !projectActive || index !== activeStepIndex - 1
      if (this.isLast) return false
      return !store.editMode || !this.projectActive || (this.index !== store.activeStepIndex - 1)
    },
  },
  watch: {
    title (value: string) {
      this.updatedTitle = value
    },
    duration (value: string) {
      this.updatedDuration = value
    },
    start (value: string) {
      this.updatedStart = this.dateIso(value)
    },
    end (value: string) {
      this.updatedEnd = this.dateIso(value)
    },
  },
  mounted () {
    this.updatedTitle = this.title
    this.updatedDuration = this.duration
    this.updatedStart = this.dateIso(this.start)
    this.updatedEnd = this.dateIso(this.end)
  },
  methods: {
    dateIso (date: Date | string) {
      const updatedDate = date instanceof Date ? date : new Date(date)
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return dateToIsoString(updatedDate, true).slice(0, 16)
    },
    selectCurrentStep (event?: Event) {
      if (event !== undefined) event.stopPropagation()
      if (!activeProject.value || (activeProject.value.id !== this.projectId)) actions.selectProject(this.projectId)
      if (!activeStep.value || (activeStep.value.id !== this.id)) actions.selectStep(this.id)
    },
    updateTitle (event: HtmlInputEvent) {
      const { target } = event
      if (!target) { logger.error('no title target'); return }
      logger.debug('update step title to', target.value)
      this.selectCurrentStep()
      actions.patchCurrentStepTitle(target.value)
    },
    updateDuration (event: HtmlInputEvent) {
      const { target } = event
      if (!target) { logger.error('no duration target'); return }
      logger.debug('update step duration with', target.value)
      this.selectCurrentStep()
      actions.patchCurrentStepDuration(target.value)
    },
    updateStart () {
      const start = new Date(this.updatedStart)
      logger.debug(`update step start from "${this.updatedStart}" to "${start.toLocaleDateString()}"`)
      this.selectCurrentStep()
      actions.patchCurrentStepStart(start)
    },
    updateEnd () {
      const start = new Date(this.updatedStart)
      const end = new Date(this.updatedEnd)
      const duration = durationBetweenDates(start, end)
      logger.debug('update end via new duration :', duration)
      this.selectCurrentStep()
      actions.patchCurrentStepDuration(duration)
    },
  },
})
</script>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
.app-step {
  @apply flex flex-col gap-3 px-2 flex-shrink-0 text-center select-none;
}

.app-step.edit {
  @apply sepia;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.v-input.app-no-details .v-input__prepend {
  @apply m-0 pt-0.5 pr-2;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.v-input.app-no-details .v-field__input, .v-input.app-no-details .v-field__field {
  @apply p-0 min-h-0;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.v-input.app-no-details .v-input__details {
  @apply hidden;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
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

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.v-input.duration .v-field__input {
  @apply text-xl;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.v-input.app-title .v-field__input,.v-input.duration .v-field__input {
  @apply p-0;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.app-step .app-title.active:not(.edit),.app-step .v-input.app-title.active:not(.edit) .v-field__input {
  @apply underline underline-offset-2;
}

.app-separator {
  @apply md:rotate-0 m-4 opacity-50 rotate-90 transition;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.app-separator.v-icon--clickable {
  @apply border rounded-full p-4;
}

.app-separator.app-switch:hover {
  @apply rotate-180 opacity-100 scale-110;
}
</style>
