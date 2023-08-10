<template>
  <v-btn color="secondary" prepend-icon="mdi-plus" variant="tonal" @click="open = true">Add project</v-btn>
  <v-dialog v-model="open">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="mb-4 text-4xl">New project</div>
          <v-form ref="form">
            <!-- eslint-disable-next-line vuejs-accessibility/no-autofocus -->
            <v-text-field v-model="title" :autofocus="open" label="Title" required :rules="requiredRules"></v-text-field>
            <v-select v-model="color" :items="tailwindColors" label="Color" required :rules="requiredRules"></v-select>
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
import { requiredRules } from '@/utils/form.utils'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    open: false,
    title: '',
    color: '',
    requiredRules,
  }),
  computed: {
    tailwindColors () {
      return Object.keys(colors).filter(color => !['current', 'inherit', 'transparent'].includes(color) && !/[A-Z]/u.test(color)).sort()
    },
  },
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
