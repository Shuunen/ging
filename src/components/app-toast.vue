<template>
  <v-snackbar v-model="isOpen" color="primary">{{ message }}</v-snackbar>
</template>

<script setup lang="ts">
import { off, on, type Listener } from 'shuutils'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isOpen = ref(false)
const message = ref('')
let listener: Listener | boolean = false

function show (messageToShow: string) {
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
