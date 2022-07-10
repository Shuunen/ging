<template>
  <v-btn class="shortcut-trigger" variant="tonal" size="small" icon color="info">
    <v-icon>mdi-help-circle-outline</v-icon>
    <v-dialog v-model="open" activator="parent">
      <v-card>
        <v-container>
          <v-col class="flex flex-col gap-8">
            <h1 class="text-4xl font-thin text-center">GING Is Not Gantt</h1>
            <div class="section">
              <h2 class="title">About</h2>
              <p>This is a simple Vue.js app that allows you to create and manage your own projects.</p>
              <p>This project is open source and licenced under GPL-3.0.</p>
              <div class="flex flex-row gap-2">
                <icon-github class="inline w-6 text-orange-300" />
                <a class="underline" href="https://github.com/Shuunen/ging">Project & sources on Github</a>
              </div>
            </div>
            <div class="section sm:flex hidden">
              <h2 class="title">Keyboard shortcuts</h2>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(description, shortcut) in shortcuts" :key="shortcut" class="shortcut">
                  <code class="px-2 mr-2 text-lg text-black bg-white">{{ shortcut }}</code> {{ description }}
                </div>
              </div>
            </div>
            <code class="text-center">Version {{ pkg.version }}</code>
          </v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="tonal" @click="open = false">Ok</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
  <app-hotkey :keys="[',']" @hotkey="open = !open" />
  <app-hotkey :keys="['h']" @hotkey="open = !open" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import pkg from '../../package.json'
import IconGithub from './icon-github.vue'

export default defineComponent({
  components: { IconGithub },
  data: () => ({
    pkg,
    open: false,
    shortcuts: {
      'Alt + A': 'Add a project',
      'Alt + D': 'Delete a project',
      'Ctrl + A': 'Add a step',
      'Ctrl + D': 'Delete a step',
      'Ctrl + ->': 'Move step after',
      'Ctrl + <-': 'Move step before',
      'Ctrl + E': 'Toggle Edit mode',
      'Ctrl + !': 'Toggle Edit mode',
    },
  }),
})
</script>

<style>
.section {
  @apply flex flex-col items-start gap-3;
}

.section>.title {
  @apply text-2xl;
}
</style>
