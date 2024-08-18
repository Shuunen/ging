<script setup lang="ts">
import { store } from '../store'
</script>

<template>
  <div class="mx-auto flex flex-col items-center justify-center pb-1" v-show="store.debugMode">
    <app-debug />
    <span class="mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
  </div>
  <app-toast />
</template>
