<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Use Pinia store directly (you don't have useAuth composable)
const authStore = useAuthStore()

// Restore session on app start (only on client side)
onMounted(() => {
  if (process.client) {
    authStore.checkAuth()
  }
})
</script>

<style>
/* Optional: Global styles */
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>