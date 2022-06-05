<template>
  <div class="step flex flex-col gap-2 px-4 text-center">
    <h2 class="text-h5" :class="{ 'underline underline-offset-2': active }">{{ title }}</h2>
    <em class="date-start whitespace-nowrap text-ellipsis opacity-30 text-xs text-white">
      {{ days ? dateIso10(new Date(start)) : new Date(start).toLocaleTimeString().replace(/:\d\d$/, '') }}
    </em>
  </div>
</template>

<script lang="ts">
import { dateIso10 } from 'shuutils'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    days: {
      type: Number,
      default: undefined,
    },
    start: {
      type: String,
      default: new Date(),
    },
  },
  methods: {
    dateIso10,
  },
})
</script>
