<template>
    <v-app>
        <!-- Sidebar -->
        <v-navigation-drawer v-model="drawer" permanent color="white" width="260" class="elevation-1">
            <div class="pa-4">
                <div class="d-flex align-center mb-6">
                    <v-avatar color="primary" size="40" class="mr-3">
                        <v-icon color="white">mdi-school</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-h6 font-weight-bold">Lecturer</div>
                        <div class="text-caption text-grey">Portal</div>
                    </div>
                </div>
            </div>

            <v-divider></v-divider>

            <!-- Navigation Items -->
            <v-list density="comfortable" nav class="px-2">
                <v-list-item to="/lecturer/dashboard" prepend-icon="mdi-view-dashboard" rounded="lg" class="mb-1">
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>

                <v-list-item to="/lecturer/class" prepend-icon="mdi-google-classroom" rounded="lg" class="mb-1">
                    <v-list-item-title>Class</v-list-item-title>
                </v-list-item>

                <v-list-item to="/lecturer/schedule" prepend-icon="mdi-calendar-clock" rounded="lg" class="mb-1">
                    <v-list-item-title>Schedule</v-list-item-title>
                </v-list-item>

                <v-list-item to="/lecturer/RequestLeave" prepend-icon="mdi-calendar-remove" rounded="lg" class="mb-1">
                    <v-list-item-title>Request Leave</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- App Bar -->
        <v-app-bar color="white" elevation="0" class="border-b">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">{{ pageTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn icon variant="text">
                <v-icon>mdi-bell-outline</v-icon>
            </v-btn>

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-avatar color="primary" size="36">
                            <span class="text-white text-caption">DR</span>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item prepend-icon="mdi-account" to="/lecturer/profile">
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item prepend-icon="mdi-cog" to="/lecturer/settings">
                        <v-list-item-title>Settings</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi-logout" @click="logout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <!-- Main Content -->
        <v-main class="bg-grey-lighten-4">
            <slot />
        </v-main>
    </v-app>
</template>

<script setup>
const drawer = ref(true)
const route = useRoute()

const pageTitle = computed(() => {
    const titles = {
        '/lecturer/dashboard': 'Dashboard',
        '/lecturer/class': 'My Classes',
        '/lecturer/schedule': 'Schedule',
        '/lecturer/RequestLeave': 'Request Leave'
    }
    return titles[route.path] || 'Lecturer Portal'
})

const logout = async () => {
    const { logout } = useAuth()
    await logout()
}
</script>

<style scoped>
.border-b {
    border-bottom: 1px solid #e0e0e0;
}
</style>