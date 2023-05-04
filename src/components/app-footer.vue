<template>
  <div v-show="debugMode" class="mx-auto flex flex-col items-center justify-center pb-1">
    <app-debug />
    <span class="mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
  </div>
  <app-toast />
</template>


<script lang="ts">
import { useStore } from '@/store'
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    ...mapState(useStore, ['debugMode']),
  },
})
</script>
