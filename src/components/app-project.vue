<template>
  <v-container class="project flex flex-col items-start gap-4">
    <div class="flex flex-row">
      <h2 class="text-h4 mr-4" :class="{ 'underline underline-offset-2': active }">{{ title }}</h2>
    </div>
    <div class="steps rounded-xl bg-gradient-to-br flex flex-row items-center max-w-full p-2 overflow-hidden overflow-x-auto"
         :class="[`from-${color}-700`, `to-${color}-900`]">
      <app-step v-for="(step, index) in steps" :key="'step-' + index" v-bind="step" :active="active && (index === activeStepIndex)" />
    </div>
    <v-btn v-if="steps.length === 0" variant="outlined" color="secondary" prepend-icon="mdi-plus" @click="addStepHere">Add step</v-btn>
  </v-container>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { Step } from '@/types'
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
  data: () => ({
    confirmDelete: false,
  }),
  computed: {
    ...mapState(useStore, ['activeProjectIndex','activeStepIndex']),
  },
  methods: {
    ...mapActions(useStore, ['deleteProject']),
    addStepHere (){
      console.log('add step here')
    },
  },
})
</script>
