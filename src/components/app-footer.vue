<script setup lang="ts">
import { store } from '@/store'
</script>

<template>
  <div v-show="store.debugMode" class="mx-auto flex flex-col items-center justify-center pb-1">
    <app-debug />
    <span class="mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
  </div>
  <app-toast />
</template>
