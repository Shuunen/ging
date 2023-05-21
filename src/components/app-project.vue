<template>
  <v-container class="app-project flex flex-col items-start gap-4 transition duration-300 hover:grayscale-0"
    :class="[active ? 'app-active' : 'brightness-75 grayscale']" @click="selectProject(id)">
    <div class="flex cursor-pointer flex-row items-center" :class="{ 'gap-4': edit }">
      <v-text-field :id="`project-title-${id}`" v-model="updatedTitle" :tabindex="edit ? 1 : -1" :autofocus="edit" :readonly="!edit" density="compact"
        :variant="edit ? 'outlined' : 'plain'" class="app-no-details app-title app-title-xl" :class="{ active, italic: edit, edit }"
        :style="{ width: titleWidth }" @change="updateTitle" />
      <v-btn v-if="edit" variant="tonal" color="secondary" prepend-icon="mdi-calendar-month" @click="toggleDateDisplay">
        {{ isDateDisplayed ? 'Hide' : 'Show' }} dates
      </v-btn>
      <v-btn v-if="edit" variant="tonal" color="secondary" prepend-icon="mdi-white-balance-sunny" @click="toggleTimeDisplay">
        {{ isTimeDisplayed ? 'Hide' : 'Show' }} hours
      </v-btn>
      <v-scroll-x-transition>
        <v-icon v-if="active" class="text-4xl" color="secondary" icon="mdi-chevron-triple-right" />
      </v-scroll-x-transition>
    </div>
    <div v-if="steps.length > 0"
      class="app-steps flex w-full max-w-full cursor-pointer flex-col items-center overflow-hidden overflow-x-auto rounded-lg bg-gradient-to-br py-4 sm:w-auto sm:flex-row sm:rounded-xl"
      :class="[colorFrom(700), colorTo(900), active ? 'shadow-2xl' : 'shadow']">
      <app-step v-for="(step, index) in processedSteps" :key="`step-${index}`" v-bind="step" :show-date="isDateDisplayed" :show-time="isTimeDisplayed" :index="index"
        :active="active && (index === activeStepIndex)" :project-active="active" :project-id="id" />
    </div>
    <v-btn v-if="steps.length === 0" variant="outlined" color="secondary" prepend-icon="mdi-plus" @click="addStepHere">
      Add step
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import type { Step } from '@/models/step'
import { useStore } from '@/store'
import { processStepsDurations } from '@/utils/step'
import { mapActions, mapState } from 'pinia'
import { sleep } from 'shuutils'
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
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'red',
    },
    steps: {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      type: Array as () => Step[],
      default: (): Step[] => [],
    },
    isDateDisplayed: {
      type: Boolean,
      default: true, // eslint-disable-line vue/no-boolean-default
    },
    isTimeDisplayed: {
      type: Boolean,
      default: true, // eslint-disable-line vue/no-boolean-default
    },
  },
  emits: ['addStep'],
  data: () => ({
    updatedTitle: '',
  }),
  computed: {
    ...mapState(useStore, ['projects', 'activeStepIndex', 'editMode']),
    processedSteps () {
      return processStepsDurations(this.steps)
    },
    edit () {
      return this.editMode && this.active
    },
    titleWidth () {
      const widths = { large: 23, small: 18, space: 14, none: 0 }
      let width = widths.none
      const chars = Array.from(this.updatedTitle)
      chars.forEach(char => {
        if (char === ' ') width += widths.space
        else if (/[A-Z]/u.test(char)) width += widths.large
        else width += widths.small
      })
      return `${width}px`
    },
  },
  watch: {
    title (value: string) {
      console.log('title changed', value)
      this.updatedTitle = value
    },
  },
  mounted () {
    this.updatedTitle = this.title
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers, promise/always-return, promise/prefer-await-to-then
    if (this.active) void sleep(100).then(() => { this.scrollToStep() })
  },
  methods: {
    ...mapActions(useStore, ['selectProject', 'deleteProject', 'toggleDateDisplay', 'toggleTimeDisplay', 'patchCurrentProjectTitle', 'scrollToStep']),
    colorFrom (shade: number) {
      return `from-${this.color}-${shade}`
    },
    colorTo (shade: number) {
      return `to-${this.color}-${shade}`
    },
    addStepHere () {
      console.log('add step here')
      this.selectProject(this.id)
      this.$emit('addStep')
    },
    updateTitle () {
      console.log('update title to', this.updatedTitle)
      this.patchCurrentProjectTitle(this.updatedTitle)
    },
  },
})
</script>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
.app-steps>.separator:last-child {
  @apply hidden;
}

.app-steps>.step:first-of-type {
  @apply pl-6;
}

.app-steps>.step:last-of-type {
  @apply pr-6;
}

/* eslint-disable-next-line vue-scoped-css/require-selector-used-inside */
.app-title.app-title-xl,
.v-input.app-title.app-title-xl .v-field__input {
  @apply text-4xl text-left mb-1 font-thin;
}

.app-active .app-title.app-title-xl,
.app-active .v-input.app-title.app-title-xl .v-field__input {
  @apply font-light;
}
</style>
