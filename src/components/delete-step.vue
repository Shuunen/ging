<template>
  <v-dialog v-model="open">
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
import { store, useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
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
  }),
  computed: {
    ...mapState(useStore, ['projects', 'activeStep']),
    title (): string {
      return this.activeStep?.title ?? ''
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
    store.$onAction(({ name }) => { if (name === 'openDeleteStepModal') this.open = true })
  },
  methods: {
    ...mapActions(useStore, ['deleteActiveStep']),
    deleteClose () {
      console.log('delete step and close modal')
      this.deleteActiveStep()
      this.close()
    },
    close () {
      this.open = false
    },
  },
})
</script>
