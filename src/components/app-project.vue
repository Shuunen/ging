<template>
  <v-container class="project flex flex-col items-start gap-4" @click="selectProject(id)">
    <div class="flex flex-row">
      <h2 class="text-h4 mr-4" :class="{ 'underline underline-offset-2': active }">{{ title }}</h2>
    </div>
    <div v-if="steps.length > 0"
         class="steps sm:rounded-xl bg-gradient-to-br sm:flex-row sm:w-auto flex flex-col items-center w-full max-w-full px-2 py-4 overflow-hidden overflow-x-auto rounded-lg"
         :class="[`from-${color}-700`, `to-${color}-900`]">
      <app-step v-for="(step, index) in processedSteps" :key="'step-' + index" v-bind="step" :active="active && (index === activeStepIndex)"
                :project-id="id" />
    </div>
    <div v-if="active || steps.length === 0" :class="[active && (steps.length > 0) ? 'sm:hidden' : '']">
      <v-btn variant="outlined" color="secondary" prepend-icon="mdi-plus" @click="addStepHere">
        Add step
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { Step } from '@/types'
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
  }),
  computed: {
    ...mapState(useStore, ['projects', 'activeProjectIndex', 'activeStepIndex']),
    processedSteps (){
      return processStepsDurations(this.steps)
    },
  },
  methods: {
    ...mapActions(useStore, ['selectProject', 'deleteProject']),
    addStepHere () {
      console.log('add step here')
      this.selectProject(this.id)
      this.$emit('addStep')
    },
  },
})
</script>

<style>
.steps>.separator:last-child {
  @apply hidden;
}
</style>
