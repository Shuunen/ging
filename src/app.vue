<template>
  <div class="bg-gradient-to-tr from-indigo-300 flex flex-col items-center justify-center h-screen gap-4 p-12 overflow-auto">
    <div class="w-fit">
      <h1 class="font-mono text-4xl text-indigo-700 opacity-50">GING</h1>
      <main class="flex flex-col gap-6">
        <hello-world msg="Pierre" :nb="12" />
        <strong>Count is</strong>
        <span class="font-mono text-2xl text-indigo-700">{{ count }}</span>
        <app-button @click="increment()">Add project</app-button>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/hello-world.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
    HelloWorld,
  },
  computed: {
    ...mapState(['count']),
  },
  methods: {
    ...mapMutations(['increment']),
  },
}
</script>

