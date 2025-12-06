<template>
  <v-app>
    <div class="layout-container">
      <!-- Left: Sidebar Navbar -->
      <Navbar class="layout-navbar" />

      <!-- Right: Top header + page content -->
      <div class="layout-content">
        <AppHeader class="layout-header" />

        <v-main>
          <v-container>
      
          </v-container>
        </v-main>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import Navbar from '~/components/ui/Navbar.vue'
import AppHeader from '~/components/ui/AppHeader.vue'


</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 90vh;
}

/* Left sidebar */
.layout-navbar {
  flex-shrink: 0;
}

/* Right side (Header + Content) */
.layout-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* Top header */
.layout-header {
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Page body */
.v-main {
  flex-grow: 1;
  padding: 20px;
}
</style>
