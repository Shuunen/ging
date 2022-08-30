<template>
  <div class="flex flex-row flex-wrap items-center justify-center gap-4 mt-2 mb-3">
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
      user: this.$auth0.user,
      list: ['activeProjectIndex', 'activeStepIndex', 'userNickname'],
    }
  },
  computed: {
    ...mapState(useStore, ['activeProjectIndex', 'activeStepIndex', 'editMode', 'debugMode']),
    userNickname () {
      return this.user?.nickname
    },
  },
  methods: {
    ...mapActions(useStore, ['toggleDebugMode']),
  },
})
</script>
