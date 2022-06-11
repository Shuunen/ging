<template>
  <div class="step flex flex-col min-w-[10rem] max-w-xs gap-2 px-4 overflow-hidden text-center" @click="select">
    <h2 class="text-h5" :class="{ 'underline underline-offset-2': active }">{{ title }}</h2>
    <p class="date-start whitespace-nowrap opacity-60 text-white">
      {{ start.toLocaleDateString() }} <br />
      {{ start.toLocaleTimeString().replace(/:\d\d$/, '') }}
    </p>
  </div>
  <div class="separator sm:rotate-0 opacity-30 w-7 text-xl leading-none text-center text-white transition transform scale-y-75 rotate-90">\<br />/</div>
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
    hours: {
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
