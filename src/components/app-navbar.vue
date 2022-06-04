<template>
  <v-app-bar app>
    <v-container>
      <v-row class="gap-4 pt-2">
        <h1 class="text-h4">GING</h1>
        <v-spacer />
        <add-project v-if="edit" />
        <v-btn v-if="edit" append-icon="mdi-exit-to-app" variant="outlined" color="secondary" @click="toggleEdit()">Stop edit</v-btn>
        <v-btn v-else append-icon="mdi-pencil" variant="outlined" color="white" @click="toggleEdit()">Enter edit</v-btn>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useStore } from '../store'

export default defineComponent({
  computed: {
    ...mapState(useStore, ['edit']),
  },
  methods: {
    ...mapActions(useStore, ['toggleEdit']),
  },
})
</script>
