<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" permanent>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Lecturer Panel
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <!-- Navigation Items -->
                <v-list-item to="/lecturer/dashboard" prepend-icon="mdi-view-dashboard">
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>

                <v-list-item to="/lecturer/classes" prepend-icon="mdi-school">
                    <v-list-item-title>My Classes</v-list-item-title>
                </v-list-item>

                <v-list-item to="/lecturer/insights" prepend-icon="mdi-chart-line">
                    <v-list-item-title>Insights</v-list-item-title>
                </v-list-item>

                <v-list-item to="/lecturer/leave" prepend-icon="mdi-calendar-remove">
                    <v-list-item-title>Leave Requests</v-list-item-title>
                </v-list-item>

                <v-list-item to="/request_leave" prepend-icon="mdi-account-plus">
                    <v-list-item-title>Request Leave</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>UAS Lecturer</v-toolbar-title>
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