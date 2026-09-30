<script setup>
import { actions, store } from '../store'

/**
 * @typedef {import('../store').StoreKey} StoreKey
 */

/** @type {StoreKey[]} */
const list = ['activeProjectIndex', 'activeStepIndex', 'gistToken', 'gistId', 'isLoading']

/**
 * @param {StoreKey} key the key to read
 * @returns {typeof store[StoreKey]} the value stored
 */
function read(key) {
  return store[key]
}
</script>

<template>
  <div class="mt-2 mb-3 flex flex-row flex-wrap items-center justify-center gap-4">
    <div :key="`item${item}`" class="app-item" v-for="item in list">
      <span class="mr-2 opacity-50">{{ item }} ?</span>
      <code class="italic" v-if="read(item) === ''">empty string</code>
      <code v-else-if="read(item) !== undefined" v-html="read(item)" />
      <code class="italic" v-else>undefined or null</code>
    </div>
  </div>
  <app-hotkey :keys="['ctrl', '!']" @hotkey="actions.toggleDebugMode" />
</template>
