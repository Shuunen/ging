<template>
  <div v-show="debugMode" class="flex flex-col items-center justify-center pb-1 mx-auto">
    <app-debug />
    <span class="text-body-1 mx-auto">GING &copy; {{ new Date().getFullYear() }}</span>
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
