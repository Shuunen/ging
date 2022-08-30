<template>
  <v-snackbar v-if="projects.length === 0" v-model="open" color="primary">You first need to create a project to add a step to it.</v-snackbar>
  <v-dialog v-else v-model="open">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="text-h5 mb-4">New step</div>
          <v-form ref="form" @submit="submit">
            <v-text-field
              v-model="title"
              :rules="requiredRules"
              label="Step title, time"
              :autofocus="open"
              required
              hint="Like &ldquo;Get some milk, 1 hour&rdquo; or &ldquo;Go to Japan, 3 weeks&rdquo;"
            />
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="close">Cancel</v-btn>
          <v-btn :disabled="title.length === 0" variant="elevated" color="primary" @click="submit">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Step } from '@/models'
import { store, useStore } from '@/store'
import { requiredRules } from '@/utils/form'
import { stringToStepData } from '@/utils/step'
import { mapState } from 'pinia'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data: () => ({
    open: false,
    title: '',
    requiredRules,
  }),
  computed: {
    ...mapState(useStore, ['projects']),
    tailwindColors () {
      return Object.keys(colors).filter(color => !['transparent', 'inherit', 'current'].includes(color))
    },
  },
  watch: {
    active (value) {
      this.open = value
    },
    open (value) {
      if (value === false) this.$emit('close')
    },
  },
  mounted () {
    store.$onAction(({ name }) => { if (name === 'openAddStepModal') this.open = true })
  },
  methods: {
    close () {
      this.open = false
    },
    submit (event: Event) {
      event.preventDefault()
      const store = useStore()
      const str = /\d/.test(this.title) ? this.title : `${this.title} 1 hour`
      const step = new Step(stringToStepData(str))
      console.log('submit, adding step', step)
      store.addStep(step)
      this.title = ''
      this.close()
    },
  },
})
</script>
