<template>
  <v-btn class="shortcut-trigger" variant="contained-text" size="small" icon color="info">
    <v-icon>mdi-help-circle-outline</v-icon>
    <v-dialog v-model="open" activator="parent">
      <v-card>
        <v-container>
          <v-col class="flex flex-col gap-4">
            <h2 class="text-h5">About</h2>
            <p>This is a simple Vue.js app that allows you to create and manage your own projects.</p>
            <h2 class="text-h5 sm:block hidden">Keyboard shortcuts</h2>
            <div class="sm:grid hidden grid-cols-2 gap-2">
              <div v-for="(description, shortcut) in shortcuts" :key="shortcut" class="shortcut">
                <code class="px-2 mr-2 text-lg text-black bg-white">{{ shortcut }}</code> {{ description }}
              </div>
            </div>
          </v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="open = false">Ok</v-btn>
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

export default defineComponent({
  data: () => ({
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
