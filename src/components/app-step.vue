<template>
  <v-icon v-if="edit && index !== 0" class="separator switch" @click="moveStep('before')">mdi-swap-horizontal</v-icon>
  <div :id="'step-' + id" ref="step" class="step" :class="{ edit }" :style="{ width: stepWidth }" @click="selectCurrentStep">
    <v-text-field
      :id="'step-title-' + id"
      v-model="newTitle"
      :tabindex="edit ? 1 : -1"
      :autofocus="edit"
      :readonly="!edit"
      density="compact"
      :variant="edit ? 'outlined' : 'plain'"
      class="no-details title w-full mx-auto"
      :class="{ active, italic: edit, edit }"
      @change="updateTitle"
    />
    <v-text-field
      v-model="newDuration"
      :tabindex="edit ? 1 : -1"
      :readonly="!edit"
      density="compact"
      prepend-icon="mdi-clock-outline"
      :variant="edit ? 'outlined' : 'plain'"
      class="no-details duration mx-auto select-none"
      :class="{ active, italic: edit, edit }"
      :style="{ width: newDuration.length + 5 + 'ch' }"
      @change="updateDuration"
    />

    <v-text-field v-if="edit" v-model="newStart" :tabindex="edit ? 1 : -1" class="no-details mx-auto" type="datetime-local" density="compact" variant="outlined" @change="updateStart" />
    <v-text-field v-if="edit" v-model="newEnd" :tabindex="edit ? 1 : -1" class="no-details mx-auto" type="datetime-local" density="compact" variant="outlined" @change="updateEnd" />
    <p v-else class="date-end whitespace-nowrap opacity-60 text-white">
      {{ end.toLocaleDateString() }} <br />
      {{ end.toLocaleTimeString().replace(/:\d\d$/, "") }}
    </p>
  </div>
  <v-icon v-if="edit" class="separator switch" @click="moveStep('after')">mdi-swap-horizontal</v-icon>
  <v-icon v-else-if="!editMode || !projectActive || index !== activeStepIndex - 1" class="separator">mdi-chevron-right</v-icon>
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
      default: false,
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
      default: false,
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
    newTitle: '',
    newDuration: '',
    newStart: '',
    newEnd: '',
  }),
  computed: {
    ...mapState(useStore, ['activeProject', 'activeStep', 'activeStepIndex', 'editMode']),
    edit () {
      return this.editMode && this.active
    },
    stepWidth () {
      return Math.min(Math.max(Math.max(this.newTitle.length, this.newDuration.length) + 8, (this.edit && this.active) ? 22 : 14), 40) + 'ch'
    },
  },
  watch: {
    title (value) {
      this.newTitle = value
    },
    duration (value) {
      this.newDuration = value
    },
    start (value) {
      this.newStart = this.dateIso(value)
    },
    end (value) {
      this.newEnd = this.dateIso(value)
    },
  },
  mounted () {
    this.newTitle = this.title
    this.newDuration = this.duration
    this.newStart = this.dateIso(this.start)
    this.newEnd = this.dateIso(this.end)
  },
  methods: {
    ...mapActions(useStore, ['moveStep', 'selectProject', 'selectStep', 'patchCurrentStepTitle', 'patchCurrentStepDuration', 'patchCurrentStepStart']),
    dateIso (date: string | Date) {
      const newDate = date instanceof Date ? date : new Date(date)
      const result = dateToIsoString(newDate, true).slice(0, 16)
      return result
    },
    selectCurrentStep (event?: Event) {
      if (event !== undefined) event.stopPropagation()
      if (!this.activeProject || (this.activeProject.id !== this.projectId)) this.selectProject(this.projectId)
      if (!this.activeStep || (this.activeStep.id !== this.id)) this.selectStep(this.id)
    },
    updateTitle (event: Event) {
      const target = event.target as HTMLInputElement
      if (!target) return console.error('no title target')
      console.log('update step title to', target.value)
      this.selectCurrentStep()
      this.patchCurrentStepTitle(target.value)
    },
    updateDuration (event: Event) {
      const target = event.target as HTMLInputElement
      if (!target) return console.error('no duration target')
      console.log('update step duration with', target.value)
      this.selectCurrentStep()
      this.patchCurrentStepDuration(target.value)
    },
    updateStart () {
      const start = new Date(this.newStart)
      console.log(`update step start from "${this.newStart}" to "${start}"`)
      this.selectCurrentStep()
      this.patchCurrentStepStart(start)
    },
    updateEnd () {
      const start = new Date(this.newStart)
      const end = new Date(this.newEnd)
      const duration = durationBetweenDates(start, end)
      console.log('update end via new duration :', duration)
      this.selectCurrentStep()
      this.patchCurrentStepDuration(duration)
    },
  },
})
</script>

<style>
.step {
  @apply flex flex-col gap-3 px-2 flex-shrink-0 text-center select-none;
}

.step.edit {
  @apply sepia;
}

.v-input.no-details .v-input__prepend {
  @apply m-0 pt-0.5 pr-2;
}

.v-input.no-details .v-field__input,
.v-input.no-details .v-field__field {
  @apply p-0 min-h-0;
}

.v-input.no-details .v-input__details {
  @apply hidden;
}

.title,
.v-input.title .v-field__input input {
  @apply text-center text-2xl;
}

.v-input.duration .v-field__input input {
  @apply text-xl;
}

.v-input.title .v-field__input,
.v-input.duration .v-field__input {
  @apply p-0;
}

.step .title.active:not(.edit),
.step .v-input.title.active:not(.edit) .v-field__input input {
  @apply underline underline-offset-2;
}

.separator {
  @apply md:rotate-0 m-4 opacity-50 rotate-90 transition;
}

.separator.v-icon--clickable {
  @apply border rounded-full p-4;
}

.separator.switch:hover {
  @apply rotate-180 opacity-100 scale-110;
}
</style>
