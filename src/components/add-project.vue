<template>
  <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">Add project</v-btn>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-container>
        <v-col class="min-w-[30vw]">
          <div class="text-h5 mb-12">New project</div>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="title" :rules="requiredRules" label="Title" required></v-text-field>
            <v-select v-model="color" :rules="requiredRules" :items="tailwindColors" label="Color" required></v-select>
          </v-form>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="plain" @click="dialog = false">Cancel</v-btn>
          <v-btn :disabled="!valid" variant="contained" color="primary" @click="submit()">Add</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { requiredRules } from '@/utils/form-rules'
import colors from 'tailwindcss/colors'
import { defineComponent } from 'vue'
import { mapMutations, mapState } from 'vuex'

export default defineComponent({
  data: () => ({
    dialog: false,
    valid: false,
    title: '',
    color: '',
    requiredRules,
  }),
  computed: {
    ...mapState(['projects']),
    tailwindColors () {
      return Object.keys(colors).filter(color => !['transparent', 'inherit', 'current'].includes(color))
    },
  },
  methods: {
    ...mapMutations(['addProject']),
    submit () {
      console.log('submit')
      const project = {
        id: this.projects.length + 1,
        title: this.title,
        color: this.color,
      }
      this.addProject(project)
      this.title = ''
      this.color = ''
      this.dialog = false
    },
  },
})
</script>
