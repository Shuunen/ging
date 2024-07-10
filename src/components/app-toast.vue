<template>
  <v-snackbar color="primary" v-model="isOpen">{{ message }}</v-snackbar>
</template>

<script setup lang="ts">
import { type Listener, off, on } from 'shuutils'
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
