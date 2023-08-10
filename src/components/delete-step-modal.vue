<template>
  <v-dialog v-model="isOpen">
    <v-card>
      <v-card-text>
        <p class="mb-4">You are about to delete the step "{{ title }}", are you sure ?</p>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="deleteClose">Confirm delete</v-btn>
          <app-hotkey :keys="['enter']" @hotkey="deleteClose" />
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { actions, activeStep } from '@/store'
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
  }),
  computed: {
    title (): string {
      return activeStep.value?.title ?? ''
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
    // add me back store.$onAction(({ name }) => { if (name === 'openDeleteStepModal') this.isOpen = true })
  },
  methods: {
    deleteClose () {
      console.log('delete step and close modal')
      actions.deleteActiveStep()
      this.close()
    },
    close () {
      this.isOpen = false
    },
  },
})
</script>
