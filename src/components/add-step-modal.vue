<template>
  <v-snackbar v-if="store.projects.length === 0" v-model="isOpen" color="primary">You first need to create a project to add a step to it.</v-snackbar>
  <v-dialog v-else v-model="isOpen">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="mb-4 text-3xl">New step</div>
          <v-form ref="form" @submit="submit">
            <!-- eslint-disable vuejs-accessibility/no-autofocus -->
            <v-text-field v-model="title" :autofocus="isOpen" hint="Like &ldquo;Get some milk, 1 hour&rdquo; or &ldquo;Go to Japan, 3 weeks&rdquo;"
              label="Step title, time" required :rules="requiredRules" />
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="close">Cancel</v-btn>
          <v-btn color="primary" :disabled="title.length === 0" variant="elevated" @click="submit">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Step } from '@/models/step.model'
import { actions, store } from '@/store'
import { requiredRules } from '@/utils/form.utils'
import { stringToStepData } from '@/utils/step.utils'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
    },
  },
  emits: ['close'],
  data: () => ({
    isOpen: false,
    title: '',
    store,
    requiredRules,
  }),
  computed: {
    tailwindColors () {
      return Object.keys(colors).filter(color => !['current', 'inherit', 'transparent'].includes(color))
    },
  },
  watch: {
    active (isOpen: boolean) {
      this.isOpen = isOpen
    },
    open (value) {
      if (value === false) this.$emit('close')
    },
  },
  mounted () {
    // add me back store.$onAction(({ name }) => { if (name === 'openAddStepModal') this.isOpen = true })
  },
  methods: {
    close () {
      this.isOpen = false
    },
    submit (event: Event) {
      event.preventDefault()
      const str = /\d/u.test(this.title) ? this.title : `${this.title} 1 hour`
      const step = new Step(stringToStepData(str))
      console.log('submit, adding step', step)
      actions.addStep(step)
      this.title = ''
      this.close()
    },
  },
})
</script>
