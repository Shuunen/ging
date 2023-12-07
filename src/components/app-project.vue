<template>
  <v-container class="app-project flex flex-col items-start gap-4 transition duration-300 hover:grayscale-0"
    :class="[active ? 'app-active' : 'brightness-75 grayscale']" @click="actions.selectProject(id)">
    <div class="app-project--header flex max-w-full cursor-pointer flex-row flex-wrap items-end" :class="{ 'gap-4': edit, active, edit }">
      <v-text-field :id="`project-title-${id}`" v-model="updatedTitle" :autofocus="edit" class="app-no-details app-title app-title-xl max-w-full"
        :class="{ active, italic: edit, edit }" density="compact" :readonly="!edit" :style="{ width: titleWidth }" :tabindex="edit ? 1 : -1"
        :variant="edit ? 'outlined' : 'plain'" @change="updateTitle" />
      <v-btn v-if="edit" color="secondary" prepend-icon="mdi-calendar-month" variant="tonal" @click="actions.toggleDateDisplay">
        {{ isDateDisplayed ? 'Hide' : 'Show' }} dates
      </v-btn>
      <v-btn v-if="edit" color="secondary" prepend-icon="mdi-white-balance-sunny" variant="tonal" @click="actions.toggleTimeDisplay">
        {{ isTimeDisplayed ? 'Hide' : 'Show' }} hours
      </v-btn>
      <transition-slide v-if="!edit" :offset="['-100%', 0]">
        <v-icon v-if="active" class="pt-2 text-4xl" color="secondary" icon="mdi-chevron-triple-right" />
      </transition-slide>
    </div>
    <div v-if="steps.length > 0"
      class="app-steps flex w-full max-w-full cursor-pointer flex-col items-center overflow-hidden overflow-x-auto rounded-lg py-4 sm:w-auto sm:flex-row sm:rounded-xl"
      :class="[colorToGradient(color), active ? 'shadow-2xl' : 'shadow']">
      <app-step v-for="(step, index) in processedSteps" :key="`step-${index}`" v-bind="step" :active="active && (index === store.activeStepIndex)"
        :index="index" :is-last="index === steps.length - 1" :project-active="active" :project-id="id" :show-date="isDateDisplayed"
        :show-time="isTimeDisplayed" />
    </div>
    <transition-fade>
      <v-btn v-if="steps.length === 0" color="secondary" prepend-icon="mdi-plus" variant="outlined" @click="addStepHere">
        Add step
      </v-btn>
    </transition-fade>
  </v-container>
</template>

<script lang="ts">
import { sleep } from 'shuutils'
import { defineComponent } from 'vue'
import type { Step } from '../models/step.model'
import { actions, store } from '../store'
import { colorToGradient } from '../utils/colors.utils'
import { logger } from '../utils/logger.utils'
import { processStepsDurations } from '../utils/step.utils'

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
  data: () => ({
    updatedTitle: '',
    store,
    colorToGradient,
    actions,
  }),
  computed: {
    processedSteps () {
      return processStepsDurations(this.steps)
    },
    edit () {
      return store.editMode && this.active
    },
    titleWidth () {
      if (store.editMode && window.innerWidth < 500) return '100%' // eslint-disable-line @typescript-eslint/no-magic-numbers
      const widths = { large: 21, small: 17, space: 10, none: 0, base: 8 }
      let width = widths.base
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
      logger.debug('title changed', value)
      this.updatedTitle = value
    },
  },
  mounted () {
    this.updatedTitle = this.title
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers, promise/always-return, promise/prefer-await-to-then
    if (this.active) void sleep(100).then(() => { actions.scrollToStep() })
  },
  methods: {
    addStepHere () {
      logger.debug('add step here')
      actions.selectProject(this.id)
      actions.openAddStepModal()
    },
    updateTitle () {
      logger.debug('update title to', this.updatedTitle)
      actions.patchCurrentProjectTitle(this.updatedTitle)
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
  @apply text-4xl text-left mr-1 font-thin;
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
