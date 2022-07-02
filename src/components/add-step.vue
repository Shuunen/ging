<template>
  <v-dialog v-model="open">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="text-h5 mb-4">New step</div>
          <v-form ref="form" v-model="valid" @submit="submit">
            <v-text-field v-model="title" :rules="requiredRules" label="Step title, time" :autofocus="open" required
                          hint="Like &ldquo;Get some milk, 1 hour&rdquo; or &ldquo;Go to Japan, 3 weeks&rdquo;" />
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="close">Cancel</v-btn>
          <v-btn :disabled="!valid" variant="contained" color="primary" @click="submit">Add</v-btn>
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
    valid: false,
    title: '',
    requiredRules,
  }),
  computed: {
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
      const step = new Step(stringToStepData(this.title))
      console.log('submit, adding step', step)
      store.addStep(step)
      this.title = ''
      this.close()
    },
  },
})
</script>
