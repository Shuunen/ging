<template>
  <div v-show="debugMode" class="flex flex-row gap-4 my-2">
    <div v-for="item in list" :key="'item' + item" class="item">
      <span class="opacity-50">{{ item }} ?</span> <code>{{ (this as any)[item] }}</code>
    </div>
  </div>
  <app-hotkey :keys="['ctrl', '!']" @hotkey="toggleDebugMode" />
</template>

<script lang="ts">
import { useStore } from '@/store'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'


export default defineComponent({
  data () {
    return {
      list: ['activeProjectIndex', 'activeStepIndex', 'editMode'],
    }
  },
  computed: {
    ...mapState(useStore, ['activeProjectIndex', 'activeStepIndex', 'editMode', 'debugMode']),
  },
  methods: {
    ...mapActions(useStore, ['toggleDebugMode']),
  },
})
</script>
