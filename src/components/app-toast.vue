<template>
  <v-snackbar color="primary" v-model="isOpen">{{ message }}</v-snackbar>
</template>

<script setup>
import { off, on } from 'shuutils'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isOpen = ref(false)
const message = ref('')
/** @type {import('shuutils').Listener | boolean} */
let listener = false

/**
 * @param {string} messageToShow The message to show
 */
function show (messageToShow) {
  isOpen.value = true
  message.value = messageToShow
}

onMounted(() => {
  listener = on('toast', show)
})

onBeforeUnmount(() => {
  if (typeof listener === 'object') off(listener)
})
</script>
