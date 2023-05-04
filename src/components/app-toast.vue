<template>
  <v-snackbar v-model="isOpen" color="primary">{{ message }}</v-snackbar>
</template>

<script lang="ts">
import { off, on, type Listener } from 'shuutils'
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    isOpen: false,
    message: '',
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    listener: false as Listener | boolean,
  }),
  mounted () {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.listener = on('toast', this.show)
  },
  beforeUnmount () {
    if (typeof this.listener === 'object') off(this.listener)
  },
  methods: {
    show (message: string) {
      this.isOpen = true
      this.message = message
    },
  },
})
</script>
