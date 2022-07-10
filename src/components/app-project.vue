<template>
  <v-container class="project hover:grayscale-0 flex flex-col items-start gap-4 transition duration-300"
               :class="[active ? '' : 'brightness-75 grayscale']" @click="selectProject(id)">
    <div class="flex flex-row items-center cursor-pointer">
      <v-text-field :id="'project-title-' + id" v-model="newTitle" :tabindex="edit ? 1 : -1" :autofocus="edit" :readonly="!edit" density="compact"
                    :variant="edit ? 'outlined' : 'plain'" class="no-details title title-xl" :class="{ active, italic: edit, edit }"
                    :style="{ width: (newTitle.length * .90) + 'ch' }" @change="updateTitle" />
      <v-scroll-x-transition>
        <v-icon v-if="active" class="text-h4" color="secondary" icon="mdi-chevron-triple-right" />
      </v-scroll-x-transition>
    </div>
    <div v-if="steps.length > 0"
         class="steps sm:rounded-xl bg-gradient-to-br sm:flex-row sm:w-auto flex flex-col items-center w-full max-w-full px-3 py-4 overflow-hidden overflow-x-auto rounded-lg cursor-pointer"
         :class="[`from-${color}-700`, `to-${color}-900`, active ? 'shadow-2xl' : 'shadow']">
      <app-step v-for="(step, index) in processedSteps" :key="'step-' + index" v-bind="step" :index="index"
                :active="active && (index === activeStepIndex)" :project-active="active" :project-id="id" />
    </div>
    <v-btn v-if="steps.length === 0" variant="outlined" color="secondary" prepend-icon="mdi-plus" @click="addStepHere">
      Add step
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Step } from '@/models'
import { useStore } from '@/store'
import { processStepsDurations } from '@/utils/step'
import { mapActions, mapState } from 'pinia'
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
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'red',
    },
    steps: {
      type: Array as () => Array<Step>,
      default: (): Step[] => [],
    },
  },
  emits: ['addStep'],
  data: () => ({
    confirmDelete: false,
    newTitle: '',
  }),
  computed: {
    ...mapState(useStore, ['projects', 'activeProjectIndex', 'activeStepIndex', 'editMode']),
    processedSteps () {
      return processStepsDurations(this.steps)
    },
    edit () {
      return this.editMode && this.active
    },
  },
  watch: {
    title (value) {
      console.log('title changed', value)
      this.newTitle = value
    },
  },
  mounted () {
    this.newTitle = this.title
  },
  methods: {
    ...mapActions(useStore, ['selectProject', 'deleteProject', 'patchCurrentProjectTitle']),
    addStepHere () {
      console.log('add step here')
      this.selectProject(this.id)
      this.$emit('addStep')
    },
    updateTitle () {
      console.log('update title to', this.newTitle)
      this.patchCurrentProjectTitle(this.newTitle)
    },
  },
})
</script>

<style>
.steps>.separator:last-child {
  @apply hidden;
}

.title.title-xl,
.v-input.title.title-xl .v-field__input input {
  @apply text-4xl text-left mb-1 font-light;
}
</style>
