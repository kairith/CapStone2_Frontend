<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <v-navigation-drawer v-model="drawer" permanent :width="260" class="sidebar-drawer" color="grey-darken-4">
      <!-- Logo Section -->
      <div class="pa-4 text-center">
        <v-icon size="40" color="white" class="mb-2">mdi-school-outline</v-icon>
        <h2 class="text-h6 text-white font-weight-bold">UAS Lecturer</h2>
        <p class="text-caption text-grey-lighten-1">v1.0</p>
      </div>
      <v-divider class="border-opacity-25"></v-divider>
      <!-- Navigation Menu -->
      <v-list nav class="mt-2" density="compact">
        <v-list-item to="/lecturer/dashboard" prepend-icon="mdi-view-dashboard" class="menu-item" rounded="lg">
          <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="/lecturer/classes" prepend-icon="mdi-school" class="menu-item" rounded="lg">
          <v-list-item-title class="text-body-2">My Classes</v-list-item-title>
        </v-list-item>
        <v-list-item to="/lecturer/insights" prepend-icon="mdi-chart-line" class="menu-item" rounded="lg">
          <v-list-item-title class="text-body-2">Insights</v-list-item-title>
        </v-list-item>
        <v-list-item to="/lecturer/leave" prepend-icon="mdi-calendar-remove" class="menu-item" rounded="lg">
          <v-list-item-title class="text-body-2">Leave Requests</v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- Bottom Section -->
      <template v-slot:append>
        <div class="pa-4">
          <v-divider class="mb-3 border-opacity-25"></v-divider>
          <v-list-item @click="logout" prepend-icon="mdi-logout" class="menu-item" rounded="lg">
            <v-list-item-title class="text-body-2">Logout</v-list-item-title>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>UAS Lecturer</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <!-- Main Content Area -->
    <v-main class="main-content">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
const logout = async () => {
  try {
    const { logout } = useAuth()
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.sidebar-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
.menu-item {
  margin: 4px 8px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
}
.menu-item.v-list-item--active {
  background-color: #1976d2 !important;
  color: white !important;
}
.menu-item.v-list-item--active .v-icon {
  color: white !important;
}
.main-content {
  background-color: #f5f5f5;
}
/* Custom scrollbar for sidebar */
.sidebar-drawer :deep(.v-navigation-drawer__content) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
.sidebar-drawer :deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  width: 6px;
}
.sidebar-drawer :deep(.v-navigation-drawer__content)::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-drawer :deep(.v-navigation-drawer__content)::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.sidebar-drawer :deep(.v-navigation-drawer__content)::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>