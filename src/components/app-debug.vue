<template>
  <div class="flex flex-row flex-wrap items-center justify-center gap-4 mt-2 mb-3">
    <div v-for="item in list" :key="'item' + item" class="item">
      <span class="mr-2 opacity-50">{{ item }} ?</span>
      <code v-if="(this as any)[item] === ''" class="italic">empty string</code> <!-- eslint-disable-line vue/no-v-html -->
      <code v-else-if="(this as any)[item] !== undefined" v-html="(this as any)[item]"></code> <!-- eslint-disable-line vue/no-v-html -->
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
      list: ['activeProjectIndex', 'activeStepIndex', 'gistToken', 'gistId'],
    }
  },
  computed: {
    ...mapState(useStore, ['activeProjectIndex', 'activeStepIndex', 'editMode', 'debugMode', 'gistToken', 'gistId']),
  },
  methods: {
    ...mapActions(useStore, ['toggleDebugMode']),
  },
})
</script>
