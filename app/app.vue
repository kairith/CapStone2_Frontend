<template>
  <v-app>
    <NuxtPage />
  </v-app>
</template>

<script setup>
// Initialize authentication check on app start
const { checkAuth } = useAuth()

onMounted(async () => {
  // Check authentication status when app loads
  await checkAuth()
})
</script>
