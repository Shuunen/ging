<template>
  <div class="step flex flex-col gap-2 px-4 text-center" @click="select">
    <h2 class="text-h5" :class="{ 'underline underline-offset-2': active }">{{ title }}</h2>
    <em class="date-start whitespace-nowrap text-ellipsis opacity-30 text-xs text-white">
      {{ days ? dateIso10(new Date(start)) : new Date(start).toLocaleTimeString().replace(/:\d\d$/, '') }}
    </em>
  </div>
  <div class="separator opacity-30 sm:w-1 sm:h-1/2 w-1/3 h-1 my-3 bg-white rounded"></div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
import { dateIso10 } from 'shuutils'
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
    projectId: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    days: {
      type: Number,
      default: undefined,
    },
    start: {
      type: String,
      default: new Date(),
    },
  },
  computed: {
    ...mapState(useStore, ['activeProject', 'activeStep', 'activeStepIndex']),
  },
  methods: {
    ...mapActions(useStore, ['selectProject', 'selectStep']),
    dateIso10,
    select (event: Event) {
      event.stopPropagation()
      if (!this.activeProject || (this.activeProject.id !== this.projectId)) this.selectProject(this.projectId)
      if (!this.activeStep || (this.activeStep.id !== this.id)) this.selectStep(this.id)
    },
  },
})
</script>
