<template>
  <v-snackbar v-model="open" color="primary">{{ message }}</v-snackbar>
</template>

<script lang="ts">
import { Listener, off, on } from 'shuutils'
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    open: false,
    message: '',
    listener: false as boolean | Listener,
  }),
  mounted () {
    this.listener = on('toast', this.show)
  },
  beforeUnmount () {
    if (typeof this.listener === 'object') off(this.listener)
  },
  methods: {
    show (message: string) {
      this.open = true
      this.message = message
    },
  },
})
</script>
