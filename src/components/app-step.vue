<template>
  <div ref="step" class="step flex select-none flex-col min-w-[10rem] max-w-xs px-4 overflow-hidden text-center" :class="{ edit }"
       @click="selectCurrentStep" @dblclick="toggleEdit">
    <v-text-field v-model="newTitle" :readonly="!edit" density="compact" :variant="edit ? 'outlined' : 'plain'" class="no-details title mx-auto"
                  :class="{ active, italic: edit, edit }" :style="{ width: (newTitle.length * .95) + 'ch' }" @change="updateTitle" />
    <v-text-field v-model="newDuration" :readonly="!edit" density="compact" prepend-icon="mdi-clock-outline" :variant="edit ? 'outlined' : 'plain'"
                  class="no-details duration mx-auto my-2 select-none" :class="{ active, italic: edit, edit }" :style="{ width: newDuration.length + 5 + 'ch' }"
                  @change="updateDuration" />
    <p class="date-end whitespace-nowrap opacity-60 text-white">
      {{ end.toLocaleDateString() }} <br />
      {{ end.toLocaleTimeString().replace(/:\d\d$/, '') }}
    </p>
  </div>
  <div class="separator sm:rotate-0 opacity-30 w-7 text-xl leading-none text-center text-white transition transform scale-y-75 rotate-90 select-none">
    \<br />/
  </div>
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
    edit: false,
    newTitle: '',
    newDuration: '',
  }),
  computed: {
    ...mapState(useStore, ['activeProject', 'activeStep', 'activeStepIndex']),
  },
  watch: {
    title (value) {
      console.log('title changed', value)
      this.newTitle = value
    },
    duration (value) {
      console.log('duration changed', value)
      this.newDuration = value
    },
  },
  mounted () {
    this.newTitle = this.title
    this.newDuration = this.duration
  },
  methods: {
    ...mapActions(useStore, ['selectProject', 'selectStep', 'patchCurrentStepTitle', 'patchCurrentStepDuration']),
    dateIso10,
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
      this.edit = false
      this.patchCurrentStepTitle(target.value)
    },
    updateDuration (event: Event) {
      const target = event.target as HTMLInputElement
      if (!target) return console.error('no duration target')
      console.log('update step duration with', target.value)
      this.selectCurrentStep()
      this.edit = false
      this.patchCurrentStepDuration(target.value)
    },
    toggleEdit () {
      console.log('toggle edit', this.$el)
      this.edit = !this.edit
    },
  },
})
</script>

<style>
.step.edit {
  @apply sepia;
}

.v-input.no-details .v-input__prepend {
  @apply m-0 pt-0.5 pr-2;
}

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

.title.active:not(.edit),
.v-input.title.active:not(.edit) .v-field__input input {
  @apply underline underline-offset-2;
}
</style>
