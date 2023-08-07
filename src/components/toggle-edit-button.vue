<template>
  <v-btn color="secondary" :prepend-icon="editMode ? '' : 'mdi-circle-edit-outline'" variant="tonal" @click="toggleEditMode">{{ editMode ? 'Read' : 'Edit' }}</v-btn>
  <app-hotkey :excluded-elements="[]" :keys="['ctrl', 'e']" @hotkey="toggleEditMode" />
  <app-hotkey :excluded-elements="[]" :keys="['f2']" @hotkey="toggleEditMode" />
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
