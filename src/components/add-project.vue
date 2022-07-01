<template>
  <v-btn variant="outlined" color="secondary" prepend-icon="mdi-plus" @click="open = true">Add project</v-btn>
  <v-dialog v-model="open">
    <v-card>
      <v-container>
        <v-col class="min-w-[20rem]">
          <div class="text-h5 mb-4">New project</div>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="title" :rules="requiredRules" autofocus label="Title" required></v-text-field>
            <v-select v-model="color" :rules="requiredRules" :items="tailwindColors" label="Color" required></v-select>
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="open = false">Cancel</v-btn>
          <v-btn :disabled="!valid" variant="contained" color="primary" @click="submit()">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <app-hotkey :keys="['alt', 'a']" @hotkey="open = true" />
</template>

<script lang="ts">
import { Project } from '@/models'
import { useStore } from '@/store'
import { requiredRules } from '@/utils/form'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    open: false,
    valid: false,
    title: '',
    color: '',
    requiredRules,
  }),
  computed: {
    tailwindColors () {
      return Object.keys(colors).filter(color => !['transparent', 'inherit', 'current'].includes(color)).sort()
    },
  },
  methods: {
    submit () {
      console.log('submit project')
      const store = useStore()
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
