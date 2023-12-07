<script setup lang="ts">
import { actions, store, type StoreKey } from '../store'

const list: StoreKey[] = ['activeProjectIndex', 'activeStepIndex', 'gistToken', 'gistId', 'isLoading']

function read (key: StoreKey) {
  return store[key]
}
</script>

<template>
  <div class="mb-3 mt-2 flex flex-row flex-wrap items-center justify-center gap-4">
    <div v-for="item in list" :key="`item${item}`" class="app-item">
      <span class="mr-2 opacity-50">{{ item }} ?</span>
      <code v-if="read(item) === ''" class="italic">empty string</code>
      <code v-else-if="read(item) !== undefined" v-html="read(item)"></code><!-- eslint-disable-line vue/no-v-html, sonar/no-vue-bypass-sanitization -->
      <code v-else class="italic">undefined or null</code>
    </div>
  </div>
  <app-hotkey :keys="['ctrl', '!']" @hotkey="actions.toggleDebugMode" />
</template>
