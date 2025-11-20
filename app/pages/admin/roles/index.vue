<template>
    <div class="roles-page pa-6">
        <v-row class="mb-6">
            <v-col cols="12">
                <h1 class="text-h4 font-weight-bold">Roles Management</h1>
                <p class="text-subtitle-1 text-grey">Manage user roles and permissions</p>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-card elevation="2">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>Roles List</span>
                        <v-btn color="primary" prepend-icon="mdi-plus">
                            Add Role
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>Role Name</th>
                                    <th>Permissions</th>
                                    <th>Users</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="role in roles" :key="role.id">
                                    <td>{{ role.name }}</td>
                                    <td>{{ role.permissions }}</td>
                                    <td>{{ role.userCount }}</td>
                                    <td>
                                        <v-btn size="small" icon="mdi-pencil" variant="text"></v-btn>
                                        <v-btn size="small" icon="mdi-delete" variant="text" color="error"></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin', // 👈 Uses admin layout which includes Navbar automatically!
    // middleware: ['auth', 'role-admin']
})

const roles = ref([
    { id: 1, name: 'Admin', permissions: 'Full Access', userCount: 5 },
    { id: 2, name: 'Lecturer', permissions: 'Manage Classes', userCount: 24 },
    { id: 3, name: 'Student', permissions: 'View Only', userCount: 156 }
])
</script>

<style scoped>
.roles-page {
    min-height: 100vh;
}
</style>