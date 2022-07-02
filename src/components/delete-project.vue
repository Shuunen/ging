<template>
  <v-dialog v-model="open">
    <v-card>
      <v-card-text>
        <p class="mb-4">You are about to delete the project "{{ title }}", are you sure ?</p>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="primary" variant="contained" @click="deleteClose">Confirm delete</v-btn>
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
    ...mapState(useStore, ['projects', 'activeProjectIndex']),
    title () {
      return this.projects[this.activeProjectIndex].title
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
    store.$onAction(({ name }) => { if (name === 'openDeleteProjectModal') this.open = true })
  },
  methods: {
    ...mapActions(useStore, ['deleteActiveProject']),
    deleteClose () {
      console.log('delete project and close modal')
      this.deleteActiveProject()
      this.close()
    },
    close () {
      this.open = false
    },
  },
})
</script>
