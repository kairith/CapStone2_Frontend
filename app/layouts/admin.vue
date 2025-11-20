<template>
  <v-app>
    <!-- Navbar (Sidebar) -->
    <Navbar ref="navbarRef" v-model="drawerOpen" role="admin" />

    <!-- Header -->
    <AppHeader @toggle-drawer="toggleDrawer" :drawer-open="drawerOpen" :is-mobile="isMobile" />

    <!-- Main Content Area -->
    <v-main class="main-content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import AppHeader from '~/components/ui/AppHeader.vue'
import Navbar from '~/components/ui/Navbar.vue'

// Composables
const { mdAndDown } = useDisplay()

// State
const drawerOpen = ref(true)
const navbarRef = ref(null)

// Computed
const isMobile = computed(() => mdAndDown.value)

// Methods
const toggleDrawer = () => {
  if (navbarRef.value) {
    navbarRef.value.toggleDrawer()
  }
}
</script>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  height: 100vh;
  overflow-y: auto;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
}

/* Left navbar */
.admin-navbar {
  flex-shrink: 0;
}

/* Right: header + content */
.admin-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

/* Top header */
.admin-header {
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Keep pages from jumping */
.admin-page-container {
  padding: 20px 24px;
  margin: 0;
  max-width: none;
}
</style>