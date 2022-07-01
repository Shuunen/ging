<template>
  <v-btn variant="outlined" color="secondary" :prepend-icon="editMode ? '' : 'mdi-circle-edit-outline'" @click="toggleEditMode">{{ editMode ? 'Read' : 'Edit' }}</v-btn>
  <app-hotkey :keys="['ctrl', 'e']" :excluded-elements="[]" @hotkey="toggleEditMode" />
  <app-hotkey :keys="['f2']" :excluded-elements="[]" @hotkey="toggleEditMode" />
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    ...mapState(useStore, ['editMode']),
  },
  methods: {
    ...mapActions(useStore, ['toggleEditMode']),
  },
})
</script>
