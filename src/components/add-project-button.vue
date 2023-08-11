<template>
  <v-btn color="secondary" prepend-icon="mdi-plus" variant="tonal" @click="open = true">Add project</v-btn>
  <v-dialog v-model="open" width="auto">
    <v-card>
      <v-container class="from-40%" :class="[colorToGradient('slate', 900, color, 900)]">
        <v-col class="min-w-[20rem]">
          <div class="mb-4 text-4xl">New project</div>
          <v-form ref="form">
            <!-- eslint-disable-next-line vuejs-accessibility/no-autofocus -->
            <v-text-field v-model="title" :autofocus="open" label="Title" required :rules="requiredRules"></v-text-field>
            <div class="app-colors mb-2 mt-4 grid grid-cols-4 gap-2 md:grid-cols-8">
              <div v-for="tailwindColor in tailwindColors" :key="tailwindColor"
                class="app-color h-10 w-16 cursor-pointer rounded-md border-2 transition-all hover:scale-125"
                :class="[colorToGradient(tailwindColor), tailwindColor === color ? 'border-indigo-400' : 'border-slate-800']"
                @click="color = tailwindColor">
              </div>
            </div>
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="open = false">Cancel</v-btn>
          <v-btn color="primary" :disabled="title.length === 0 || color.length === 0" variant="elevated" @click="submit">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <app-hotkey :keys="['alt', 'a']" @hotkey="open = true" />
</template>

<script lang="ts">
import { Project } from '@/models/project.model'
import { actions, store } from '@/store'
import { colorToGradient } from '@/utils/colors.utils'
import { requiredRules } from '@/utils/form.utils'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

const tailwindColors = Object.keys(colors).filter(color => !['amber', 'black', 'current', 'gray', 'inherit', 'neutral', 'rose', 'slate', 'stone', 'transparent', 'white'].includes(color) && !/[A-Z]/u.test(color))

export default defineComponent({
  data: () => ({
    open: false,
    title: '',
    color: tailwindColors[0] ?? '',
    tailwindColors,
    requiredRules,
    colorToGradient,
  }),
  mounted () {
    store.isLoading = false
    // add me back store.$onAction(({ name }) => { if (name === 'openAddProjectModal') this.open = true })
  },
  methods: {
    submit () {
      console.log('submit project')
      actions.addProject(new Project({
        title: this.title,
        color: this.color,
      }))
      this.title = ''
      this.color = ''
      this.open = false
    },
  },
})
</script>
