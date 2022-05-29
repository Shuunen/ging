<template>
  <v-btn v-if="edit" variant="contained-text" size="small" icon color="info">
    <v-icon>mdi-delete</v-icon>
    <v-dialog v-model="confirmDelete" activator="parent">
      <v-card>
        <v-card-text>
          <p class="mb-4">You are about to delete the project "{{ title }}", are you sure ?</p>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="confirmDelete = false">Cancel</v-btn>
            <v-btn color="primary" variant="contained" @click="deleteProject(id); confirmDelete = false">Confirm delete</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    confirmDelete: false,
  }),
  computed: {
    ...mapState(useStore, ['edit']),
  },
  methods: {
    ...mapActions(useStore, ['deleteProject']),
  },
})
</script>
