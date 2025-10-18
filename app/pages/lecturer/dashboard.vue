<template>
    <div>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-6">Lecturer Dashboard</h1>
            </v-col>
        </v-row>

        <!-- Welcome Card -->
        <v-row>
            <v-col cols="12">
                <v-card color="primary" dark>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <div class="flex-grow-1">
                                <h2 class="text-h5 mb-2">Welcome, {{ lecturerName }}!</h2>
                                <p class="mb-0">Department: {{ department }}</p>
                            </div>
                            <v-icon size="64">mdi-account-tie</v-icon>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Quick Stats -->
        <v-row class="mt-4">
            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="primary" class="mr-3">mdi-school</v-icon>
                            <div>
                                <div class="text-h6">My Classes</div>
                                <div class="text-h4">{{ totalClasses }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="success" class="mr-3">mdi-account-group</v-icon>
                            <div>
                                <div class="text-h6">Total Students</div>
                                <div class="text-h4">{{ totalStudents }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="warning" class="mr-3">mdi-calendar</v-icon>
                            <div>
                                <div class="text-h6">Today's Sessions</div>
                                <div class="text-h4">{{ todaySessions }}</div>
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
                                <div class="text-h6">Avg Attendance</div>
                                <div class="text-h4">{{ avgAttendance }}%</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Today's Classes -->
        <v-row class="mt-6">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>Today's Classes</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="class_item in todayClasses" :key="class_item.id" class="mb-2">
                                <v-list-item-content>
                                    <v-list-item-title>{{ class_item.subject }} - {{ class_item.group
                                        }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ class_item.time }} - {{ class_item.room }} - {{ class_item.students }}
                                        students
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn small :color="class_item.status === 'completed' ? 'success' : 'primary'"
                                        :to="`/lecturer/classes/${class_item.id}`">
                                        {{ class_item.status === 'completed' ? 'View' : 'Take Attendance' }}
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Recent Leave Requests</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="leave in recentLeaves" :key="leave.id" class="mb-2">
                                <v-list-item-content>
                                    <v-list-item-title>{{ leave.student }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ leave.date }} - {{ leave.reason }}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-chip :color="leave.status === 'pending' ? 'warning' : 'success'" small>
                                        {{ leave.status }}
                                    </v-chip>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                        <v-btn block class="mt-4" color="primary" to="/lecturer/leave">
                            View All Requests
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'lecturer',
    middleware: ['auth', 'role-lecturer']
})

const lecturerName = ref('Dr. Jane Smith')
const department = ref('Computer Science')
const totalClasses = ref(6)
const totalStudents = ref(120)
const todaySessions = ref(3)
const avgAttendance = ref(85)

const todayClasses = ref([
    {
        id: 1,
        subject: 'Data Structures',
        group: 'CS-A',
        time: '09:00 - 11:00',
        room: 'Lab 101',
        students: 30,
        status: 'completed'
    },
    {
        id: 2,
        subject: 'Algorithms',
        group: 'CS-B',
        time: '14:00 - 16:00',
        room: 'Room 205',
        students: 25,
        status: 'upcoming'
    },
    {
        id: 3,
        subject: 'Database Systems',
        group: 'CS-C',
        time: '16:30 - 18:30',
        room: 'Lab 102',
        students: 28,
        status: 'upcoming'
    }
])

const recentLeaves = ref([
    {
        id: 1,
        student: 'John Doe',
        date: '2024-10-20',
        reason: 'Medical',
        status: 'pending'
    },
    {
        id: 2,
        student: 'Alice Johnson',
        date: '2024-10-19',
        reason: 'Family emergency',
        status: 'approved'
    },
    {
        id: 3,
        student: 'Bob Wilson',
        date: '2024-10-18',
        reason: 'Personal',
        status: 'pending'
    }
])
</script>