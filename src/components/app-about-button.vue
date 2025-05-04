<script lang="ts" setup>
import { ref } from 'vue'
import IconGithub from './icon-github.vue'

const isOpen = ref(false)
// eslint-disable-next-line no-useless-assignment
const shortcuts = {
  'Alt + A': 'Add a project',
  'Alt + D': 'Delete a project',
  'Ctrl + !': 'Toggle debug mode',
  'Ctrl + ->': 'Move step after',
  'Ctrl + <-': 'Move step before',
  'Ctrl + A': 'Add a step',
  'Ctrl + D': 'Delete a step',
  'Ctrl + E': 'Toggle edit mode',
}

function toggleOpen () {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <v-btn class="app-shortcut-trigger" color="info" icon size="small" variant="tonal">
    <v-icon>mdi-help-circle-outline</v-icon>
    <v-dialog activator="parent" v-model="isOpen" width="auto">
      <v-card>
        <v-container>
          <v-col class="flex flex-col gap-8">
            <h1 class="text-center text-4xl font-thin">GING Is Not Gantt</h1>
            <div class="app-section flex">
              <h2 class="app-title">About</h2>
              <p>This is a simple Vue.js app that allows you to create and manage your own projects.</p>
              <p>This project is open source and licensed under GPL-3.0.</p>
              <div class="flex flex-row gap-2">
                <icon-github class="inline w-6 text-orange-300" />
                <a class="underline" href="https://github.com/Shuunen/ging">Project & sources on Github</a>
              </div>
            </div>
            <div class="app-section hidden md:flex">
              <h2 class="app-title">Keyboard shortcuts</h2>
              <div class="grid grid-cols-2 gap-2">
                <div :key="shortcut" class="app-shortcut" v-for="(description, shortcut) in shortcuts">
                  <code class="mr-2 bg-white px-2 text-lg text-black">{{ shortcut }}</code> {{ description }}
                </div>
              </div>
            </div>
            <code class="text-center">__unique-mark__</code>
          </v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="toggleOpen" variant="tonal">Ok</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
  <app-hotkey :keys="[',']" @hotkey="toggleOpen" />
  <app-hotkey :keys="['h']" @hotkey="toggleOpen" />
</template>

<style scoped>
@reference "tailwindcss";

.app-section {
  @apply flex-col items-start gap-3;
}

.app-section>.app-title {
  @apply text-2xl;
}
</style>
