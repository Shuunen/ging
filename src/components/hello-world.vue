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
  },
}
</script>
