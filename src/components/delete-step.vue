<template>
  <v-dialog v-model="open">
    <v-card>
      <v-card-text>
        <p class="mb-4">You are about to delete the step "{{ title }}", are you sure ?</p>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close()">Cancel</v-btn>
          <v-btn color="primary" variant="contained" @click="deleteActiveStep(); close()">Confirm delete</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useStore } from '@/store'
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
    ...mapState(useStore, ['projects', 'activeProjectIndex', 'activeStepIndex']),
    title () {
      return this.projects[this.activeProjectIndex].steps[this.activeStepIndex].title
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
  methods: {
    ...mapActions(useStore, ['deleteActiveStep']),
    close () {
      this.open = false
    },
  },
})
</script>
