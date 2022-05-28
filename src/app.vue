<template>
  <div class="bg-gradient-to-tr from-indigo-300 flex flex-col h-screen gap-4 p-12 overflow-auto">
    <h1 class="font-mono text-2xl text-indigo-700 opacity-50">GING</h1>
    <main class="flex flex-col gap-6">
      <hello-world msg="Pierre" />
      <strong>Count is</strong>
      <span class="font-mono text-2xl text-indigo-700">{{ count }}</span>
      <button class="bg-indigo-300 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded" @click="increment()">Increment</button>
    </main>
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

