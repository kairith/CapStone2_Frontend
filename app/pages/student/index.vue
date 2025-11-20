<template>
  <v-app>
    
    <Navbar v-model:drawer="drawer" />
    <v-main>
      <v-container>
        <!-- page content -->
       
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '~/components/ui/Navbar.vue'


const drawer = ref(true)
</script>

<style scoped>
.v-main { padding: 20px; }
</style>
