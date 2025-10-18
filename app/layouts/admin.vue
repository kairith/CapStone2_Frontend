<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Admin Panel
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        
        <!-- Navigation Items -->
        <v-list-item to="/admin/dashboard" prepend-icon="mdi-view-dashboard">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/admin/users" prepend-icon="mdi-account-group">
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/admin/classes" prepend-icon="mdi-school">
          <v-list-item-title>Classes</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/admin/schedules" prepend-icon="mdi-calendar">
          <v-list-item-title>Schedules</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/admin/reports" prepend-icon="mdi-chart-line">
          <v-list-item-title>Reports</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/admin/backup" prepend-icon="mdi-backup-restore">
          <v-list-item-title>Backup</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/admin/settings" prepend-icon="mdi-cog">
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>UAS Admin</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)

const logout = async () => {
  const { logout } = useAuth()
  await logout()
}
</script>