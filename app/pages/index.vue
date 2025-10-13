<template>
  <div class="pa-10 text-center">
    <v-btn color="primary" @click="count++">
      Clicked {{ count }} times
    </v-btn>
  </div>
</template>

<script setup>
const count = ref(0)
</script>
