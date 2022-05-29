<template>
  <div class="hello">
    <h1>Bonjour {{ msg }} !</h1>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    msg: {
      type: String,
      default: '',
    },
    nb: {
      type: Number,
      default: 0,
      required: true,
    },
  },
}
</script>
