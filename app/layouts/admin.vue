<template>
  <v-app>
    <!-- Use the Navbar component -->
    <Navbar />

    <!-- Main Content Area -->
    <v-main class="main-content">
      <slot />
    </v-main>

    <!-- Footer component -->
    <Footer />
  </v-app>
</template>

<script setup>
// No need for local state, Navbar handles its own drawer state
</script>

<style scoped>
.main-content {
  background-color: #f5f5f5;
}
</style>