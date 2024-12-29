<template>
  <v-container :class="[active ? 'app-active' : 'brightness-75 grayscale']" @click="actions.selectProject(id)"
    class="app-project flex flex-col items-start gap-4 transition duration-300 hover:grayscale-0">
    <div :class="{ 'gap-4': edit, active, edit }" class="app-project--header flex max-w-full cursor-pointer flex-row flex-wrap items-end">
      <v-text-field :autofocus="edit" :class="{ active, italic: edit, edit }" :id="`project-title-${id}`" :readonly="!edit"
        :style="{ width: titleWidth }" :tabindex="edit ? 1 : -1" :variant="edit ? 'outlined' : 'plain'" @change="updateTitle"
        class="app-no-details app-title app-title-xl max-w-full" density="compact" v-model="updatedTitle" />
      <v-btn @click="actions.toggleDateDisplay" color="secondary" prepend-icon="mdi-calendar-month" v-if="edit" variant="tonal">
        {{ isDateDisplayed ? 'Hide' : 'Show' }} dates
      </v-btn>
      <v-btn @click="actions.toggleTimeDisplay" color="secondary" prepend-icon="mdi-white-balance-sunny" v-if="edit" variant="tonal">
        {{ isTimeDisplayed ? 'Hide' : 'Show' }} hours
      </v-btn>
      <transition-slide :offset="['-100%', 0]" v-if="!edit">
        <v-icon class="pt-2 text-4xl" color="secondary" icon="mdi-chevron-triple-right" v-if="active" />
      </transition-slide>
    </div>
    <div :class="[colorToGradient(color), active ? 'shadow-2xl' : 'shadow']"
      class="app-steps flex w-full max-w-full cursor-pointer flex-col items-center overflow-hidden overflow-x-auto rounded-lg py-4 sm:w-auto sm:flex-row sm:rounded-xl"
      v-if="steps.length > 0">
      <app-step :key="`step-${index}`" v-for="(step, index) in processedSteps" v-bind="step" :active="active && (index === store.activeStepIndex)"
        :index :is-last="index === steps.length - 1" :project-active="active" :project-id="id" :show-date="isDateDisplayed"
        :show-time="isTimeDisplayed" />
    </div>
    <transition-fade>
      <v-btn @click="addStepHere" color="secondary" prepend-icon="mdi-plus" v-if="steps.length === 0" variant="outlined">
        Add step
      </v-btn>
    </transition-fade>
  </v-container>
</template>

<script>
import { nbSecondsInMinute, sleep } from 'shuutils'
import { defineComponent } from 'vue'
import { actions, store } from '../store'
import { colorToGradient } from '../utils/colors.utils'
import { logger } from '../utils/logger.utils'
import { processStepsDurations } from '../utils/step.utils'

/**
 * @typedef {import('../models/step.model').Step} Step
 */

export default defineComponent({
  computed: {
    edit () {
      return store.editMode && this.active
    },
    processedSteps () {
      return processStepsDurations(this.steps)
    },
    titleWidth () {
      // eslint-disable-next-line no-magic-numbers
      if (store.editMode && window.innerWidth < 500) return '100%'
      const widths = { base: 8, large: 21, none: 0, small: 17, space: 10 }
      let width = widths.base
      const chars = Array.from(this.updatedTitle)
      for (const char of chars)
        if (char === ' ') width += widths.space
        else if (/[A-Z]/u.test(char)) width += widths.large
        else width += widths.small

      return `${width}px`
    },
  },
  data: () => ({
    actions,
    colorToGradient,
    store,
    updatedTitle: '',
  }),
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
  mounted () {
    this.updatedTitle = this.title
    if (this.active) void sleep(nbSecondsInMinute).then(() => { actions.scrollToStep() })
  },
  props: {
    active: {
      type: Boolean,
    },
    color: {
      default: 'red',
      type: String,
    },
    id: {
      default: 0,
      type: Number,
    },
    isDateDisplayed: {
      default: true,
      type: Boolean,
    },
    isTimeDisplayed: {
      default: true,
      type: Boolean,
    },
    steps: {
      default: () => [],
      // eslint-disable-next-line jsdoc/valid-types
      /** @type import('vue').PropType<Step[]> */
      type: Array,
    },
    title: {
      default: '',
      type: String,
    },
  },
  watch: {
    title (value) {
      logger.debug('title changed', value)
      this.updatedTitle = value
    },
  },
})
</script>

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
