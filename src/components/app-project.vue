<template>
  <v-container class="project">
    <div class="flex flex-row">
      <h2 class="text-h4 mb-4 mr-4">{{ title }}</h2>
      <delete-project :id="id" :title="title" />
    </div>
    <div
      class="steps rounded-xl bg-gradient-to-br flex flex-row items-center max-w-full p-2 overflow-hidden overflow-x-auto"
      :class="[`from-${color}-700`, `to-${color}-900`]"
    >
      <app-step v-for="(step, index) in steps" :key="'step-' + index" v-bind="step" />
    </div>
    <v-spacer class="h-4" />
    <add-step v-if="edit || steps.length === 0" :id="id" :at="steps.length" />
  </v-container>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { Step } from '@/types'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
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
    ...mapState(useStore, ['edit']),
  },
  methods: {
    ...mapActions(useStore, ['deleteProject']),
  },
})
</script>
