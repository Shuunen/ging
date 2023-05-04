<template>
  <div class="mb-3 mt-2 flex flex-row flex-wrap items-center justify-center gap-4">
    <div v-for="item in list" :key="`item${item}`" class="app-item">
      <span class="mr-2 opacity-50">{{ item }} ?</span>
      <code v-if="read(item) === ''" class="italic">empty string</code> <!-- eslint-disable-line vue/no-v-html -->
      <code v-else-if="read(item) !== undefined" v-html="read(item)"></code> <!-- eslint-disable-line vue/no-v-html -->
      <code v-else class="italic">undefined or null</code>
    </div>
  </div>
  <app-hotkey :keys="['ctrl', '!']" @hotkey="toggleDebugMode" />
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      list: ['activeProjectIndex', 'activeStepIndex', 'gistToken', 'gistId', 'isLoading'],
    }
  },
  computed: {
    ...mapState(useStore, ['activeProjectIndex', 'activeStepIndex', 'editMode', 'debugMode', 'gistToken', 'gistId', 'isLoading']),
  },
  methods: {
    ...mapActions(useStore, ['toggleDebugMode']),
    read (key: string) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      return (this as any)[key]
    },
  },
})
</script>
