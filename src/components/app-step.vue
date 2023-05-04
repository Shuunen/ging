<template>
  <v-icon v-if="edit && index !== 0" class="app-separator app-switch" @click="moveStep('before')">mdi-swap-horizontal</v-icon>
  <div :id="`step-${id}`" ref="step" class="app-step" :class="{ edit }" :style="{ width: stepWidth }" @click="selectCurrentStep">
    <v-text-field :id="`step-title-${id}`" v-model="updatedTitle" :tabindex="edit ? 1 : -1" :autofocus="edit" :readonly="!edit" density="compact"
      :variant="edit ? 'outlined' : 'plain'" class="app-no-details app-title mx-auto w-full" :class="{ active, italic: edit, edit }"
      @change="updateTitle" />
    <v-text-field v-model="updatedDuration" :tabindex="edit ? 1 : -1" :readonly="!edit" density="compact" prepend-icon="mdi-clock-outline"
      :variant="edit ? 'outlined' : 'plain'" class="app-no-details duration mx-auto select-none" :class="{ active, italic: edit, edit }"
      :style="{ width: `${updatedDuration.length + 5}ch` }" @change="updateDuration" />

    <v-text-field v-if="edit" v-model="updatedStart" :tabindex="edit ? 1 : -1" class="app-no-details mx-auto" type="datetime-local" density="compact"
      variant="outlined" @change="updateStart" />
    <v-text-field v-if="edit" v-model="updatedEnd" :tabindex="edit ? 1 : -1" class="app-no-details mx-auto" type="datetime-local" density="compact"
      variant="outlined" @change="updateEnd" />
    <div v-else class="app-date-end whitespace-nowrap text-white opacity-60">
      {{ end.toLocaleDateString() }}
      <div class="flex flex-row items-center justify-center gap-2">
        {{ end.toLocaleTimeString().replace(/:\d\d$/, "").replace(':00', ' h').replace(':', ' h') }}
        <v-icon v-if="parseInt(end.toLocaleTimeString()) <= 12" class="brightness-125" size="x-small">mdi-white-balance-sunny</v-icon>
        <v-icon v-if="parseInt(end.toLocaleTimeString()) > 12" class="brightness-50" size="x-small">mdi-white-balance-sunny</v-icon>
      </div>
    </div>
  </div>
  <v-icon v-if="edit" class="app-separator app-switch" @click="moveStep('after')">mdi-swap-horizontal</v-icon>
  <v-icon v-else-if="!editMode || !projectActive || index !== activeStepIndex - 1" class="app-separator">mdi-chevron-right</v-icon>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { durationBetweenDates } from '@/utils/step'
import { mapActions, mapState } from 'pinia'
import { dateToIsoString } from 'shuutils'
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
  },
  data: () => ({
    updatedTitle: '',
    updatedDuration: '',
    updatedStart: '',
    updatedEnd: '',
  }),
  computed: {
    ...mapState(useStore, ['activeProject', 'activeStep', 'activeStepIndex', 'editMode']),
    edit () {
      return this.editMode && this.active
    },
    stepWidth () {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return `${Math.min(Math.max(Math.max(this.updatedTitle.length, this.updatedDuration.length) + 8, this.edit ? 22 : 14), 40)}ch`
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
    ...mapActions(useStore, ['moveStep', 'selectProject', 'selectStep', 'patchCurrentStepTitle', 'patchCurrentStepDuration', 'patchCurrentStepStart']),
    dateIso (date: Date | string) {
      const updatedDate = date instanceof Date ? date : new Date(date)
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return dateToIsoString(updatedDate, true).slice(0, 16)
    },
    selectCurrentStep (event?: Event) {
      if (event !== undefined) event.stopPropagation()
      if (!this.activeProject || (this.activeProject.id !== this.projectId)) this.selectProject(this.projectId)
      if (!this.activeStep || (this.activeStep.id !== this.id)) this.selectStep(this.id)
    },
    updateTitle (event: HtmlInputEvent) {
      const { target } = event
      if (!target) { console.error('no title target'); return }
      console.log('update step title to', target.value)
      this.selectCurrentStep()
      this.patchCurrentStepTitle(target.value)
    },
    updateDuration (event: HtmlInputEvent) {
      const { target } = event
      if (!target) { console.error('no duration target'); return }
      console.log('update step duration with', target.value)
      this.selectCurrentStep()
      this.patchCurrentStepDuration(target.value)
    },
    updateStart () {
      const start = new Date(this.updatedStart)
      console.log(`update step start from "${this.updatedStart}" to "${start.toLocaleDateString()}"`)
      this.selectCurrentStep()
      this.patchCurrentStepStart(start)
    },
    updateEnd () {
      const start = new Date(this.updatedStart)
      const end = new Date(this.updatedEnd)
      const duration = durationBetweenDates(start, end)
      console.log('update end via new duration :', duration)
      this.selectCurrentStep()
      this.patchCurrentStepDuration(duration)
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
