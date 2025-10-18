<template>
    <div>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-6">Admin Dashboard</h1>
            </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row>
            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="primary" class="mr-3">mdi-account-group</v-icon>
                            <div>
                                <div class="text-h6">Total Users</div>
                                <div class="text-h4">{{ stats.totalUsers }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="success" class="mr-3">mdi-school</v-icon>
                            <div>
                                <div class="text-h6">Active Classes</div>
                                <div class="text-h4">{{ stats.activeClasses }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="warning" class="mr-3">mdi-calendar-check</v-icon>
                            <div>
                                <div class="text-h6">Today's Sessions</div>
                                <div class="text-h4">{{ stats.todaySessions }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="info" class="mr-3">mdi-percent</v-icon>
                            <div>
                                <div class="text-h6">Attendance Rate</div>
                                <div class="text-h4">{{ stats.attendanceRate }}%</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Recent Activities -->
        <v-row class="mt-6">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>Recent Activities</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="activity in recentActivities" :key="activity.id">
                                <v-list-item-content>
                                    <v-list-item-title>{{ activity.title }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ activity.time }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Quick Actions</v-card-title>
                    <v-card-text>
                        <v-btn block class="mb-2" color="primary" to="/admin/users">
                            <v-icon left>mdi-account-plus</v-icon>
                            Add New User
                        </v-btn>
                        <v-btn block class="mb-2" color="secondary" to="/admin/classes">
                            <v-icon left>mdi-plus</v-icon>
                            Create Class
                        </v-btn>
                        <v-btn block color="success" to="/admin/reports">
                            <v-icon left>mdi-file-chart</v-icon>
                            Generate Report
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'role-admin']
})

const stats = ref({
    totalUsers: 156,
    activeClasses: 24,
    todaySessions: 12,
    attendanceRate: 85
})

const recentActivities = ref([
    { id: 1, title: 'New student registered', time: '2 minutes ago' },
    { id: 2, title: 'Class schedule updated', time: '1 hour ago' },
    { id: 3, title: 'Attendance report generated', time: '3 hours ago' },
    { id: 4, title: 'New lecturer added', time: '1 day ago' }
])
</script>