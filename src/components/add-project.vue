<template>
  <v-btn variant="tonal" color="secondary" prepend-icon="mdi-plus" @click="open = true">Add project</v-btn>
  <v-dialog v-model="open">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="mb-4 text-4xl">New project</div>
          <v-form ref="form">
            <!-- eslint-disable-next-line vuejs-accessibility/no-autofocus -->
            <v-text-field v-model="title" :rules="requiredRules" :autofocus="open" label="Title" required></v-text-field>
            <v-select v-model="color" :rules="requiredRules" :items="tailwindColors" label="Color" required></v-select>
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="open = false">Cancel</v-btn>
          <v-btn :disabled="title.length === 0 || color.length === 0" variant="elevated" color="primary" @click="submit">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <app-hotkey :keys="['alt', 'a']" @hotkey="open = true" />
</template>

<script lang="ts">
import { Project } from '@/models'
import { store } from '@/store'
import { requiredRules } from '@/utils/form'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    open: false,
    title: '',
    color: '',
    requiredRules,
  }),
  computed: {
    tailwindColors () {
      // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
      return Object.keys(colors).filter(color => !['transparent', 'inherit', 'current'].includes(color) && !/[A-Z]/u.test(color)).sort()
    },
  },
  mounted () {
    store.isLoading = false
    store.$onAction(({ name }) => { if (name === 'openAddProjectModal') this.open = true })
  },
  methods: {
    submit () {
      console.log('submit project')
      store.addProject(new Project({
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
