<template>
  <v-btn class="app-shortcut-trigger" color="info" icon size="small" variant="tonal">
    <v-icon>mdi-help-circle-outline</v-icon>
    <v-dialog v-model="isOpen" activator="parent" width="auto">
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
                <div v-for="(description, shortcut) in shortcuts" :key="shortcut" class="app-shortcut">
                  <code class="mr-2 bg-white px-2 text-lg text-black">{{ shortcut }}</code> {{ description }}
                </div>
              </div>
            </div>
            <code class="text-center">__unique-mark__</code>
          </v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="tonal" @click="isOpen = false">Ok</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
  <app-hotkey :keys="[',']" @hotkey="isOpen = !isOpen" />
  <app-hotkey :keys="['h']" @hotkey="isOpen = !isOpen" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import pkg from '../../package.json'
import IconGithub from './icon-github.vue'

export default defineComponent({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  components: { IconGithub },
  data: () => ({
    pkg,
    isOpen: false,
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

<style scoped>
.app-section {
  @apply flex-col items-start gap-3;
}

.app-section>.app-title {
  @apply text-2xl;
}
</style>
